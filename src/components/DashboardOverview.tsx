import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <DashboardProfileCard />
      <CyCharts />
    </div>
  );
}
