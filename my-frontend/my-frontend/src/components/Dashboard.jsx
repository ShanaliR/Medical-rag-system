import React, { useState } from "react";
import Sidebar from "./ChatSidebar";
import ConsultationChat from "./ConsultationChat";

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSessionId(null); // Reset session when new patient is selected
  };

  const handleSessionStart = (newSessionId) => {
    setSessionId(newSessionId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col overflow-hidden">
        <Sidebar
          onPatientSelect={handlePatientSelect}
          selectedPatient={selectedPatient}
          onSessionStart={handleSessionStart}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          className="flex-1 overflow-y-auto"
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Hospital Consultation System
          </h1>
          {selectedPatient && (
            <div className="mt-2 text-gray-600">
              <span className="font-medium">Current Patient: </span>
              {selectedPatient.name} (ID: {selectedPatient.patientId})
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          <ConsultationChat
            selectedPatient={selectedPatient}
            sessionId={sessionId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
