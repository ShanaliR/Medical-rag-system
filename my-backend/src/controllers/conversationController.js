require("dotenv").config();
const Patient = require("../models/PatientModel");
const MedicalDocument = require("../models/MedicalDocumentModel");
const ConsultationSession = require("../models/ConsultationSessionModel");
const { GoogleGenAI } = require("@google/genai");
const Prescription = require("../models/PrescriptionModel");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL = "embedding-001";
const CHAT_MODEL = "gemini-2.5-flash";

// Helper function to generate embeddings
async function generateEmbedding(text) {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });
    return result.embeddings[0].values;
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw error;
  }
}

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// 1. Register Patient with Embeddings
exports.registerPatient = async (req, res) => {
  const {
    patientId,
    name,
    age,
    weight,
    height,
    gender,
    bloodType,
    allergies,
    chronicConditions,
    medications,
    previousSurgeries,
    familyHistory,
    lifestyle,
    contactInfo,
  } = req.body;

  try {
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({
        message: "Patient with this ID already exists.",
      });
    }

    // Create comprehensive patient profile text for embedding
    const patientProfileText = `
      Patient ID: ${patientId}
      Name: ${name}
      Age: ${age} years old
      Gender: ${gender}
      Weight: ${weight} kg
      Height: ${height} cm
      Blood Type: ${bloodType || "Not specified"}
      
      Allergies: ${
        allergies?.length > 0 ? allergies.join(", ") : "None reported"
      }
      
      Chronic Conditions: ${
        chronicConditions?.length > 0
          ? chronicConditions.join(", ")
          : "None reported"
      }
      
      Current Medications: ${
        medications?.length > 0
          ? medications.map((m) => `${m.name} (${m.dosage})`).join(", ")
          : "None"
      }
      
      Previous Surgeries: ${
        previousSurgeries?.length > 0
          ? previousSurgeries
              .map((s) => `${s.procedure} on ${s.date}`)
              .join(", ")
          : "None"
      }
      
      Family History: ${
        familyHistory?.length > 0 ? familyHistory.join(", ") : "None reported"
      }
      
      Lifestyle: Smoking: ${lifestyle?.smoking || "No"}, Alcohol: ${
      lifestyle?.alcohol || "No"
    }, Exercise: ${lifestyle?.exercise || "Not specified"}
    `.trim();

    // Generate embedding for the patient profile
    const embedding = await generateEmbedding(patientProfileText);

    // Create new patient record
    const newPatient = new Patient({
      patientId,
      doctorId: req.doctor._id,
      name,
      age,
      weight,
      height,
      gender,
      bloodType,
      allergies: allergies || [],
      chronicConditions: chronicConditions || [],
      medications: medications || [],
      previousSurgeries: previousSurgeries || [],
      familyHistory: familyHistory || [],
      lifestyle: lifestyle || {},
      contactInfo: contactInfo || {},
      profileText: patientProfileText,
      embedding: embedding,
      registeredAt: new Date(),
    });

    await newPatient.save();

    res.status(201).json({
      message: "Patient registered successfully.",
      patientId: newPatient.patientId,
      name: newPatient.name,
      embeddingGenerated: true,
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({
      message: "Failed to register patient.",
      error: error.message,
    });
  }
};

// 2. Update Patient Information and Re-generate Embeddings
exports.updatePatient = async (req, res) => {
  const { patientId } = req.params;
  const updateData = req.body;

  try {
    //const patient = await Patient.findOne({ patientId });
    const patient = await Patient.findOne({
  patientId,
  doctorId: req.doctor._id,
});

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Update patient fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        patient[key] = updateData[key];
      }
    });

    // Regenerate profile text
    const patientProfileText = `
      Patient ID: ${patient.patientId}
      Name: ${patient.name}
      Age: ${patient.age} years old
      Gender: ${patient.gender}
      Weight: ${patient.weight} kg
      Height: ${patient.height} cm
      Blood Type: ${patient.bloodType || "Not specified"}
      
      Allergies: ${
        patient.allergies?.length > 0
          ? patient.allergies.join(", ")
          : "None reported"
      }
      
      Chronic Conditions: ${
        patient.chronicConditions?.length > 0
          ? patient.chronicConditions.join(", ")
          : "None reported"
      }
      
      Current Medications: ${
        patient.medications?.length > 0
          ? patient.medications.map((m) => `${m.name} (${m.dosage})`).join(", ")
          : "None"
      }
      
      Previous Surgeries: ${
        patient.previousSurgeries?.length > 0
          ? patient.previousSurgeries
              .map((s) => `${s.procedure} on ${s.date}`)
              .join(", ")
          : "None"
      }
      
      Family History: ${
        patient.familyHistory?.length > 0
          ? patient.familyHistory.join(", ")
          : "None reported"
      }
      
      Lifestyle: Smoking: ${patient.lifestyle?.smoking || "No"}, Alcohol: ${
      patient.lifestyle?.alcohol || "No"
    }, Exercise: ${patient.lifestyle?.exercise || "Not specified"}
    `.trim();

    // Regenerate embedding
    const embedding = await generateEmbedding(patientProfileText);

    patient.profileText = patientProfileText;
    patient.embedding = embedding;
    patient.updatedAt = new Date();

    await patient.save();

    res.status(200).json({
      message: "Patient information updated successfully.",
      patientId: patient.patientId,
      embeddingRegenerated: true,
    });
  } catch (error) {
    console.error("Patient update error:", error);
    res.status(500).json({
      message: "Failed to update patient.",
      error: error.message,
    });
  }
};

