// import React, { useState } from "react";
// import MainSidebar from "./MainSidebar";
// import Dashboard from "./Dashboard";
// import PatientManagement from "./PatientManagement";

// const MainLayout = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");

//   const handleLogout = () => {
//     // Handle logout logic here
//     console.log("Logging out...");
//     // You can redirect to login page or clear auth tokens
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Main Sidebar */}
//       <MainSidebar
//         activeMenu={activeMenu}
//         setActiveMenu={setActiveMenu}
//         onLogout={handleLogout}
//       />

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         {activeMenu === "dashboard" && <Dashboard />}
//         {activeMenu === "patient-management" && <PatientManagement />}
//       </div>
//     </div>
//   );
// };

// export default MainLayout;






import React, { useState } from "react";
import MainSidebar from "./MainSidebar";
import Dashboard from "./Dashboard";
import PatientManagement from "./PatientManagement";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { logout } = useAuth(); 

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <MainSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={logout} 
      />

      <div className="flex-1 overflow-y-auto">
        {activeMenu === "dashboard" && <Dashboard />}
        {activeMenu === "patient-management" && <PatientManagement />}
      </div>
    </div>
  );
};

export default MainLayout;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import MainSidebar from "./MainSidebar";
// import Dashboard from "./Dashboard";
// import PatientManagement from "./PatientManagement";

// const MainLayout = () => {
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear authentication data
//     localStorage.removeItem("token");
//     localStorage.removeItem("doctor");

//     // Optional: clear everything
//     // localStorage.clear();

//     console.log("Doctor logged out");

//     // Redirect to login page
//     navigate("/login");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* Main Sidebar */}
//       <MainSidebar
//         activeMenu={activeMenu}
//         setActiveMenu={setActiveMenu}
//         onLogout={handleLogout}
//       />

//       {/* Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         {activeMenu === "dashboard" && <Dashboard />}
//         {activeMenu === "patient-management" && <PatientManagement />}
//       </div>
//     </div>
//   );
// };

// export default MainLayout;