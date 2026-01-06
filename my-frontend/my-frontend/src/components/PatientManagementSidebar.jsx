import React from "react";
import { Plus, Edit3, Home } from "lucide-react";

const PatientManagementSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "add",
      name: "Add Patient",
      icon: Plus,
    },
    {
      id: "update",
      name: "Update Patient",
      icon: Edit3,
    },
  ];

  return (
    <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-800 mb-2">
          <Home className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Patient Management</h2>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Info Section */}
      <div className="p-4 border-t border-gray-200 bg-blue-50">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Tip:</span> Use this
          panel to manage patient records and medical documents.
        </p>
      </div>
    </div>
  );
};

export default PatientManagementSidebar;
