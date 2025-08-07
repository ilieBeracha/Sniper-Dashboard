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
    <div className="grid gap-4 auto-rows-max grid-cols-1 md:grid-cols-2">
      {/* Profile */}
      <div className="col-span-1">
        <DashboardProfileCard />
      </div>

      {/* Timeline / Calendar */}
      <div className="col-span-1 flex flex-col gap-3">
        <div className="rounded-lg border p-3 bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 h-full">
          <h3 className="text-sm font-semibold mb-2 opacity-60">Training Timeline</h3>
          <DashboardCalendar />
        </div>
      </div>

      {/* Performance Section */}
      <div className="col-span-1 md:col-span-2">
        <CyCharts loading={loading} />
      </div>
    </div>
  );
}
