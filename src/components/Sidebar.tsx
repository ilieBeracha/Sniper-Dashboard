import { authStore } from "@/store/authStore";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { NavLink } from "react-router-dom";
import { BiSolidDashboard, BiSolidLogOut, BiSolidCog, BiSolidUser } from "react-icons/bi";
import { BsBarChartFill } from "react-icons/bs";
import { useState } from "react";

const links = [
  {
    name: "Dashboard",
    href: "/",
    icon: <BiSolidDashboard className="w-5 h-5" />,
  },
  {
    name: "Training",
    href: "/training",
    icon: <BsBarChartFill className="w-5 h-5" />,
  },
];

const accountLinks = [
  {
    name: "Profile",
    href: "/profile",
    icon: <BiSolidUser className="w-5 h-5" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <BiSolidCog className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const { logout } = useStore(authStore);
  const { user } = useStore(userStore);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col bg-[#121212] border-r border-[#1D1D1F] ${
        collapsed ? "w-20" : "w-80"
      } transition-all duration-300 h-screen sticky top-0 left-0 overflow-y-auto`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1D1D1F] sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center">{!collapsed && <span className="ml-3 text-lg font-bold text-white">SniperOps</span>}</div>
        <div onClick={() => setCollapsed(!collapsed)} className="bg-transparent hover:text-white cursor-pointer text-xl">
          {collapsed ? "›" : "‹"}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4">
          <div className="bg-[#1E1E20] p-3 rounded-lg flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#BFF2EC] text-black font-bold rounded-full flex items-center justify-center">
              {user?.first_name?.[0] || "U"}
            </div>
            <div>
              <p className="text-md text-white font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-md text-gray-400">{user?.user_role}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {[
          { title: "OVERVIEW", items: links },
          { title: "ACCOUNT", items: accountLinks },
        ].map(({ title, items }) => (
          <div key={title} className="mb-4">
            {!collapsed && <h3 className="text-md text-gray-500 px-4 mb-1">{title}</h3>}
            {items.map(({ name, href, icon }) => (
              <NavLink
                key={name}
                to={href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-4 text-md font-medium rounded-lg ${
                    isActive ? "bg-[#1E1E20] text-gray-300" : "text-gray-400 hover:text-white hover:bg-[#1D1D1F]"
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

      <div className="p-4 border-t border-[#1D1D1F] mt-auto sticky bottom-0 bg-[#121212]">
        <button
          onClick={logout}
          className={`flex items-center w-full text-md text-red-400 hover:text-white px-4 py-2 rounded-lg hover:bg-red-600/20 ${
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
