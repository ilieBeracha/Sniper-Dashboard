import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DashboardCalendar from "./DashboardCalendar";
import DashboardStatsLink from "./DashboardStatsLink";
import { performanceStore } from "@/store/performance";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const { user } = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);
  const { getUserWeeklyKpisForUser } = useStore(performanceStore);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTeamData = async () => {
      if (user?.team_id) {
        try {
          await Promise.all([
            fetchMembers(user.team_id), 
            getSquadsWithUsersByTeamId(user.team_id),
            getUserWeeklyKpisForUser(user.id, 7)
          ]);
        } catch (error) {
          console.error("Error loading team data:", error);
        }
      }
    };
    loadTeamData();
  }, [user?.team_id, user?.user_role]);

  return (
    <div className="space-y-2">
      {/* Profile and Stats Link */}
      <div className="space-y-2">
        <DashboardProfileCard />
        <DashboardStatsLink />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {isMobile && (
          <div className="col-span-1">
            <DashboardCalendar />
          </div>
        )}
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <CyCharts loading={loading} />
        </div>
      </div>
    </div>
  );
}
