import BaseDashboardCard from "./base/BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardTeamTable from "./DashboardTeamTable";
import DashboardProfileCard from "./DashboardProfileCard";
import DashboardSquadProgress from "./DashboardSquadProgress";

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* First Row */}
      <div className="col-span-8">
        <BaseDashboardCard withBtn header="Profile Overview" tooltipContent="View your profile, stats, and notifications">
          <DashboardProfileCard />
        </BaseDashboardCard>
      </div>

      <div className="col-span-4">
        <DashboardSquadProgress />
      </div>

      {/* Second Row */}
      <div className="col-span-8">
        <BaseDashboardCard withBtn header="Team Members" tooltipContent="View and manage team members">
          <DashboardTeamTable />
        </BaseDashboardCard>
      </div>

      <div className="col-span-4">
        <BaseDashboardCard withBtn header="Hit Percentage" tooltipContent="View hit percentage statistics">
          <UserHitPercentage />
        </BaseDashboardCard>
      </div>
    </div>
  );
}
