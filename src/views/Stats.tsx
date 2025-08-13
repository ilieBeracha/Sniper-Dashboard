import HeatmapAllActions from "@/components/HeatMap";
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/WeeklyKPIs";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { performanceStore } from "@/store/performance";
import Header from "@/Headers/Header";
import { SpPage, SpPageBody } from "@/layouts/SpPage";
import { useTheme } from "@/contexts/ThemeContext";

export default function Stats() {
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const { firstShotMatrix, getFirstShotMatrix, getUserWeeklyActivitySummary, getSquadWeaponStats } = useStore(performanceStore);
  const { userWeeklyActivitySummary, squadWeaponStats } = useStore(performanceStore);
  const [filters] = useState({
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
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageBody>
        <div className={`space-y-4 ${theme === "dark" ? "bg-zinc-900" : "bg-gray-50"}`}>
          <WeeklyKPIs />
          <HeatmapAllActions />
          <ChartMatrix />
        </div>
      </SpPageBody>
    </SpPage>
  );
}
