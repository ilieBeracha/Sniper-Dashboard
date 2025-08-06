import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useStore } from "zustand";
import DashboardCalendar from "./DashboardCalendar";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Chip } from "@heroui/react";
import { Users, Shield } from "lucide-react";

export default function DashboardProfileCard() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTeamData = async () => {
      if (user?.team_id) {
        try {
          if (isCommander(user.user_role as UserRole)) {
            await Promise.all([fetchMembers(user.team_id), getSquadsWithUsersByTeamId(user.team_id)]);
          } else {
            await getSquadsWithUsersByTeamId(user.team_id);
          }
        } catch (error) {
          console.error("Error loading team data:", error);
        }
      }
    };
    loadTeamData();
  }, [user?.team_id, user?.user_role]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl shadow-lg flex ${isMobile ? "flex-col gap-6 p-4" : "flex-row justify-between p-6"} ${
        theme === "dark"
          ? "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
          : "bg-gradient-to-br from-white via-purple-50 to-purple-100"
      }`}
    >
      {/* Decorative gradient blobs */}
      <span
        className={`absolute -top-16 -left-16 h-56 w-56 rounded-full blur-3xl opacity-20 ${
          theme === "dark" ? "bg-purple-700" : "bg-purple-300"
        }`}
      />
      <span
        className={`absolute -bottom-16 -right-16 h-64 w-64 rounded-full blur-3xl opacity-20 ${
          theme === "dark" ? "bg-pink-700" : "bg-pink-300"
        }`}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-between gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`text-sm font-light ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{getWelcomeMessage()},</h1>
          </div>
          <p
            className={`flex items-center gap-2 font-bold mb-2 ${isMobile ? "text-2xl" : "text-4xl lg:text-5xl"} ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {user?.first_name} {user?.last_name}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Chip
              variant="bordered"
              className={`flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase ${
                theme === "dark" ? "bg-purple-700 text-white" : "bg-purple-600 text-white"
              }`}
            >
              {user?.user_role?.replace("_", " ")}
            </Chip>
            {user?.team_name && (
              <Chip
                variant="bordered"
                className={`flex items-center gap-1 text-xs ${theme === "dark" ? "bg-pink-700 text-white" : "bg-pink-600 text-white"}`}
              >
                <Users className="w-3 h-3" />
                {user?.team_name}
              </Chip>
            )}
            {user?.squad_name && (
              <Chip
                variant="bordered"
                className={`flex items-center gap-1 text-xs ${theme === "dark" ? "bg-blue-700 text-white" : "bg-blue-600 text-white"}`}
              >
                <Shield className="w-3 h-3" />
                {user?.squad_name}
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* Calendar overlay - hidden on mobile for better readability */}
      {!isMobile && (
        <div className="hidden lg:flex right-0 top-0 h-full w-[45%] items-center">
          <div className="relative w-full h-full z-10">
            <DashboardCalendar />
          </div>
        </div>
      )}
    </div>
  );
}
