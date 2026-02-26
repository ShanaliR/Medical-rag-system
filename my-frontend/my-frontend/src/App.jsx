// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// //import LandingPage from "./components/LandingPage";
// //import AdminPanel from "./components/AdminPanel";
// // import SetupQuiz from "./components/SetupQuiz";
// //import SetupTraining from "./components/SetupTraining"; // NEW
// import ChatInterface from "./components/ChatInterface";
// import PrescriptionManager from "./components/PrescriptionManager";
// //import TrainingChatInterface from "./components/TrainingChatInterface"; // NEW
// //import ResultDisplay from "./components/ResultDisplay";
// //import TrainingResultDisplay from "./components/TrainingResultDisplay"; // NEW
// import { RegisterPatient } from "./components/RegisterPatient";
// import Dashboard from "./components/Dashboard";
// import MainLayout from "./components/MainLayout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<LandingPage />} /> */}
//         {/* <Route path="/admin" element={<AdminPanel />} /> */}
//         <Route path="/" element={<MainLayout />} />
//         {/* <Route path="/setup" element={<SetupQuiz />} /> */}
//         {/* <Route path="/setup-training" element={<SetupTraining />} />  */}
//         <Route path="/chat" element={<ChatInterface />} />
//         {/* <Route path="/training-chat" element={<TrainingChatInterface />} />{" "} */}
//         {/* NEW */}
//         {/* <Route path="/results" element={<ResultDisplay />} /> */}
//         {/* <Route
//           path="/training-results"
//           element={<TrainingResultDisplay />}
//         />{" "} */}
//         {/* NEW */}
//         <Route path="/register" element={<RegisterPatient />} /> {/* NEW */}
//         <Route path="/prescription" element={<PrescriptionManager />}/>
//         <Route path="/dashboard" element={<Dashboard />} /> {/* NEW */}
//         <Route path="/main" element={<MainLayout />} />{" "}
//         {/* NEW - Main Layout with Sidebar */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;





// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// //import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import MainLayout from "./components/MainLayout";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ChatInterface from "./components/ChatInterface";
// import PrescriptionManager from "./components/PrescriptionManager";
// import { RegisterPatient } from "./components/RegisterPatient";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />


//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <MainLayout />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/chat"
//             element={
//               <ProtectedRoute>
//                 <ChatInterface />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/register"
//             element={
//               <ProtectedRoute>
//                 <RegisterPatient />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/prescription"
//             element={
//               <ProtectedRoute>
//                 <PrescriptionManager />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatInterface from "./components/ChatInterface";
import PrescriptionManager from "./components/PrescriptionManager";
import { RegisterPatient } from "./components/RegisterPatient";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <RegisterPatient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prescription"
            element={
              <ProtectedRoute>
                <PrescriptionManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;