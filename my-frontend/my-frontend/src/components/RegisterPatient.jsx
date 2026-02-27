import React, { useState } from "react";
import {
  User,
  MessageSquare,
  Search,
  Plus,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const baseURL = process.env.REACT_APP_CENTRAL_API_GATEWAY_URL 
  ? `${process.env.REACT_APP_CENTRAL_API_GATEWAY_URL}/api/medical-rag/api/prescriptions`
  : 'http://localhost:8080/api/medical-rag/api/prescriptions';
//const API_BASE_URL = "http://localhost:8000/api"; // Change to your backend URL

export const RegisterPatient = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationSession, setConsultationSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "Male",
    bloodType: "A+",
    allergies: "",
    chronicConditions: "",
    medications: [],
    lifestyle: {
      smoking: "No",
      alcohol: "No",
      exercise: "Regular",
    },
  });

  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const payload = {
  //     ...formData,
  //     age: parseInt(formData.age),
  //     weight: parseFloat(formData.weight),
  //     height: parseFloat(formData.height),
  //     allergies: formData.allergies
  //       .split(",")
  //       .map((a) => a.trim())
  //       .filter(Boolean),
  //     chronicConditions: formData.chronicConditions
  //       .split(",")
  //       .map((c) => c.trim())
  //       .filter(Boolean),
  //   };

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/patients/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       showNotification(
  //         `Patient ${data.name} registered successfully!`,
  //         "success"
  //       );
  //       setFormData({
  //         patientId: "",
  //         name: "",
  //         age: "",
  //         weight: "",
  //         height: "",
  //         gender: "Male",
  //         bloodType: "A+",
  //         allergies: "",
  //         chronicConditions: "",
  //         medications: [],
  //         lifestyle: { smoking: "No", alcohol: "No", exercise: "Regular" },
  //       });
  //       setMedication({ name: "", dosage: "", frequency: "" });
  //     } else {
  //       showNotification(data.message || "Registration failed", "error");
  //     }
  //   } catch (error) {
  //     showNotification("Error connecting to server", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };




//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const token = localStorage.getItem("token");

//   if (!token) {
//     showNotification("Doctor not authenticated. Please login again.", "error");
//     setLoading(false);
//     return;
//   }

//   const payload = {
//     ...formData,
//     age: parseInt(formData.age),
//     weight: parseFloat(formData.weight),
//     height: parseFloat(formData.height),
//     allergies: formData.allergies
//       .split(",")
//       .map((a) => a.trim())
//       .filter(Boolean),
//     chronicConditions: formData.chronicConditions
//       .split(",")
//       .map((c) => c.trim())
//       .filter(Boolean),
//   };

//   try {
//     const response = await fetch(`${API_BASE_URL}/patients/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // 🔐 doctor JWT
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       showNotification(
//         `Patient ${data.patient?.name || payload.name} registered successfully!`,
//         "success"
//       );

//       setFormData({
//         patientId: "",
//         name: "",
//         age: "",
//         weight: "",
//         height: "",
//         gender: "Male",
//         bloodType: "A+",
//         allergies: "",
//         chronicConditions: "",
//         medications: [],
//         lifestyle: { smoking: "No", alcohol: "No", exercise: "Regular" },
//       });

//       setMedication({ name: "", dosage: "", frequency: "" });
//     } else {
//       showNotification(data.message || "Registration failed", "error");
//     }
//   } catch (error) {
//     console.error(error);
//     showNotification("Error connecting to server", "error");
//   } finally {
//     setLoading(false);
//   }
// };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Doctor not authenticated. Please login again.", "error");
      setLoading(false);
      return;
    }

    // Format payload correctly
    const payload = {
      ...formData,
      age: parseInt(formData.age) || 0,
      weight: parseFloat(formData.weight) || 0,
      height: parseFloat(formData.height) || 0,
      allergies: formData.allergies
        ? formData.allergies.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      chronicConditions: formData.chronicConditions
        ? formData.chronicConditions.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      medications: formData.medications || [],
    };

    try {
      const response = await fetch(`${baseURL}/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(`Patient ${data.patient?.name || payload.name} registered successfully!`, "success");

        // Reset form
        setFormData({
          patientId: "",
          name: "",
          age: "",
          weight: "",
          height: "",
          gender: "Male",
          bloodType: "A+",
          allergies: "",
          chronicConditions: "",
          medications: [],
          lifestyle: { smoking: "No", alcohol: "No", exercise: "Regular" },
        });
        setMedication({ name: "", dosage: "", frequency: "" });
      } else {
        showNotification(data.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error connecting to server", "error");
    } finally {
      setLoading(false);
    }
  };




  const addMedication = () => {
    if (medication.name && medication.dosage) {
      setFormData({
        ...formData,
        medications: [...formData.medications, { ...medication }],
      });
      setMedication({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-600" />
        Register New Patient
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient ID *
            </label>
            <input
              type="text"
              required
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="P-12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              required
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="70.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="175"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergies (comma-separated)
          </label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Penicillin, Peanuts, Latex"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chronic Conditions (comma-separated)
          </label>
          <input
            type="text"
            value={formData.chronicConditions}
            onChange={(e) =>
              setFormData({ ...formData, chronicConditions: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Diabetes Type 2, Hypertension"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Current Medications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <input
              type="text"
              value={medication.name}
              onChange={(e) =>
                setMedication({ ...medication, name: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Medication name"
            />
            <input
              type="text"
              value={medication.dosage}
              onChange={(e) =>
                setMedication({ ...medication, dosage: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Dosage (e.g., 500mg)"
            />
            <input
              type="text"
              value={medication.frequency}
              onChange={(e) =>
                setMedication({ ...medication, frequency: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Frequency (e.g., 2x daily)"
            />
            <button
              type="button"
              onClick={addMedication}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>

          {formData.medications.length > 0 && (
            <div className="space-y-2">
              {formData.medications.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <span className="text-sm">
                    {med.name} - {med.dosage}{" "}
                    {med.frequency && `(${med.frequency})`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Lifestyle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Smoking
              </label>
              <select
                value={formData.lifestyle.smoking}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lifestyle: {
                      ...formData.lifestyle,
                      smoking: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>No</option>
                <option>Yes</option>
                <option>Former</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alcohol
              </label>
              <select
                value={formData.lifestyle.alcohol}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lifestyle: {
                      ...formData.lifestyle,
                      alcohol: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>No</option>
                <option>Yes</option>
                <option>Occasionally</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise
              </label>
              <select
                value={formData.lifestyle.exercise}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lifestyle: {
                      ...formData.lifestyle,
                      exercise: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Regular</option>
                <option>Occasional</option>
                <option>Sedentary</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
};
