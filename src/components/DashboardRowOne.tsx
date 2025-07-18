import { User } from "@/types/user";
import BaseDashboardCard from "./base/BaseDashboardCard";
import DashboardCalendar from "./DashboardCalendar";
import DashboardWelcome from "./DashboardWelcome";

type DashboardRowOneProps = {
  user: User | null;
};

export default function DashboardRowOne({ user }: DashboardRowOneProps) {
  if (!user) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full">
      <div className="col-span-1 lg:col-span-4  w-full">
        <BaseDashboardCard header="Summary" tooltipContent="View summary of your training data">
          <div className="w-full">
            <DashboardWelcome user={user} />
          </div>
        </BaseDashboardCard>
      </div>

      <div className="col-span-1 lg:col-span-8 w-full text-sm">
        <BaseDashboardCard header="Calendar" tooltipContent="View and manage your schedule and events">
          <DashboardCalendar />
        </BaseDashboardCard>
      </div>
    </section>
  );
}
