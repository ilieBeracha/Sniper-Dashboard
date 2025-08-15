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
import { BarChart2 } from "lucide-react";

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
    <div className="grid gap-2 auto-rows-max grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-2">
        <DashboardProfileCard />

        {/* Enhanced Stats Link Card */}
        <div 
          className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
            theme === "dark" 
              ? "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50" 
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => navigate("/stats")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <BarChart2 className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Performance Analytics
                </h3>
                <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  View your detailed stats and KPIs
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                theme === "dark" ? "text-zinc-500" : "text-gray-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

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
