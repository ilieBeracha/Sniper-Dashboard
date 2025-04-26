import DashboardSquadWeaponPerformance from "./DashboardSquadWeaponPerformance";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import UserGroupingSummary from "./DashboardUserGroupingSummary";

export default function DashboardRowTwo() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6 min-w-32">
        <div className="lg:col-span-2">
          <BaseDashboardCard title="User Hit Percentage" tooltipContent="Your overall hit accuracy and performance metrics">
            <div className="items-center justify-center h-full w-full">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>
        <div className="lg:col-span-3">
          <BaseDashboardCard title="User Group Score" tooltipContent="Your performance compared to your group and squad">
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>
        <div className="xl:col-span-3 lg:col-span-2">
          <BaseDashboardCard title="Weapon Performance By Squad" tooltipContent="Detailed weapon performance metrics across different squads">
            <DashboardSquadWeaponPerformance />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
