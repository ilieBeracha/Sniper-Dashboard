import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BiSolidDashboard, BiSolidLogOut, BiSolidCog, BiSolidUser, BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { BsBarChartFill } from "react-icons/bs";
import { authStore } from "@/store/authStore";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { FaCrosshairs } from "react-icons/fa";
import { useIsMobile } from "@/hooks/useIsMobile";

const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: <BiSolidDashboard className="w-5 h-5" /> },
      { name: "Training", href: "/training", icon: <BsBarChartFill className="w-5 h-5" /> },
      { name: "Assets", href: "/assets", icon: <FaCrosshairs className="w-5 h-5" /> },
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
  const userInitial = user?.first_name?.[0] || "U";

  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const SidebarContent = () => (
    <div className={`flex flex-col bg-[#121212] border-r border-[#1D1D1F] ${collapsed ? "w-20" : "w-72"} h-full`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1D1D1F] bg-[#121212]">
        {!collapsed && <span className="text-lg font-bold text-white">ScopeStats</span>}
        <button onClick={() => (isMobile ? setDrawerOpen(false) : setCollapsed(!collapsed))} className="text-white text-xl hover:opacity-80">
          {collapsed ? <BiChevronRight className="w-5 h-5" /> : <BiChevronLeft className="w-5 h-5" />}
        </button>
      </div>

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

      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {navSections.map(({ title, items }) => (
          <div key={title} className="mb-4">
            {!collapsed && <h4 className="text-xs text-gray-500 px-4 mb-1 tracking-wide">{title}</h4>}
            {items.map(({ name, href, icon }) => (
              <NavLink
                key={name}
                to={href}
                onClick={() => isMobile && setDrawerOpen(false)}
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

      <div className="p-4 border-t border-[#1D1D1F] bg-[#121212]">
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

  if (isMobile) {
    return (
      <div className="min-h-[10vh]">
        <button className="fixed top-4 left-4 z-50 p-2 bg-[#1E1E1E] rounded-lg text-white" onClick={() => setDrawerOpen(true)}>
          <BiChevronRight className="w-6 h-6" />
        </button>

        <Dialog open={isDrawerOpen} onClose={() => setDrawerOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#121212] shadow-xl">{SidebarContent()}</div>
        </Dialog>
      </div>
    );
  }

  return <div className="h-screen sticky top-0">{SidebarContent()}</div>;
}
