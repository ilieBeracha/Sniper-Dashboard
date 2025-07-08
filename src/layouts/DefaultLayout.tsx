import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function DefaultLayout() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  return (
    <div
      className={`flex w-screen relative ${isMobile ? "flex-col" : "flex-row"} transition-colors duration-200 ${
        theme === "dark" ? "bg-[#121212] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" /> */}
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
