import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { List } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SpPageBreadcrumbs } from "@/layouts/SpPage";

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

  return (
    <div
      className={`flex  items-center justify-between px-4 h-16  relative z-[50] transition-colors duration-200 ${isFixed ? "fixed top-0 left-0 right-0" : ""} `}
    >
      <div className="flex items-center">
        {isMobile && <List className={`w-5 h-5 mr-3 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} onClick={toggleDrawer} />}
        {breadcrumbs && <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </div>
  );
}
