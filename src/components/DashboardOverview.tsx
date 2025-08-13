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
import { BarChart2, TrendingUp, Activity, Target } from "lucide-react";

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
      
      {/* Stats Banner */}
      <div 
        className="col-span-1 md:col-span-2 xl:col-span-3 cursor-pointer group"
        onClick={() => navigate("/stats")}
      >
        <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl ${
          theme === "dark" 
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50" 
            : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-lg"
        }`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 animate-gradient-x"></div>
          </div>
          
          {/* Content */}
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left side - Text content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <div className={`p-3 rounded-xl ${
                    theme === "dark" 
                      ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30" 
                      : "bg-gradient-to-br from-emerald-100 to-cyan-100 border border-emerald-300"
                  }`}>
                    <BarChart2 className={`w-6 h-6 ${
                      theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                    }`} />
                  </div>
                  <h2 className={`text-3xl md:text-4xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Performance Stats
                  </h2>
                </div>
                <p className={`text-lg mb-6 ${
                  theme === "dark" ? "text-zinc-400" : "text-gray-600"
                }`}>
                  Track your shooting accuracy, analyze trends, and improve your performance
                </p>
                
                {/* CTA Button */}
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold 
                  transition-all duration-300 group-hover:gap-4 ${
                  theme === "dark" 
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/25" 
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30"
                }`}>
                  <span>View Detailed Analytics</span>
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
              
              {/* Right side - Animated icons */}
              <div className="flex gap-4 md:gap-6">
                <div className={`p-4 rounded-2xl transform rotate-3 transition-transform duration-300 group-hover:rotate-6 ${
                  theme === "dark" 
                    ? "bg-zinc-800/50 border border-zinc-700/50" 
                    : "bg-white/80 border border-gray-200 shadow-md"
                }`}>
                  <TrendingUp className={`w-8 h-8 ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-500"
                  }`} />
                </div>
                <div className={`p-4 rounded-2xl transform -rotate-3 transition-transform duration-300 group-hover:-rotate-6 ${
                  theme === "dark" 
                    ? "bg-zinc-800/50 border border-zinc-700/50" 
                    : "bg-white/80 border border-gray-200 shadow-md"
                }`}>
                  <Activity className={`w-8 h-8 ${
                    theme === "dark" ? "text-cyan-400" : "text-cyan-500"
                  }`} />
                </div>
                <div className={`p-4 rounded-2xl transform rotate-6 transition-transform duration-300 group-hover:rotate-12 ${
                  theme === "dark" 
                    ? "bg-zinc-800/50 border border-zinc-700/50" 
                    : "bg-white/80 border border-gray-200 shadow-md"
                }`}>
                  <Target className={`w-8 h-8 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-500"
                  }`} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
            theme === "dark" 
              ? "bg-emerald-500/20" 
              : "bg-emerald-400/20"
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl ${
            theme === "dark" 
              ? "bg-cyan-500/20" 
              : "bg-cyan-400/20"
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
