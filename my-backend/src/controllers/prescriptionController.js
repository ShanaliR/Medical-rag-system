require("dotenv").config();
const Prescription = require("../models/PrescriptionModel");
const Patient = require("../models/PatientModel");
const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");


if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper: generate embedding
async function generateEmbedding(text) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return result.embeddings[0].values;
}

//
// Add Prescription
//
// exports.addPrescription = async (req, res) => {
//   try {
//     const { patientId, medications, diagnosis, notes } = req.body;

//     const doctorId = req.doctor.doctorId;
//     const doctorName = req.doctor.fullName;

//     const patient = await Patient.findOne({ patientId });
//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found." });
//     }

//     if (!medications || medications.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one medication is required." });
//     }

//     // Build prescription text for embedding
//     const prescriptionText = `
//       Prescription for Patient: ${patient.name}
//       Diagnosis: ${diagnosis || "Not specified"}

//       Medications:
//       ${medications
//         .map(
//           (m) =>
//             `${m.name} - ${m.dosage}, ${m.frequency}, Duration: ${m.duration}, Instructions: ${m.instructions || "None"}`
//         )
//         .join("\n")}

//       Notes: ${notes || "None"}
//     `.trim();

//     const embedding = await generateEmbedding(prescriptionText);

//     const prescription = new Prescription({
//       patientId,
//       doctorId,
//       doctorName,
//       medications,
//       diagnosis,
//       notes,
//       embedding,
//     });

//     await prescription.save();

//     res.status(201).json({
//       message: "Prescription added successfully.",
//       prescriptionId: prescription._id,
//     });
//   } catch (error) {
//     console.error("Add prescription error:", error);
//     res.status(500).json({
//       message: "Failed to add prescription.",
//       error: error.message,
//     });
//   }
// };


exports.addPrescription = async (req, res) => {
  try {
    const { patientId, medications, diagnosis, notes } = req.body;

    const doctorId = req.doctor.doctorId;
    const doctorName = req.doctor.fullName;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (!medications || medications.length === 0) {
      return res.status(400).json({
        message: "At least one medication is required.",
      });
    }

   
    //  DRUG INTERACTION CHECK
    
    if (medications.length > 1) {
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {

          const drugA = medications[i].name.trim();
          const drugB = medications[j].name.trim();

          try {
            const ddiResponse = await axios.post(
              "https://fast-api-ddi.onrender.com/predict",
              {
                drugA: drugA,
                drugB: drugB,
              },
              {
                timeout: 30000,
                headers: { "Content-Type": "application/json" },
              }
            );

            const result = ddiResponse.data;

            console.log("DDI Result:", result);

            // if (result && result.probability >= 0.5) {
            //   return res.status(400).json({
            //     message: `⚠ Drug interaction detected between ${drugA} and ${drugB}`,
            //     risk: result.risk,
            //     probability: result.probability,
            //   });
            // }

            if (result && result.probability >= 0.5 && !req.body.overrideInteraction) {
            return res.status(400).json({
              message: `Drug interaction detected between ${drugA} and ${drugB}`,
              risk: result.risk,
              probability: result.probability,
            });
          }

          } catch (ddiError) {
            console.error("DDI API Error:", ddiError.response?.data || ddiError.message);

            return res.status(503).json({
              message: "Drug interaction service unavailable. Please try again.",
            });
          }
        }
      }
    }


    // SAFE → GENERATE EMBEDDING
 

    const prescriptionText = `
Prescription for Patient: ${patient.name}
Diagnosis: ${diagnosis || "Not specified"}

Medications:
${medications
  .map(
    (m) =>
      `${m.name} - ${m.dosage}, ${m.frequency}, Duration: ${m.duration}`
  )
  .join("\n")}

Notes: ${notes || "None"}
`.trim();

    const embedding = await generateEmbedding(prescriptionText);

    const prescription = new Prescription({
      patientId,
      doctorId,
      doctorName,
      medications,
      diagnosis,
      notes,
      embedding,
    });

    await prescription.save();

    return res.status(201).json({
      message: "Prescription added successfully.",
      prescriptionId: prescription._id,
    });

  } catch (error) {
    console.error("Add prescription error:", error);

    return res.status(500).json({
      message: "Failed to add prescription.",
      error: error.message,
    });
  }
};

// Get All Prescriptions for Patient

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId }).sort({
      issuedAt: -1,
    });

    res.status(200).json({
      patientId,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve prescriptions.",
      error: error.message,
    });
  }
};


// Delete Prescription

exports.deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const deleted = await Prescription.findByIdAndDelete(prescriptionId);

    if (!deleted) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.status(200).json({
      message: "Prescription deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete prescription.",
      error: error.message,
    });
  }
};
