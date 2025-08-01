import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { userStore } from "@/store/userStore";
import { List, User, Moon, Sun, Activity, ChevronDown, UserPlus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SpPageBreadcrumbs } from "@/layouts/SpPage";
import { useState, useRef, useEffect } from "react";
import ActivityFeedDrawer from "@/components/ActivityFeedDrawer";
import InviteModal from "@/components/InviteModal";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { NavLink } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";

export default function Header({
  children,
  isFixed,
  breadcrumbs,
}: {
  children?: React.ReactNode;
  isFixed?: boolean;
  breadcrumbs?: { label: string; link: string }[];
}) {
  const { toggleDrawer } = useStore(useSidebarStore);
  const { theme, toggleTheme } = useTheme();
  const { user } = useStore(userStore);
  const isMobile = useIsMobile();
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex  items-center justify-between px-4 h-12 z-[50] transition-colors duration-200 ${isFixed ? "fixed top-0 left-0 right-0" : ""} `}
    >
      <div className="flex items-center">
        {isMobile && <List className={`w-5 h-5 mr-3 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} onClick={toggleDrawer} />}
        {breadcrumbs && <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />}
      </div>
      <div className="flex items-center gap-2">
        {children}

        {/* Profile Menu */}
        <ProfileMenu setIsActivityFeedOpen={setIsActivityFeedOpen} setIsInviteModalOpen={setIsInviteModalOpen} />
      </div>
      <ActivityFeedDrawer isOpen={isActivityFeedOpen} onClose={() => setIsActivityFeedOpen(false)} />
      {user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
