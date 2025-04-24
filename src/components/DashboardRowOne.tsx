import UserProfile from "./UserProfile";
import { User } from "@/types/user";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardMonthlyOpsAreaChart from "./DashboardMonthlyOpsAreaChart";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section className="pb-0 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <BaseDashboardCard title="User Profile">
            <UserProfile user={user} />
          </BaseDashboardCard>
        </div>

        <div className=" xl:col-span-2 bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] rounded-2xl lg:col-span-2">
          <BaseDashboardCard title="Hits Over Time (Monthly)">
            <DashboardMonthlyOpsAreaChart />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-1">
          <BaseDashboardCard title="User Hit Percentage">
            <div className="flex items-center justify-center ">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
