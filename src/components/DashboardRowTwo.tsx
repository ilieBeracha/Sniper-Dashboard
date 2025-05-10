import BaseDashboardCard from "./BaseDashboardCard";
import UserGroupingSummary from "./DashboardUserGroupingSummary";
import DashboardDayNightPerformance from "./DashboardDayNightPerformance";
import { performanceStore } from "@/store/performance";
import { useStore } from "zustand";

export default function DashboardRowTwo() {
  const { dayNightPerformance } = useStore(performanceStore);
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2">
        <div className="lg:col-span-6">
          <BaseDashboardCard header="User Group Score" tooltipContent="Your performance compared to your group and squad">
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-6">
          <BaseDashboardCard header="Day/Night Performance" tooltipContent="Your performance in day and night">
            <DashboardDayNightPerformance dayNightPerformance={dayNightPerformance} />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
