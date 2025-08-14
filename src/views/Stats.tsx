// Components…
import HeatmapAllActions from "@/components/HeatMap";
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/WeeklyKPIs";
import SquadImpactStats from "@/components/SquadImpactStats";
import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2 } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect } from "react";

// Stores
import { performanceStore } from "@/store/performance";

export default function Stats() {
  const user = useStore(userStore);
  const { getFirstShotMatrix, getUserWeeklyActivitySummary } = useStore(performanceStore);

  useEffect(() => {
    if (user?.user?.team_id) {
      getFirstShotMatrix(user.user.team_id, new Date(), new Date(), null, 100);
      getUserWeeklyActivitySummary(new Date(), user.user.team_id);
    }
  }, [user?.user?.team_id, getFirstShotMatrix, getUserWeeklyActivitySummary]);

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="KPIs, impact and trends" icon={BarChart2} />
      <SpPageBody>
        <div className="space-y-3 pb-3">
          <div className="w-full">
            <WeeklyKPIs />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <ChartMatrix />
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <HeatmapAllActions />
            </div>
            <div>
              <SquadImpactStats />
            </div>
          </div>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
