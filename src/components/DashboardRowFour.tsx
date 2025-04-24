import BaseDashboardCard from "@/components/BaseDashboardCard";
import TeamBarChart from "./DashboardTeamBarChart";

export default function DashboardRowFour() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseDashboardCard title="Team Performance Metrics">
        <TeamBarChart />
      </BaseDashboardCard>
    </div>
  );
}
