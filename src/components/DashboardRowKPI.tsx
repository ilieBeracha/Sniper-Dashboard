import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardSquadStats from "./DashboardSquadStats";
import DashboardDayNightPerformance from "./DashboardDayNightPerformance";

export default function DashboardRowKPI() {
  const { dayNightPerformance } = useStore(performanceStore);
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
          <BaseDashboardCard header="Day/Night Performance" tooltipContent="Your performance in day and night">
            <DashboardDayNightPerformance dayNightPerformance={dayNightPerformance} />
          </BaseDashboardCard>
        </div>

        <div className="col-span-6">
          <DashboardSquadStats />
        </div>
      </div>
    </>
  );
}
