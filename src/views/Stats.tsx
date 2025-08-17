// Components
import ChartMatrix from "@/components/ChartMatrix";
import SquadImpactStats from "@/components/SquadImpactStats";
import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2 } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect } from "react";

import WeeklyActivityBars from "@/components/WeeklyActivityBars";
import { useStatsStore } from "@/store/statsStore";
import { useStatsFilters } from "@/hooks/useStatsFilters";
import StatsUserKPI from "@/components/StatsUserKPI";

export default function Stats() {
  const { user } = useStore(userStore);
  const { getStatsOverviewTotals, getFirstShotMetrics, getEliminationByPosition } = useStore(useStatsStore);
  const { filters } = useStatsFilters();

  const refreshData = () => {
    if (user?.team_id) {
      console.log("Refreshing stats page data...");

      getStatsOverviewTotals(filters);
      getFirstShotMetrics(filters);
      getEliminationByPosition(filters);
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
          <StatsUserKPI />
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
