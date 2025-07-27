import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { List, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SpPageBreadcrumbs } from "@/layouts/SpPage";
import { useState } from "react";
import ActivityFeedDrawer from "@/components/ActivityFeedDrawer";

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
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);

  return (
    <div
      className={`flex fixed top-0 left-0 right-0 items-center justify-between px-4 h-12 z-[50] transition-colors duration-200 ${isFixed ? "fixed top-0 left-0 right-0" : ""} `}
    >
      <div className="flex items-center">
        {isMobile && <List className={`w-5 h-5 mr-3 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} onClick={toggleDrawer} />}
        {breadcrumbs && <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />}
      </div>
      <div className="flex items-center">
        {children}
        <button
          onClick={() => setIsActivityFeedOpen(true)}
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Open activity feed"
        >
          <Bell className="w-5 h-5" />
        </button>
        <ThemeToggle />
      </div>
      <ActivityFeedDrawer isOpen={isActivityFeedOpen} onClose={() => setIsActivityFeedOpen(false)} />
    </div>
  );
}
