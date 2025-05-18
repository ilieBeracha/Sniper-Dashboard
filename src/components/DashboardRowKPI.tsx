import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardSquadStats from "./DashboardSquadStats";
import UserGroupingSummary from "./DashboardUserGroupingSummary";

export default function DashboardRowKPI() {
  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
          <BaseDashboardCard header="User Group Score" tooltipContent="Your performance compared to your group and squad">
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
          <BaseDashboardCard header="User Hit Percentage" tooltipContent="Your overall hit accuracy and performance metrics">
            <UserHitPercentage />
          </BaseDashboardCard>
        </div>
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-6">
          <DashboardSquadStats />
        </div>
      </div>
    </>
  );
}
