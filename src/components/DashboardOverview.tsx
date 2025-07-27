import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  return (
    <div className="space-y-6 min-h-fit">
      <DashboardProfileCard />
      <CyCharts loading={loading} />
    </div>
  );
}
