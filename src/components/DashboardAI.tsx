import LogTable from "@/views/LogTable";
import QuickActions from "@/components/QuickActions";

export default function DashboardAI() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-4">
      <QuickActions />
      <LogTable />
    </div>
  );
}
