import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({
  onPatientSelect,
  selectedPatient,
  onSessionStart,
  isLoading,
  setIsLoading,
}) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Mock patient data - replace with API call in real implementation
  useEffect(
    () => async () => {
      const patients = await getAllPatients();
      console.log("Fetched patients:", patients);

      setPatients(patients.patients);
      setFilteredPatients(patients.patients);
    },
    []
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const handleStartConsultation = async (patient) => {
    if (selectedPatient?.patientId === patient.patientId) return;

    setIsLoading(true);
    try {
      // Hardcoded doctor details as per requirements
      const payload = {
        patientId: patient.patientId,
        doctorId: "DOC001", // Hardcoded
        doctorName: "Dr. Smith", // Hardcoded
      };

      const response = await axios.post(
        "http://localhost:8000/api/consultations/start",
        payload
      );

      if (response.data.sessionId) {
        onPatientSelect(patient);
        onSessionStart(response.data.sessionId);
        console.log("Consultation started:", response.data);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
      alert("Failed to start consultation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPatients = async () => {
    setIsLoading(true);
    const response = await axios.get("http://localhost:8000/api/patients");
    setIsLoading(false);
    return response.data;
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Patients List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No patients found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <li
                key={patient.patientId}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedPatient?.patientId === patient.patientId
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleStartConsultation(patient)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {patient.patientId}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedPatient?.patientId === patient.patientId
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {patient.age}y
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-600">
                    {patient.gender}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-xs text-gray-600">
                    {patient.chronicConditions}
                  </span>
                </div>
                {selectedPatient?.patientId === patient.patientId && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active Session
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm text-gray-600">
          <p className="font-medium">Total Patients: {patients.length}</p>
          <p className="mt-1">Select a patient to start consultation</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
