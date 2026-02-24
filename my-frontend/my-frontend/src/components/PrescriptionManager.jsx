// import React, { useEffect, useState } from "react";
// import { PlusCircle, Trash2, FileText } from "lucide-react";

// const API_BASE_URL = "http://localhost:8000/api/prescriptions";

// const PrescriptionManager = ({ patientId }) => {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);

//   const [formData, setFormData] = useState({
//     diagnosis: "",
//     notes: "",
//     medications: [
//       {
//         name: "",
//         dosage: "",
//         frequency: "",
//         duration: "",
//         instructions: "",
//       },
//     ],
//   });

//   // FETCH 
//   const fetchPrescriptions = async () => {
//     if (!patientId) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/${patientId}`);
//       const data = await res.json();

//       if (res.ok) {
//         setPrescriptions(data.prescriptions || []);
//       } else {
//         console.error(data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPrescriptions();
//   }, [patientId]);

//   //  HANDLE MEDICATION CHANGE 
//   const handleMedicationChange = (index, field, value) => {
//     const updated = [...formData.medications];
//     updated[index][field] = value;
//     setFormData({ ...formData, medications: updated });
//   };

//   const addMedicationField = () => {
//     setFormData({
//       ...formData,
//       medications: [
//         ...formData.medications,
//         { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
//       ],
//     });
//   };

//   const removeMedicationField = (index) => {
//     const updated = formData.medications.filter((_, i) => i !== index);
//     setFormData({ ...formData, medications: updated });
//   };

//   // ADD PRESCRIPTION 
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.medications.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
//       alert("All medication required fields must be filled.");
//       return;
//     }

//     const payload = {
//       patientId,
//       doctorId: "DOC-001",
//       doctorName: "Dr. Smith",
//       diagnosis: formData.diagnosis,
//       medications: formData.medications,
//       notes: formData.notes,
//     };

//     try {
//       const res = await fetch(API_BASE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Prescription added successfully");
//         setIsAdding(false);
//         setFormData({
//           diagnosis: "",
//           notes: "",
//           medications: [
//             { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
//           ],
//         });
//         fetchPrescriptions();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   //  DELETE 
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this prescription?")) return;

//     await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
//     fetchPrescriptions();
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-semibold flex items-center gap-2">
//           <FileText className="w-5 h-5 text-blue-600" />
//           Prescriptions
//         </h3>
//         <button
//           onClick={() => setIsAdding(!isAdding)}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {isAdding ? "Cancel" : "Add Prescription"}
//         </button>
//       </div>

//       {isAdding && (
//         <form onSubmit={handleSubmit} className="space-y-4 mb-6 border p-4 rounded">
//           <input
//             type="text"
//             placeholder="Diagnosis"
//             value={formData.diagnosis}
//             onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
//             className="w-full border p-2 rounded"
//           />

//           {formData.medications.map((med, index) => (
//             <div key={index} className="border p-3 rounded space-y-2 bg-gray-50">
//               <input
//                 type="text"
//                 placeholder="Medication Name"
//                 value={med.name}
//                 onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Dosage"
//                 value={med.dosage}
//                 onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Frequency"
//                 value={med.frequency}
//                 onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Duration"
//                 value={med.duration}
//                 onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Instructions"
//                 value={med.instructions}
//                 onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
//                 className="w-full border p-2 rounded"
//               />

//               {formData.medications.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeMedicationField(index)}
//                   className="text-red-600 flex items-center gap-1"
//                 >
//                   <Trash2 size={16} /> Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addMedicationField}
//             className="text-blue-600 flex items-center gap-1"
//           >
//             <PlusCircle size={16} /> Add Another Medication
//           </button>

//           <textarea
//             placeholder="Notes"
//             value={formData.notes}
//             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//             className="w-full border p-2 rounded"
//           />

//           <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
//             Save Prescription
//           </button>
//         </form>
//       )}

//       {loading ? (
//         <p>Loading...</p>
//       ) : prescriptions.length === 0 ? (
//         <p className="text-gray-500">No prescriptions found.</p>
//       ) : (
//         prescriptions.map((p) => (
//           <div key={p._id} className="border p-4 rounded mb-4 bg-gray-50">
//             <p><strong>Diagnosis:</strong> {p.diagnosis}</p>

//             {p.medications.map((m, i) => (
//               <div key={i} className="ml-4 mt-2">
//                 <p><strong>{m.name}</strong></p>
//                 <p>Dosage: {m.dosage}</p>
//                 <p>Frequency: {m.frequency}</p>
//                 <p>Duration: {m.duration}</p>
//                 {m.instructions && <p>Instructions: {m.instructions}</p>}
//               </div>
//             ))}

