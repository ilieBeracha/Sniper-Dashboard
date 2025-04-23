import BaseDashboardCard from "@/components/BaseDashboardCard";
import MonthlyOpsAreaChart from "@/components/DashboardMonthlyOpsAreaChart";
import TeamBarChart from "./DashboardTeamBarChart";

export default function DashboardRowFour() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseDashboardCard title="Monthly Operations">
        <MonthlyOpsAreaChart />
      </BaseDashboardCard>

      <BaseDashboardCard title="Team Performance Metrics">
        <TeamBarChart />
      </BaseDashboardCard>
    </div>
  );
}
