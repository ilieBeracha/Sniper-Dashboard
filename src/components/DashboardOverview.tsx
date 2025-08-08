import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DashboardCalendar from "./DashboardCalendar";
import { TrainingStore } from "@/store/trainingStore";
import { performanceStore } from "@/store/performance";
import { Calendar, Users, Target } from "lucide-react";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const { user } = useStore(userStore);
  const { fetchMembers, members } = useStore(teamStore, (s) => ({ fetchMembers: s.fetchMembers, members: s.members }));
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);
  const { trainingsChartDisplay } = useStore(TrainingStore);
  const { userHitsStats } = useStore(performanceStore);
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

      {/* Overview metrics row */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border ring-1 ring-black/5 border-gray-200 bg-white dark:bg-zinc-900/40 dark:border-white/10 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Team members</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{members?.length ?? 0}</p>
          </div>
        </div>

        <div className="rounded-xl border ring-1 ring-black/5 border-gray-200 bg-white dark:bg-zinc-900/40 dark:border-white/10 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Next training</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {trainingsChartDisplay?.next?.session_name ?? "—"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border ring-1 ring-black/5 border-gray-200 bg-white dark:bg-zinc-900/40 dark:border-white/10 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 flex items-center justify-center">
            <Target size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Your accuracy</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {userHitsStats?.hit_percentage != null ? `${Math.round(userHitsStats.hit_percentage)}%` : "—"}
            </p>
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