//             {p.notes && <p className="mt-2">Notes: {p.notes}</p>}

//             <p className="text-sm text-gray-500 mt-2">
//               {new Date(p.issuedAt).toLocaleString()}
//             </p>

//             <button
//               onClick={() => handleDelete(p._id)}
//               className="text-red-600 mt-2"
//             >
//               Delete
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default PrescriptionManager;



import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/prescriptions";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Doctor not authenticated");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const PrescriptionManager = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    diagnosis: "",
    notes: "",
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
  });

  // NOTIFICATION SYSTEM 
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // FETCH 
  const fetchPrescriptions = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      //const res = await fetch(`${API_BASE_URL}/${patientId}`);
      const res = await fetch(`${API_BASE_URL}/${patientId}`, {
  headers: getAuthHeaders(),
});
      const data = await res.json();

      if (res.ok) {
        setPrescriptions(data.prescriptions || []);
      }
    } catch (err) {
      showNotification("Failed to load prescriptions", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  // MEDICATION CHANGE 
  const handleMedicationChange = (index, field, value) => {
    const updated = [...formData.medications];
    updated[index][field] = value;
    setFormData({ ...formData, medications: updated });
  };

  const addMedicationField = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    });
  };

  const removeMedicationField = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: updated });
  };

  // ADD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.medications.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      showNotification("All medication required fields must be filled.", "error");
      return;
    }

    // const payload = {
    //   patientId,
    //   doctorId: "DOC-001",
    //   doctorName: "Dr. Smith",
    //   diagnosis: formData.diagnosis,
    //   medications: formData.medications,
    //   notes: formData.notes,
    // };


    // const payload = {
      //   patientId: patient.patientId,
      //   doctorId: "DOC001", // Hardcoded
      //   doctorName: "Dr. Smith", // Hardcoded
      // };

    //   const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

    //   const payload = {
    //   patientId,
    //   doctorId: storedDoctor._id,
    //   doctorName: storedDoctor.name,
    //   diagnosis: formData.diagnosis,
    //   medications: formData.medications,
    //   notes: formData.notes,
    // };

    const payload = {
  patientId,
  diagnosis: formData.diagnosis,
  medications: formData.medications,
  notes: formData.notes,
};

    try {
      // const res = await fetch(API_BASE_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      const res = await fetch(API_BASE_URL, {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify(payload),
});

      const data = await res.json();

      if (res.ok) {
        showNotification("Prescription added successfully", "success");
        setIsAdding(false);
        setFormData({
          diagnosis: "",
          notes: "",
          medications: [
            { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
          ],
        });
        fetchPrescriptions();
      } else {
        showNotification(data.message || "Failed to add prescription", "error");
      }
    } catch (err) {
      showNotification("Server error occurred", "error");
    }
  };

  // DELETE 
  const handleDelete = async (id) => {
    try {
      //const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      const res = await fetch(`${API_BASE_URL}/${id}`, {
  method: "DELETE",
  headers: getAuthHeaders(),
});

      if (res.ok) {
        showNotification("Prescription deleted successfully", "success");
        fetchPrescriptions();
      } else {
        showNotification("Failed to delete prescription", "error");
      }
    } catch {
      showNotification("Server error occurred", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Prescriptions
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isAdding ? "Cancel" : "Add Prescription"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 border p-4 rounded">
          <input
            type="text"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            className="w-full border p-2 rounded"
          />

          {formData.medications.map((med, index) => (
            <div key={index} className="border p-3 rounded space-y-2 bg-gray-50">
              <input
                type="text"
                placeholder="Medication Name"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                className="w-full border p-2 rounded"
              />

              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicationField(index)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicationField}
            className="text-blue-600 flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Another Medication
          </button>

          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save Prescription
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions found.</p>
      ) : (
        prescriptions.map((p) => (
          <div key={p._id} className="border p-4 rounded mb-4 bg-gray-50">
            <p><strong>Diagnosis:</strong> {p.diagnosis}</p>

            {p.medications.map((m, i) => (
              <div key={i} className="ml-4 mt-2">
                <p><strong>{m.name}</strong></p>
                <p>Dosage: {m.dosage}</p>
                <p>Frequency: {m.frequency}</p>
                <p>Duration: {m.duration}</p>
              </div>
            ))}

            <p className="text-sm text-gray-500 mt-2">
              {new Date(p.issuedAt).toLocaleString()}
            </p>

            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-600 mt-2"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PrescriptionManager;