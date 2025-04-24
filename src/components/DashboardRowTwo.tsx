import UserGroupScore from "./DashboardUserGroupinScore";
import DashboardCalendar from "./DashboardCalendar";
import BaseDashboardCard from "./BaseDashboardCard";

export default function DashboardRowTwo() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 min-w-32">
        <div className="lg:col-span-2">
          <BaseDashboardCard title="User Group Score">
            <UserGroupScore />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-3">
          <BaseDashboardCard title="Calendar">
            <DashboardCalendar />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
