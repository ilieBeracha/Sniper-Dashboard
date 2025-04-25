import UserProfile from "./DashboardUserProfile";
import { User } from "@/types/user";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import SquadWeaponPerformance from "./DashboardSquadWeaponPerformance";
import DashboardCalendar from "./DashboardCalendar";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section className="pb-0 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BaseDashboardCard title="User Profile">
            <UserProfile user={user} />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-2">
          <BaseDashboardCard title="Calendar">
            <DashboardCalendar />
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
