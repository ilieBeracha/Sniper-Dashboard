import DashboardSquadWeaponPerformance from "./DashboardSquadWeaponPerformance";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import UserGroupingSummary from "./DashboardUserGroupingSummary";

export default function DashboardRowTwo() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <BaseDashboardCard title="User Group Score" tooltipContent="Your performance compared to your group and squad">
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-6">
          <BaseDashboardCard title="Weapon Performance" tooltipContent="Detailed weapon performance metrics across different squads">
            <DashboardSquadWeaponPerformance />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
