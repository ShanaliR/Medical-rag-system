//import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import { Search, Edit3, AlertCircle, CheckCircle, Loader } from "lucide-react";
import DocumentManager from "./DocumentManager";
import PrescriptionManager from "./PrescriptionManager";


const API_BASE_URL = "http://localhost:8000/api";
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

const UpdatePatient = () => {
  const [searchId, setSearchId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [allPatients, setAllPatients] = useState([]);


  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "Male",
    bloodType: "A+",
    allergies: "",
    chronicConditions: "",
    lifestyle: {
      smoking: "No",
      alcohol: "No",
      exercise: "Regular",
    },
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

    useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        //const response = await fetch(`${API_BASE_URL}/patients`);
        const response = await fetch(`${API_BASE_URL}/patients`, {
  headers: getAuthHeaders(),
});
        const data = await response.json();

        if (response.ok) {
        if (Array.isArray(data)) {
          setAllPatients(data);
        } else if (Array.isArray(data.patients)) {
          setAllPatients(data.patients);
        } else if (Array.isArray(data.data)) {
          setAllPatients(data.data);
        } else {
          setAllPatients([]);
          showNotification("Unexpected patient data format", "error");
        }


        } else {
          showNotification("Failed to load patients", "error");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        showNotification("Error loading patients", "error");
      }
    };

    fetchAllPatients();
  }, []);


  const searchPatient = async () => {
    if (!searchId.trim()) {
      showNotification("Please enter a patient ID", "error");
      return;
    }

    setLoading(true);
    try {
      // const response = await fetch(
      //   `${API_BASE_URL}/patients/${searchId.trim()}`
      // );
      const response = await fetch(
  `${API_BASE_URL}/patients/${searchId.trim()}`,
  {
    headers: getAuthHeaders(),
  }
);
      const data = await response.json();

      if (response.ok) {
        setSelectedPatient(data);
        setFormData({
          name: data.name || "",
          age: data.age || "",
          weight: data.weight || "",
          height: data.height || "",
          gender: data.gender || "Male",
          bloodType: data.bloodType || "A+",
          allergies: Array.isArray(data.allergies)
            ? data.allergies.join(", ")
            : data.allergies || "",
          chronicConditions: Array.isArray(data.chronicConditions)
            ? data.chronicConditions.join(", ")
            : data.chronicConditions || "",
          lifestyle: data.lifestyle || {
            smoking: "No",
            alcohol: "No",
            exercise: "Regular",
          },
        });
        showNotification("Patient found successfully", "success");
        setIsEditing(false);
      } else {
        showNotification(data.message || "Patient not found", "error");
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error("Error searching patient:", error);
      showNotification("Error searching patient", "error");
      setSelectedPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedPatient?.patientId) {
      showNotification("No patient selected", "error");
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      allergies: formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      chronicConditions: formData.chronicConditions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };

    try {
      // const response = await fetch(
      //   `${API_BASE_URL}/patients/${selectedPatient.patientId}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   }
      // );
      const response = await fetch(
  `${API_BASE_URL}/patients/${selectedPatient.patientId}`,
  {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }
);

      const data = await response.json();

      if (response.ok) {
        showNotification(
          `Patient ${data.name} updated successfully!`,
          "success"
        );
        setIsEditing(false);
        setSelectedPatient(data);
      } else {
        showNotification(data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      showNotification("Error updating patient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setSelectedPatient(null);
    setIsEditing(false);
  };



  const handleSelectPatient = (patient) => {
  setSelectedPatient(patient);
  setSearchId(patient.patientId);
  setIsEditing(false);

  setFormData({
    name: patient.name || "",
    age: patient.age || "",
    weight: patient.weight || "",
    height: patient.height || "",
    gender: patient.gender || "Male",
    bloodType: patient.bloodType || "A+",
    allergies: Array.isArray(patient.allergies)
      ? patient.allergies.join(", ")
      : patient.allergies || "",
    chronicConditions: Array.isArray(patient.chronicConditions)
      ? patient.chronicConditions.join(", ")
      : patient.chronicConditions || "",
    lifestyle: patient.lifestyle || {
      smoking: "No",
      alcohol: "No",
      exercise: "Regular",
    },
  });
};




  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          Search Patient
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchPatient()}
            placeholder="Enter Patient ID (e.g., P-3326)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={searchPatient}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
          {selectedPatient && (
            <button
              onClick={handleClearSearch}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* All Patients List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          All Patients
        </h3>

        {allPatients.length === 0 ? (
          <p className="text-gray-500">No patients available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPatients.map((patient) => (
              <div
                key={patient.patientId}
                onClick={() => handleSelectPatient(patient)}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-blue-500 transition"
              >
                <h4 className="font-semibold text-gray-900">
                  {patient.name}
                </h4>
                <p className="text-sm text-gray-600">
                  ID: {patient.patientId}
                </p>
                <p className="text-sm text-gray-600">
                  {patient.age} yrs • {patient.gender}
                </p>
                <p className="text-sm text-gray-600">
                  Blood: {patient.bloodType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {selectedPatient ? (
        <div className="space-y-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {selectedPatient.name}
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel Edit" : "Edit Patient"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium text-gray-900">
                  {selectedPatient.patientId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium text-gray-900">
                  {selectedPatient.age} years
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">
                  {selectedPatient.gender}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="font-medium text-gray-900">
                  {selectedPatient.bloodType}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form
              onSubmit={handleUpdate}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Patient Information
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                      setFormData({
                        ...formData,
                        chronicConditions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Lifestyle
                  </h5>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  {loading ? "Updating..." : "Update Patient"}
                </button>
              </div>
            </form>
          )}

          {/* Documents Manager */}
          <DocumentManager patientId={selectedPatient.patientId} />

          {/* Prescription Manager */}
          <PrescriptionManager patientId={selectedPatient.patientId} />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Search for a patient using their ID to view and update their
            information
          </p>
        </div>
      )}
    </div>
  );
};

export default UpdatePatient;