// 3. Start Consultation Session with Senior Doctor Bot
exports.startConsultation = async (req, res) => {
  const { patientId, doctorId, doctorName, initialQuery } = req.body;

  try {
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const initialMessage =
      initialQuery || "I need consultation about this patient.";

    const newSession = new ConsultationSession({
      patientId: patient._id,
      doctorId,
      doctorName,
      conversationLog: [{ role: "doctor", text: initialMessage }],
      status: "active",
      startedAt: new Date(),
    });

    await newSession.save();

    res.status(201).json({
      message: "Consultation session started.",
      sessionId: newSession._id,
      patientId: patient.patientId,
      patientName: patient.name,
    });
  } catch (error) {
    console.error("Consultation start error:", error);
    res.status(500).json({
      message: "Failed to start consultation session.",
      error: error.message,
    });
  }
};

// 4. Ask Question to Senior Doctor Bot (RAG-based)
exports.askSeniorDoctor = async (req, res) => {
  const { sessionId, question, selectedDoc } = req.body;

  try {
    const session = await ConsultationSession.findById(sessionId).populate(
      "patientId"
    );

    if (!session || session.status !== "active") {
      return res
        .status(404)
        .json({ message: "Active consultation session not found." });
    }

    const patient = session.patientId;

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);

    // Calculate similarity with patient profile
    const similarity = cosineSimilarity(questionEmbedding, patient.embedding);

    // Retrieve relevant patient context (RAG approach)
    let relevantContext = patient.profileText;

    // If selected documents are provided, retrieve and append their context
    if (selectedDoc && Array.isArray(selectedDoc) && selectedDoc.length > 0) {
      const documents = await MedicalDocument.find({
        _id: { $in: selectedDoc },
      }).select("originalContent");
      console.log("Retrieved Documents for Context:", documents);
      if (documents.length > 0) {
        relevantContext += "\n\n### SELECTED MEDICAL DOCUMENTS ###\n";
        documents.forEach((doc) => {
          relevantContext += `\n**Document:** ${doc}\n`;
        });
        relevantContext += "\n### END MEDICAL DOCUMENTS ###";
      }
    }

    console.log("Relevant Context:", relevantContext);




    // const prescriptions = await Prescription.find({
    //   patientId: patient.patientId,
    // })
    //   .sort({ createdAt: -1 })
    //   .limit(5)
    //   .select("prescriptionText");

    // if (prescriptions.length > 0) {
    //   relevantContext += "\n\n### PRESCRIPTION HISTORY ###\n";
    //   prescriptions.forEach((p) => {
    //     relevantContext += `\n${p.prescriptionText}\n`;
    //   });
    //   relevantContext += "\n### END PRESCRIPTIONS ###\n";
    // }





  // Retrieve prescriptions for context
  const prescriptions = await Prescription.find({
    patientId: patient.patientId,
  });

  if (prescriptions.length > 0) {
    relevantContext += "\n\n### PRESCRIPTIONS ###\n";
    prescriptions.forEach((p) => {
      relevantContext += `
      Issued by Dr. ${p.doctorName} on ${p.issuedAt}
      Diagnosis: ${p.diagnosis || "N/A"}
      Medications:
      ${p.medications
        .map(
          (m) =>
            `${m.name} (${m.dosage}) - ${m.frequency}, Duration: ${m.duration}`
        )
        .join("\n")}
      `;
    });
    relevantContext += "\n### END PRESCRIPTIONS ###";
  }





    // System instruction for Senior Doctor Bot
    const systemInstruction = `You are a Senior Supervisor Doctor AI Assistant helping junior doctors with patient consultations. 

### PATIENT INFORMATION (RETRIEVED FROM MEDICAL RECORDS) ###
${relevantContext}
### END PATIENT CONTEXT ###

GUIDELINES:
1. Base your advice STRICTLY on the provided patient information and medical documents.
2. Provide evidence-based medical guidance appropriate for a supervising physician.
3. Consider patient's allergies, chronic conditions, and current medications when giving advice.
4. Flag any potential drug interactions or contraindications.
5. If the question requires information not in the patient record, clearly state what additional information is needed.
6. Maintain professional medical terminology while being clear and actionable.
7. Always prioritize patient safety.
8. If the situation seems critical, recommend immediate actions or escalation.

Context Relevance Score: ${(similarity * 100).toFixed(1)}%`;

    // Build conversation history
    const history = session.conversationLog.map((entry) => ({
      role: entry.role === "doctor" ? "user" : "model",
      parts: [{ text: entry.text }],
    }));

    history.push({ role: "user", parts: [{ text: question }] });

    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: { systemInstruction },
      history: history,
    });

    const aiResponse = await chat.sendMessage({ message: question });
    const aiResponseText = aiResponse.text.trim();

    // Save conversation
    session.conversationLog.push(
      { role: "doctor", text: question },
      { role: "senior_doctor", text: aiResponseText }
    );

    await session.save();

    res.status(200).json({
      sessionId: sessionId,
      role: "senior_doctor",
      response: aiResponseText,
      relevanceScore: (similarity * 100).toFixed(1),
      questionCount: session.conversationLog.filter(
        (entry) => entry.role === "doctor"
      ).length,
    });
  } catch (error) {
    console.error("Consultation question error:", error);
    res.status(500).json({
      message: "Error processing consultation question.",
      error: error.message,
    });
  }
};

