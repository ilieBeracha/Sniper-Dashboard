import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import DashboardCalendar from "./DashboardCalendar";

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
    <div className="grid gap-4 auto-rows-max grid-cols-1 md:grid-cols-3">
      {/* Profile Card */}
      <div className="col-span-1 md:col-span-2">
        <DashboardProfileCard />
      </div>

      {/* Calendar */}
      <div className="col-span-1">
        <DashboardCalendar />
      </div>

      {/* Charts */}
      <div className="col-span-1 md:col-span-3">
        <CyCharts loading={loading} />
      </div>
    </div>
  );
}
