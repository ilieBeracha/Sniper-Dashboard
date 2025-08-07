import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useStore } from "zustand";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Users, Shield, Calendar } from "lucide-react";

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
    if (hour < 12) return { greeting: "Morning", icon: "☀️" };
    if (hour < 17) return { greeting: "Afternoon", icon: "🌤️" };
    return { greeting: "Evening", icon: "🌙" };
  };

  const { greeting, icon } = getTimeBasedGreeting();

  return (
    <div className={`rounded-lg border p-3 ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Compact user info */}
        <div className="flex items-center gap-2">
          {/* Avatar with initials */}
          <div
            className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
          </div>

          {/* User details - horizontal layout */}
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </h2>
                {!isMobile && <span className="text-sm opacity-50">{icon}</span>}
              </div>
              <p className="text-xs opacity-60">{greeting} Commander</p>
            </div>

            {/* Divider */}
            {!isMobile && <div className={`h-6 w-px ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />}

            {/* Tags - inline */}
            {!isMobile && (
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded ${theme === "dark" ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-600"}`}>
                  {user?.user_role?.replace("_", " ").toUpperCase()}
                </span>

                {user?.team_name && (
                  <div className="flex items-center gap-1.5 opacity-70">
                    <Users size={12} />
                    <span>{user?.team_name}</span>
                  </div>
                )}

                {user?.squad_name && (
                  <div className="flex items-center gap-1.5 opacity-70">
                    <Shield size={12} />
                    <span>{user?.squad_name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Date */}
        <div className="hidden md:flex items-center gap-2 text-xs opacity-60">
          <Calendar size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Mobile tags */}
      {isMobile && (
        <div className="flex items-center gap-2 mt-3 text-xs">
          {user?.team_name && (
            <div className="flex items-center gap-1 opacity-70">
              <Users size={12} />
              <span>{user?.team_name}</span>
            </div>
          )}

          {user?.squad_name && (
            <div className="flex items-center gap-1 opacity-70">
              <Shield size={12} />
              <span>{user?.squad_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
