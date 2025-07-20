import BaseDashboardCard from "./base/BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardProfileCard from "./DashboardProfileCard";
import DashboardSquadProgress from "./DashboardSquadProgress";
import DashboardSquadStats from "./DashboardSquadStats";
import UnifiedFeed from "./UnifiedFeed";

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Row 1: Profile Overview (spans 9 cols) + Feed (spans 3 cols, starts row 1) */}
      <div className="col-span-12 lg:col-span-9">
        <BaseDashboardCard withBtn header="Profile Overview" tooltipContent="View your profile, stats, and notifications">
          <DashboardProfileCard />
        </BaseDashboardCard>
      </div>

      {/* Feed - spans 3 columns and 2 rows */}
      <div className="col-span-12 lg:col-span-3 lg:row-span-2">
        <UnifiedFeed />
      </div>

      {/* Row 2: Three cards in a row */}
      <div className="col-span-12 sm:col-span-4 lg:col-span-3">
        <DashboardSquadProgress />
      </div>

      <div className="col-span-12 sm:col-span-4 lg:col-span-3">
        <DashboardSquadStats />
      </div>

      <div className="col-span-12 sm:col-span-4 lg:col-span-3">
        <BaseDashboardCard withBtn header="Hit Percentage" tooltipContent="View hit percentage statistics">
          <UserHitPercentage />
        </BaseDashboardCard>
      </div>
    </div>
  );
}
