import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import DashboardMostAccurate from "./DashboardMostAccurate";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import Chart from "./DashboardSquadStats";

export default function DashboardRowKPI() {
  const { topAccurateSnipers } = useStore(performanceStore);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="col-span-3">
          <BaseDashboardCard header="User Hit Percentage" tooltipContent="Your overall hit accuracy and performance metrics">
            <div className="h-full flex items-center justify-center">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>
        <div className="col-span-3">
          <BaseDashboardCard header="Precision Accuracy">
            <DashboardMostAccurate topAccurateSnipers={topAccurateSnipers} />
          </BaseDashboardCard>
        </div>

        <div className="col-span-6">
          <Chart />
        </div>
      </div>
    </>
  );
}
