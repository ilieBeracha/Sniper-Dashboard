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
    <div
      className={`relative overflow-hidden rounded-xl p-6 sm:p-7 shadow-lg ring-1 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 ring-white/10 text-white"
          : "bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 ring-indigo-100 text-slate-900"
      }`}
    >
      {/* Decorative, subtle glow accents */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl ${
          theme === "dark" ? "bg-indigo-700/20" : "bg-indigo-300/20"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl ${
          theme === "dark" ? "bg-blue-800/10" : "bg-blue-300/10"
        }`}
      />

      <div className="flex items-center justify-between relative">
        {/* Left side - Enhanced user info */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Larger avatar with refined ring */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg font-semibold ring-2 ${
              theme === "dark"
                ? "bg-white/10 text-white ring-white/20"
                : "bg-indigo-100 text-indigo-800 ring-indigo-200"
            }`}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 ${
                theme === "dark" ? "border-slate-900" : "border-white"
              }`}
            ></div>
          </div>

          {/* User details - horizontal layout */}
          <div className="flex items-center gap-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {user?.first_name} {user?.last_name}
                </h2>
                {!isMobile && <span className="text-base opacity-90">{icon}</span>}
              </div>
              <p className={`${theme === "dark" ? "text-white/80" : "text-slate-600"} text-sm`}>{greeting} Commander</p>
            </div>

            {/* Divider */}
            {!isMobile && <div className={`h-10 w-px ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`} />}

            {/* Tags - inline */}
            {!isMobile && (
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`px-2.5 py-1 rounded-md ${
                    theme === "dark" ? "bg-white/10 text-white/90" : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {user?.user_role?.replace("_", " ").toUpperCase()}
                </span>

                {user?.team_name && (
                  <div className={`flex items-center gap-1.5 ${theme === "dark" ? "text-white/80" : "text-slate-700"}`}>
                    <Users size={14} />
                    <span>{user?.team_name}</span>
                  </div>
                )}

                {user?.squad_name && (
                  <div className={`flex items-center gap-1.5 ${theme === "dark" ? "text-white/80" : "text-slate-700"}`}>
                    <Shield size={14} />
                    <span>{user?.squad_name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Date */}
        <div className={`hidden md:flex items-center gap-2 text-sm ${theme === "dark" ? "text-white/80" : "text-slate-600"}`}>
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Mobile tags */}
      {isMobile && (
        <div className={`flex items-center gap-3 mt-4 text-sm ${theme === "dark" ? "text-white/80" : "text-slate-700"}`}>
          {user?.team_name && (
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{user?.team_name}</span>
            </div>
          )}

          {user?.squad_name && (
            <div className="flex items-center gap-1">
              <Shield size={14} />
              <span>{user?.squad_name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
