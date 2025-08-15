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

// Stores
import { performanceStore } from "@/store/performance";
import WeeklyActivityBars from "@/components/WeeklyActivityBars";

export default function Stats() {
  const { user } = useStore(userStore);
  const { getFirstShotMatrix, getUserWeeklyKpisForUser } = useStore(performanceStore);

  useEffect(() => {
    if (user?.team_id) {
      getFirstShotMatrix(user.team_id, 7);
      getUserWeeklyKpisForUser(user.id, 7);
    }
  }, [user?.team_id, getFirstShotMatrix, getUserWeeklyKpisForUser]);

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="KPIs, impact and trends" icon={BarChart2} />
      <SpPageBody>
        <div className="space-y-2 pb-2">
          <div className="lg:col-span-2">
            <WeeklyActivityBars />
          </div>
          <div className="w-full">
            <WeeklyKPIs />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2">
              <ChartMatrix />
            </div>
            <div className="lg:col-span-1">
              <SquadImpactStats />
            </div>
          </div>
        </div>
      </SpPageBody>
    </SpPage>
  );
}
