import UserProfile from "./UserProfile";
import DashboardAiAnalysis from "./DashboardAiAnalysis";
import DashboardStatusChart from "./DashboardStatusChart";
import { User } from "@/types/user";
import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section className="pb-0 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <BaseDashboardCard title="User Profile">
            <UserProfile user={user} />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-1">
          <BaseDashboardCard title="User Hit Percentage">
            <div className="flex items-center justify-center h-[300px]">
              <UserHitPercentage />
            </div>
          </BaseDashboardCard>
        </div>

        <div className="hidden xl:block xl:col-span-1 bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] rounded-2xl">
          <BaseDashboardCard title="AI Analysis" withBg={false}>
            <div className="overflow-auto">
              <DashboardAiAnalysis />
            </div>
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
