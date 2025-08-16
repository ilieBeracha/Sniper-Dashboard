import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import DashboardCalendar from "./DashboardCalendar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { BarChart2 } from "lucide-react";
import { DashboardOverviewSkeleton } from "./DashboardSkeletons";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);

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

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Profile Section with Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <DashboardProfileCard />
          
          {/* Beautiful Stats Link Card */}
          <div 
            className={`mt-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
              theme === "dark" 
                ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 hover:from-purple-900/30 hover:to-blue-900/30 border border-purple-800/30 hover:border-purple-700/50" 
                : "bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200 hover:border-purple-300"
            } hover:shadow-lg hover:scale-[1.02]`}
            onClick={() => navigate("/stats")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                  theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"
                }`}>
                  <BarChart2 className={`w-5 h-5 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    View Analytics Dashboard
                  </h3>
                  <p className={`text-xs mt-0.5 ${
                    theme === "dark" ? "text-zinc-400" : "text-gray-600"
                  }`}>
                    Performance insights & team metrics
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Calendar on desktop, moves down on mobile */}
        <div className="lg:col-span-1">
          <DashboardCalendar />
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full">
        <CyCharts loading={loading} />
      </div>
    </div>
  );
}
