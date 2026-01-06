import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";
import SetupQuiz from "./components/SetupQuiz";
import SetupTraining from "./components/SetupTraining"; // NEW
import ChatInterface from "./components/ChatInterface";
import TrainingChatInterface from "./components/TrainingChatInterface"; // NEW
import ResultDisplay from "./components/ResultDisplay";
import TrainingResultDisplay from "./components/TrainingResultDisplay"; // NEW
import { RegisterPatient } from "./components/RegisterPatient";
import Dashboard from "./components/Dashboard";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/setup" element={<SetupQuiz />} />
        <Route path="/setup-training" element={<SetupTraining />} /> {/* NEW */}
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/training-chat" element={<TrainingChatInterface />} />{" "}
        {/* NEW */}
        <Route path="/results" element={<ResultDisplay />} />
        <Route
          path="/training-results"
          element={<TrainingResultDisplay />}
        />{" "}
        {/* NEW */}
        <Route path="/register" element={<RegisterPatient />} /> {/* NEW */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* NEW */}
        <Route path="/main" element={<MainLayout />} />{" "}
        {/* NEW - Main Layout with Sidebar */}
      </Routes>
    </Router>
  );
}

export default App;
