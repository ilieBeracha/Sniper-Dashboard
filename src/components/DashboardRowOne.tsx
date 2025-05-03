import UserProfile from "./DashboardUserProfile";
import { User } from "@/types/user";
import BaseDashboardCard from "./BaseDashboardCard";
import DashboardCalendar from "./DashboardCalendar";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section className="pb-0 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 relative">
        <div className="lg:col-span-5">
          <BaseDashboardCard title="User Profile">
            <UserProfile user={user} />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-3">
          <BaseDashboardCard title="Calendar" tooltipContent="View and manage your schedule and events">
            <DashboardCalendar />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
