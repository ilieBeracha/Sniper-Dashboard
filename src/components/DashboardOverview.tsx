import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import DashboardCalendar from "./DashboardCalendar";
import DashboardQuickActions from "./DashboardQuickActions";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const { user } = useStore(userStore);
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
        <div className="lg:col-span-2">
          <DashboardProfileCard />
        </div>
        
        {/* Calendar on desktop, moves down on mobile */}
        <div className="lg:col-span-1">
          <DashboardCalendar />
        </div>
      </div>

      {/* Quick Actions Section */}
      <DashboardQuickActions />

      {/* Charts Section */}
      <div className="w-full">
        <CyCharts loading={loading} />
      </div>
    </div>
  );
}