// 5. Get Patient Information
// 5a. Get All Patients
exports.getAllPatients = async (req, res) => {
  try {
    //const patients = await Patient.find().select("-embedding");
    const patients = await Patient.find({
  doctorId: req.doctor._id,
}).select("-embedding");

    res.status(200).json({
      count: patients.length,
      patients: patients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patients.",
      error: error.message,
    });
  }
};

// 5b. Get Patient by ID
exports.getPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    //const patient = await Patient.findOne({ patientId }).select("-embedding");
    const patient = await Patient.findOne({
  patientId,
  doctorId: req.doctor._id,
}).select("-embedding");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving patient information.",
      error: error.message,
    });
  }
};

// 6. Get Consultation Session
exports.getConsultation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ConsultationSession.findById(sessionId).populate(
      "patientId",
      "-embedding"
    );

    if (!session) {
      return res
        .status(404)
        .json({ message: "Consultation session not found." });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving consultation session.",
      error: error.message,
    });
  }
};

// 7. End Consultation Session
exports.endConsultation = async (req, res) => {
  const { sessionId } = req.params;
  const { summary } = req.body;

  try {
    const session = await ConsultationSession.findById(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ message: "Consultation session not found." });
    }

    session.status = "completed";
    session.endedAt = new Date();
    session.summary = summary || "Consultation completed.";

    await session.save();

    res.status(200).json({
      message: "Consultation session ended.",
      sessionId: session._id,
      duration: Math.round((session.endedAt - session.startedAt) / 1000 / 60),
    });
  } catch (error) {
    console.error("End consultation error:", error);
    res.status(500).json({
      message: "Failed to end consultation session.",
      error: error.message,
    });
  }
};

// 8. Search Patients by Similarity
exports.searchPatientsBySimilarity = async (req, res) => {
  const { searchQuery, topK = 5 } = req.body;

  try {
    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(searchQuery);

    // Get all patients
    // const patients = await Patient.find().select(
    //   "patientId name age embedding"
    // );
    const patients = await Patient.find({
  doctorId: req.doctor._id,
}).select("patientId name age embedding");

    // Calculate similarities
    const patientsWithScores = patients.map((patient) => ({
      patientId: patient.patientId,
      name: patient.name,
      age: patient.age,
      similarity: cosineSimilarity(queryEmbedding, patient.embedding),
    }));

    // Sort by similarity and get top K
    const topPatients = patientsWithScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    res.status(200).json({
      query: searchQuery,
      results: topPatients,
    });
  } catch (error) {
    console.error("Patient search error:", error);
    res.status(500).json({
      message: "Error searching patients.",
      error: error.message,
    });
  }
};
