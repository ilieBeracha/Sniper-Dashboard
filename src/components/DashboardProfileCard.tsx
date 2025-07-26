import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useStore } from "zustand";
import DashboardCalendar from "./DashboardCalendar";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { Users, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function DashboardProfileCard() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { members, fetchMembers } = useStore(teamStore);
  const { squadsWithMembers, getSquadsWithUsersByTeamId } = useStore(squadStore);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTeamData = async () => {
      if (user?.team_id) {
        setIsLoading(true);
        try {
          if (isCommander(user.user_role as UserRole)) {
            await Promise.all([fetchMembers(user.team_id), getSquadsWithUsersByTeamId(user.team_id)]);
          } else {
            await getSquadsWithUsersByTeamId(user.team_id);
          }
        } catch (error) {
          console.error("Error loading team data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadTeamData();
  }, [user?.team_id, user?.user_role]);

  const teamMembersCount = members?.length || 0;
  const activeSquadsCount = squadsWithMembers?.length || 0;
  const userSquadMembersCount = squadsWithMembers?.find((squad) => squad.users?.some((u) => u.id === user?.id))?.users?.length || 0;

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full h-full relative flex justify-between overflow-hidden">
      {/* Animated background gradient */}
      {/* <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 lg:p-6 gap-4">
        {/* Main welcome section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {getWelcomeMessage()},
            </h1>
          </div>
          <p className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {user?.first_name} {user?.last_name}
          </p>
          <div className="flex items-center gap-3">
            <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {user?.user_role?.replace("_", " ").toUpperCase()}
            </p>
          </div>
        </div>

        {/* Team stats and info */}
        <div className="space-y-4">
          {/* Squad and Team info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-4 sm:gap-8">
            {!isCommander(user?.user_role as UserRole) && (
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <Target className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`} />
                  <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Squad</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {user?.squad_name || "Unassigned"}
                  </p>
                  {userSquadMembersCount > 0 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}
                    >
                      {userSquadMembersCount} members
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="group">
              <div className="flex items-center gap-2 mb-1">
                <Users className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`} />
                <p className={`text-sm sm:text-base lg:text-lg ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Team</p>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{user?.team_name}</p>
                {teamMembersCount > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                    {teamMembersCount} operatives
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          {!isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {isCommander(user?.user_role as UserRole) ? (
                // Commander view - show team stats
                <>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-50"} border border-opacity-20`}>
                    <div className="flex items-center gap-2">
                      <Target className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Active Squads</span>
                    </div>
                    <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{activeSquadsCount}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-50"} border border-opacity-20`}>
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Team Size</span>
                    </div>
                    <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{teamMembersCount}</p>
                  </div>
                </>
              ) : (
                // Squad member view - show squad stats
                <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-50"} border border-opacity-20`}>
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Squad Size</span>
                  </div>
                  <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{userSquadMembersCount}</p>
                </div>
              )}
            </div>
          )}
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
