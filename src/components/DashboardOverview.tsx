import BaseDashboardCard from "./base/BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardProfileCard from "./DashboardProfileCard";
import DashboardSquadProgress from "./DashboardSquadProgress";
import DashboardSquadStats from "./DashboardSquadStats";

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-24 gap-4">
      {/* Row 1: Profile (1) spans 18 cols, Squad Progress (2) spans 6 cols */}
      <div className="col-span-24 lg:col-span-18">
        <BaseDashboardCard withBtn header="Profile Overview" tooltipContent="View your profile, stats, and notifications">
          <DashboardProfileCard />
        </BaseDashboardCard>
      </div>

      <div className="col-span-24 lg:col-span-6">
        <DashboardSquadProgress />
      </div>

      {/* Row 2 & 3: Team Table (3) spans 18 cols and 2 rows */}
      <div className="col-span-24 lg:col-span-18 lg:row-span-2">
        <BaseDashboardCard tooltipContent="View and manage team members" height="h-full">
          <></>
        </BaseDashboardCard>
      </div>

      {/* Row 2: Squad Stats (4) spans 6 cols */}
      <div className="col-span-24 lg:col-span-6">
        <DashboardSquadStats />
      </div>

      {/* Row 3: Hit Percentage (5) spans 6 cols */}
      <div className="col-span-24 lg:col-span-6">
        <BaseDashboardCard withBtn header="Hit Percentage" tooltipContent="View hit percentage statistics">
          <UserHitPercentage />
        </BaseDashboardCard>
      </div>
    </div>
  );
}
