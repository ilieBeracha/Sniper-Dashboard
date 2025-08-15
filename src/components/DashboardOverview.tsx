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

  return (
    <div className="space-y-4">
      {/* Profile Section with Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <DashboardProfileCard />
          
          {/* Integrated Stats Link */}
          <div className="cursor-pointer group inline-flex items-center gap-1.5 px-2 py-1" onClick={() => navigate("/stats")}>
            <div
              className={`flex items-center gap-1.5 transition-all duration-300 ${
                theme === "dark" ? "text-zinc-500 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span className="text-[10px] font-medium">View Analytics</span>
              <svg
                className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
