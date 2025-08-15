import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DashboardCalendar from "./DashboardCalendar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { BarChart2, TrendingUp } from "lucide-react";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTeamData = async () => {
      if (user?.team_id) {
        try {
          await Promise.all([fetchMembers(user.team_id), getSquadsWithUsersByTeamId(user.team_id)]);
        } catch (error) {
          console.error("Error loading team data:", error);
        }
      }
    };
    loadTeamData();
  }, [user?.team_id, user?.user_role]);

  return (
    <div className="grid gap-6 auto-rows-max grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <DashboardProfileCard />
      </div>
      
      {/* Compact Stats Banner */}
      <div 
        className="col-span-1 md:col-span-2 xl:col-span-3 cursor-pointer group"
        onClick={() => navigate("/stats")}
      >
        <div className={`relative overflow-hidden rounded-xl transition-all duration-300 
          transform hover:scale-[1.01] hover:shadow-lg ${
          theme === "dark" 
            ? "bg-gradient-to-r from-zinc-800 to-zinc-700 border border-zinc-600/50" 
            : "bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200"
        }`}>
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Compact content */}
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  theme === "dark" 
                    ? "bg-emerald-500/20 border border-emerald-500/30" 
                    : "bg-emerald-100 border border-emerald-300"
                }`}>
                  <BarChart2 className={`w-5 h-5 ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Performance Stats
                  </h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-zinc-400" : "text-gray-600"
                  }`}>
                    View detailed analytics and trends
                  </p>
                </div>
              </div>
              
              {/* Right side - Action */}
              <div className="flex items-center gap-3">
                <div className={`hidden sm:flex items-center gap-2 text-sm font-medium ${
                  theme === "dark" ? "text-zinc-400" : "text-gray-600"
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>Track Progress</span>
                </div>
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-1 ${
                  theme === "dark" 
                    ? "bg-zinc-700 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 opacity-5 pointer-events-none ${
            theme === "dark" 
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500" 
              : "bg-gradient-to-r from-emerald-400 to-cyan-400"
          }`}></div>
        </div>
      </div>

      {/* <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <ChartUserScoresByWeaponSquad />
      </div> */}

      {isMobile && (
        <div className="col-span-1">
          <DashboardCalendar />
        </div>
      )}
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <CyCharts loading={loading} />
      </div>
    </div>
  );
}
