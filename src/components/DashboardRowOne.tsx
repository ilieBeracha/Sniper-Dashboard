import UserProfile from "./UserProfile";
import DashboardAiAnalysis from "./DashboardAiAnalysis";
import DashboardStatusChart from "./DashboardStatusChart";
import { User } from "@/types/user";
import BaseDashboardCard from "./BaseDashboardCard";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <BaseDashboardCard title="Team Performance">
            <UserProfile user={user} />
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-1">
          <BaseDashboardCard title="Squad Deployment Status">
            <div className="flex items-center justify-center h-[300px]">
              <DashboardStatusChart />
            </div>
          </BaseDashboardCard>
        </div>

        <div className="lg:col-span-1">
          <BaseDashboardCard title="AI Analysis">
            <div className="h-[300px] overflow-auto">
              <DashboardAiAnalysis />
            </div>
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
