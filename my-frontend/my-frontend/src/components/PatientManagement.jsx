import React, { useState } from "react";
import PatientManagementSidebar from "./PatientManagementSidebar";
import { RegisterPatient } from "./RegisterPatient";
import UpdatePatient from "./UpdatePatient";

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="flex h-screen">
      {/* Patient Management Sidebar */}
      <PatientManagementSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="min-h-screen">
          {activeTab === "add" && <RegisterPatient />}
          {activeTab === "update" && <UpdatePatient />}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
