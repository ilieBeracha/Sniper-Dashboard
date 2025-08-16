// Components
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/StatsUserKPI";
import SquadImpactStats from "@/components/SquadImpactStats";
import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2 } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect } from "react";

import { performanceStore } from "@/store/performance";
import WeeklyActivityBars from "@/components/WeeklyActivityBars";

import { PositionScore } from "@/types/user";

export default function Stats() {
  const { user } = useStore(userStore);
  const { getFirstShotMatrix, getUserWeeklyKpisForUser, fetchPositionHeatmap, getSquadWeaponStats } = useStore(performanceStore);

  const refreshData = () => {
    if (user?.team_id) {
      console.log("Refreshing stats page data...");
      getFirstShotMatrix(user.team_id, 30, null, 25, 100, 900, 0);
      getUserWeeklyKpisForUser(user.id, new Date(new Date().setDate(new Date().getDate() - 30)), new Date());
      fetchPositionHeatmap(user.team_id, PositionScore.Lying, new Date(new Date().setDate(new Date().getDate() - 30)), new Date());
      getSquadWeaponStats(user.team_id, new Date(new Date().setDate(new Date().getDate() - 30)), new Date());
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.team_id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user?.team_id) {
        console.log("Page became visible, refreshing data...");
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleFocus = () => {
      if (user?.team_id) {
        console.log("Window gained focus, refreshing data...");
        refreshData();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.team_id]);

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="KPIs, impact and trends" icon={BarChart2} />
      <SpPageBody>
        <div className="space-y-2">
          <WeeklyKPIs />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <WeeklyActivityBars />

            <SquadImpactStats />
          </div>
          <ChartMatrix />
        </div>
      </SpPageBody>
    </SpPage>
  );
}
