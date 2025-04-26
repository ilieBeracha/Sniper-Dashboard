import DashboardSquadWeaponPerformance from "./DashboardSquadWeaponPerformance";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import UserGroupingSummary from "./DashboardUserGroupingSummary";

export default function DashboardRowTwo() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <BaseDashboardCard title="User Hit Percentage" tooltipContent="Your overall hit accuracy and performance metrics">
            <div className="h-full flex items-center justify-center">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-5">
          <BaseDashboardCard title="User Group Score" tooltipContent="Your performance compared to your group and squad">
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-4">
          <BaseDashboardCard title="Weapon Performance" tooltipContent="Detailed weapon performance metrics across different squads">
            <DashboardSquadWeaponPerformance />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
