import { authStore } from "@/store/authStore";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { NavLink } from "react-router-dom";
import { BiSolidDashboard, BiSolidLogOut, BiSolidCog, BiSolidUser, BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { BsBarChartFill } from "react-icons/bs";
import { useState } from "react";
import { IsMobile } from "@/utils/isMobile";

const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: <BiSolidDashboard className="w-5 h-5" /> },
      { name: "Training", href: "/training", icon: <BsBarChartFill className="w-5 h-5" /> },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Profile", href: "/profile", icon: <BiSolidUser className="w-5 h-5" /> },
      { name: "Settings", href: "/settings", icon: <BiSolidCog className="w-5 h-5" /> },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useStore(authStore);
  const { user } = useStore(userStore);
  const [collapsed, setCollapsed] = useState(IsMobile);
  console.log(IsMobile);
  const userInitial = user?.first_name?.[0] || "U";

  return (
    <div
      className={`flex flex-col bg-[#121212] border-r border-[#1D1D1F] ${collapsed ? "w-20" : "w-72"} h-screen sticky top-0 transition-all duration-300`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1D1D1F] bg-[#121212] sticky top-0 z-10">
        {!collapsed && <span className="text-lg font-bold text-white">SniperOps</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white text-xl hover:opacity-80">
          {collapsed ? <BiChevronRight className="w-5 h-5" /> : <BiChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 pt-4">
          <div className="bg-[#1E1E20] p-3 rounded-lg flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#BFF2EC] text-black font-bold rounded-full flex items-center justify-center">{userInitial}</div>
            <div>
              <p className="text-white font-medium text-sm">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-gray-400 text-sm">{user?.user_role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {navSections.map(({ title, items }) => (
          <div key={title} className="mb-4">
            {!collapsed && <h3 className="text-xs text-gray-500 px-4 mb-1 tracking-wide">{title}</h3>}
            {items.map(({ name, href, icon }) => (
              <NavLink
                key={name}
                to={href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-150 ${
                    isActive ? "bg-[#1E1E20] text-white" : "text-gray-400 hover:text-white hover:bg-[#1D1D1F]"
                  } ${collapsed ? "justify-center" : "justify-start"}`
                }
              >
                {icon}
                {!collapsed && <span className="ml-3">{name}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#1D1D1F] bg-[#121212] sticky bottom-0">
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-white rounded-lg hover:bg-red-600/20 ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <BiSolidLogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}
