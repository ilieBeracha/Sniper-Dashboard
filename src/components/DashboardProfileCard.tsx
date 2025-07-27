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
import { Badge } from "@/components/ui/badge";

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
    <div className={`w-full h-full relative flex justify-between overflow-hidden ${isMobile ? "px-4 pt-6 pb-4 " : "p-4"}`}>
      <div className="relative z-10 h-full flex flex-col justify-between sm:p-5 lg:p-6 gap-4  rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`text-sm font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{getWelcomeMessage()},</h1>
          </div>
          <p
            className={`text-xl gap-2 flex items-center sm:text-3xl lg:text-5xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            <Badge variant="outline" className={`text-xs ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {user?.user_role?.replace("_", " ").toUpperCase()}
            </Badge>
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        {/* Team stats and info */}
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
