import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import DashboardCalendar from "./DashboardCalendar";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

export default function DashboardProfileCard() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);

  return (
    <div className="w-full h-full relative flex justify-between overflow-hidden">
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6 gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-light mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Welcome back</h1>
          <p className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {user?.first_name} {user?.last_name}
          </p>
          <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{user?.user_role}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-4 sm:gap-8">
          {!isCommander(user?.user_role as UserRole) && (
            <div>
              <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Squad</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{user?.squad_name}</p>
            </div>
          )}
          <div>
            <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Team</p>
            <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{user?.team_name}</p>
          </div>
        </div>
      </div>

      {/* Calendar overlay - hidden on mobile for better readability */}
      <div className="hidden lg:flex  right-0 top-0 h-full w-[45%] items-center">
        <div className="relative w-full h-full z-10">
          <DashboardCalendar />
        </div>
      </div>
    </div>
  );
}
