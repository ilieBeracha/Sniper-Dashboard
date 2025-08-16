import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useStore } from "zustand";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { TrendingUp } from "lucide-react";
import { ProfileCardSkeleton } from "./DashboardSkeletons";

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

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good Morning", emoji: "☀️" };
    if (hour < 17) return { greeting: "Good Afternoon", emoji: "🌤️" };
    return { greeting: "Good Evening", emoji: "🌙" };
  };

  const { greeting, emoji } = getTimeBasedGreeting();

  if (!user) {
    return <ProfileCardSkeleton />;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "commander":
        return "👑";
      case "squad_commander":
        return "🎖️";
      case "soldier":
        return "🪖";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "commander":
        return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
      case "squad_commander":
        return theme === "dark" ? "text-blue-400" : "text-blue-600";
      case "soldier":
        return theme === "dark" ? "text-green-400" : "text-green-600";
      default:
        return theme === "dark" ? "text-gray-400" : "text-gray-600";
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800" 
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          } 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />
      </div>

      <div className="relative p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - User info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
              theme === "dark" 
                ? "bg-gradient-to-br from-zinc-700 to-zinc-800 text-white" 
                : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
            } shadow-lg`}>
              {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase() || "U"}
              <div className="absolute -bottom-1 -right-1 text-base">
                {getRoleIcon(user?.user_role || "")}
              </div>
            </div>

            {/* User details */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h2 className={`text-base sm:text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {greeting}, {user?.first_name}! {emoji}
                </h2>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs sm:text-sm font-medium ${getRoleColor(user?.user_role || "")}`}>
                  {user?.user_role?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </span>
                {user?.team_name && (
                  <>
                    <span className={`text-xs ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>•</span>
                    <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                      {user.team_name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Quick stats */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              {/* Activity indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100/80"
              }`}>
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className={`text-xs font-medium ${
                  theme === "dark" ? "text-zinc-300" : "text-gray-700"
                }`}>Active</span>
              </div>

              {/* Streak or performance indicator */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100/80"
              }`}>
                <TrendingUp className={`w-3.5 h-3.5 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`} />
                <span className={`text-xs font-medium ${
                  theme === "dark" ? "text-zinc-300" : "text-gray-700"
                }`}>+12%</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile stats */}
        {isMobile && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/50 dark:border-zinc-700/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Active</span>
            </div>
            <span className={`text-xs ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>+12% this week</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
