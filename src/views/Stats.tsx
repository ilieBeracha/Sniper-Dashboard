import HeatmapAllActions from "@/components/HeatMap";
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/WeeklyKPIs";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { performanceStore } from "@/store/performance";

export default function Stats() {
  const { user } = useStore(userStore);
  const { firstShotMatrix, getFirstShotMatrix, getUserWeeklyActivitySummary, getSquadWeaponStats } = useStore(performanceStore);
  const { userWeeklyActivitySummary, squadWeaponStats } = useStore(performanceStore);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    positions: ["Lying", "Standing", "Sitting", "Operational"],
    bucketSize: 100,
  });

  useEffect(() => {
    if (user?.team_id) {
      getFirstShotMatrix(user.team_id, filters.startDate, filters.endDate, filters.positions, filters.bucketSize);
      getUserWeeklyActivitySummary(new Date(), user.team_id);
      getSquadWeaponStats(user?.id, user?.user_default_weapon || "", user?.team_id || "", filters.startDate, filters.endDate);
      console.log(firstShotMatrix);
      console.log(userWeeklyActivitySummary);
      console.log(squadWeaponStats);
    }
  }, [user?.team_id, filters]);

  return (
    <div className="space-y-3 p-4 bg-zinc-900">
      <WeeklyKPIs />
      <HeatmapAllActions />
      <ChartMatrix />
    </div>
  );
}
