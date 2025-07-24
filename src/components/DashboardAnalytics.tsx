import { User } from "@/types/user";
import BaseDashboardCard from "./base/BaseDashboardCard";

import DashboardSquadStats from "./DashboardSquadStats";
import UserGroupingSummary from "./DashboardUserGroupingSummary";
import DashboardCalendar from "./DashboardCalendar";
import DashboardTeamTable from "./DashboardTeamTable";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardAnalytics({ loading }: { user: User; loading: boolean }) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full">
        {/* <div className="col-span-1 lg:col-span-4  w-full">
        <BaseDashboardCard header="Summary" tooltipContent="View summary of your training data">
          <div className="w-full">
            <DashboardWelcome user={user} />
          </div>
        </BaseDashboardCard>
      </div> */}

        <div className="col-span-1 lg:col-span-8 w-full text-sm">
          <BaseDashboardCard header="Calendar" tooltipContent="View and manage your schedule and events">
            <DashboardCalendar />
          </BaseDashboardCard>
        </div>
      </section>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full">
        <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
          <BaseDashboardCard
            header="User Group Score"
            tooltipContent="Group size shows how close 4+ shots landed at 100m — smaller means better precision."
          >
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="sm:col-span-12 md:col-span-6 lg:col-span-6">
          <DashboardSquadStats />
        </div>
      </div>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 text-sm">
          <div className="col-span-12">
            <BaseDashboardCard header="Operational Units" tooltipContent="Overview of all operational units and their current status">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block w-12 h-12 border-4 border-[#7F5AF0] border-t-transparent rounded-full animate-spin"></div>
                  <p className={`mt-4 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Loading operational units data...
                  </p>
                </div>
              ) : (
                <DashboardTeamTable />
              )}
            </BaseDashboardCard>
          </div>
        </div>
      </section>
    </div>
  );
}
