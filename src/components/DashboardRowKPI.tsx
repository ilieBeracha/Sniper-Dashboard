import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import DashboardMostAccurate from "./DashboardMostAccurate";
import DashboardSquadStats from "./DashboardSquadStats";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";

export default function DashboardRowKPI() {
  const { topAccurateSnipers, squadStats } = useStore(performanceStore);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="col-span-3">
          <BaseDashboardCard title="User Hit Percentage" tooltipContent="Your overall hit accuracy and performance metrics">
            <div className="h-full flex items-center justify-center">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>
        <div className="col-span-3">
          <DashboardMostAccurate topAccurateSnipers={topAccurateSnipers} />
        </div>

        <div className="col-span-6">
          <DashboardSquadStats squadStats={squadStats} />
        </div>
      </div>
    </>
  );
}
