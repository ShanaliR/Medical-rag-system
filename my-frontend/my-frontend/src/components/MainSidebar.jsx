// import React from "react";
// import { LayoutDashboard, Users, LogOut } from "lucide-react";

// const MainSidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
//   const menuItems = [
//     {
//       id: "dashboard",
//       name: "Dashboard",
//       icon: LayoutDashboard,
//     },
//     {
//       id: "patient-management",
//       name: "Patient Management",
//       icon: Users,
//     },
//   ];

//   return (
//     <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen shadow-lg flex flex-col overflow-hidden">
//       {/* Logo/Header */}
//       <div className="p-6 border-b border-blue-700">
//         <h1 className="text-2xl font-bold">Medifix</h1>
//         <p className="text-blue-200 text-sm mt-1">Healthcare Platform</p>
//       </div>

//       {/* Navigation Items */}
//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => setActiveMenu(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                 activeMenu === item.id
//                   ? "bg-white text-blue-900 font-semibold shadow-md"
//                   : "text-blue-100 hover:bg-blue-700 hover:text-white"
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span>{item.name}</span>
//             </button>
//           );
//         })}
//       </nav>

//       {/* Logout Button */}
//       <div className="p-4 border-t border-blue-700">
//         <button
//           onClick={onLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-all"
//         >
//           <LogOut className="w-5 h-5" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MainSidebar;




import React from "react";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

const MainSidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "patient-management",
      name: "Patient Management",
      icon: Users,
    },
  ];

  // const handleLogoutClick = () => {
  //   if (!onLogout) return;

  //   const confirmLogout = window.confirm(
  //     "Are you sure you want to logout?"
  //   );

  //   if (confirmLogout) {
  //     onLogout();
  //   }
  // };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen shadow-lg flex flex-col overflow-hidden">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Medifix</h1>
        <p className="text-blue-200 text-sm mt-1">Healthcare Platform</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeMenu === item.id
                  ? "bg-white text-blue-900 font-semibold shadow-md"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
        <button
          // onClick={handleLogoutClick}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MainSidebar;