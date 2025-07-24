import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  return (
    <div className="space-y-6">
      <DashboardProfileCard />
      <CyCharts loading={loading} />
    </div>
  );
}
