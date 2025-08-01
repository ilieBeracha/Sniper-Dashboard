import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useState, useRef } from "react";
import { User, Sun, Moon, Activity, UserPlus } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { FaFolderOpen } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { isCommanderOrSquadCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

export default function ProfileMenu({
  setIsActivityFeedOpen,
  setIsInviteModalOpen,
}: {
  setIsActivityFeedOpen: (isOpen: boolean) => void;
  setIsInviteModalOpen: (isOpen: boolean) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useStore(userStore);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
          theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Profile menu"
      >
        <User className="w-5 h-5" />
        <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isProfileMenuOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg ring-1 transition-all ${
            theme === "dark" ? "bg-zinc-900 text-zinc-200 ring-zinc-700" : "bg-white text-gray-900 ring-gray-200"
          }`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsProfileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              role="menuitem"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Activity Feed */}
            <button
              onClick={() => {
                setIsActivityFeedOpen(true);
                setIsProfileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              role="menuitem"
            >
              <Activity className="w-4 h-4" />
              <span>Activity Feed</span>
            </button>

            {/* Invite Squad Commander - Only show for team managers */}
            {isCommanderOrSquadCommander(user?.user_role as UserRole) && (
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/rules"
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  }`}
                  role="menuitem"
                >
                  <FaFolderOpen className="w-4 h-4" />
                  <span>Rules</span>
                </NavLink>
                <button
                  onClick={() => {
                    setIsInviteModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  }`}
                  role="menuitem"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>
            )}

            {/* Divider */}
            <hr className={`my-1 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`} />

            {/* Profile Link */}
            <button
              disabled={true}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-700 hover:text-zinc-100" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              role="menuitem"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
