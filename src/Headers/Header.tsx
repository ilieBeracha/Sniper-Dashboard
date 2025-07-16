import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { List } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Header({ children, isFixed }: { children?: React.ReactNode; isFixed?: boolean }) {
  const { toggleDrawer } = useStore(useSidebarStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex  items-center justify-between px-4 py-4 h-12 border-b relative z-[50] transition-colors duration-200 ${isFixed ? "fixed top-0 left-0 right-0" : ""} ${
        theme === "dark" ? "border-white/5" : "border-gray-200"
      }`}
    >
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={` absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
            theme === "dark" ? "bg-gradient-to-br from-purple-500/10 to-blue-500/10" : "bg-gradient-to-br from-purple-200/20 to-blue-200/20"
          }`}
        />
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
            theme === "dark" ? "bg-gradient-to-tl from-blue-500/10" : "bg-gradient-to-tl from-blue-200/20"
          }`}
        />
      </div> */}
      <div className="flex items-center">
        {isMobile && <List className={`w-5 h-5 mr-3 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} onClick={toggleDrawer} />}
        {/* <span
          className={`${isMobile ? "text-lg" : "text-xl"} font-bold transition-colors duration-200 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </span> */}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </div>
  );
}
