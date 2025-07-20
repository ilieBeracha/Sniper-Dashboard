import BaseDashboardCard from "./base/BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";

export default function DashboardOverview() {
  return (
    <div className="w-full h-full">
      <section className="grid grid-cols-12 gap-4 w-full h-full">
        <div className="col-span-8 rounded-lg">
          <BaseDashboardCard withBtn header="" tooltipContent="View and manage your schedule and events">
            <div className="w-full"> </div>
          </BaseDashboardCard>
        </div>

        <div className="col-span-4 rounded-lg">
          <BaseDashboardCard withBtn header="Calendar" tooltipContent="View and manage your schedule and events">
            <UserHitPercentage />
          </BaseDashboardCard>
        </div>
        <div className="col-span-8 rounded-lg">
          <BaseDashboardCard withBtn header="" tooltipContent="View and manage your schedule and events">
            <div className="w-full"> </div>
          </BaseDashboardCard>
        </div>
        <div className="col-span-4 rounded-lg">
          <BaseDashboardCard withBtn header="" tooltipContent="View and manage your schedule and events">
            <div className="w-full"> </div>
          </BaseDashboardCard>
        </div>
      </section>
    </div>
  );
}
