import { useTheme } from "@/contexts/ThemeContext";
import { Activity } from "lucide-react";
import TrainingSessionStatsCard from "./TrainingSessionStatsCard";

export default function TrainingAnalyticsTab({ trainingSessionId }: { trainingSessionId: string }) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Chart */}
      <div className="lg:col-span-2">
        <TrainingSessionStatsCard trainingSessionId={trainingSessionId} />
      </div>

      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Performance Analytics</h3>
        <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Analytics dashboard coming soon</p>
        </div>
      </div>
    </div>
  );
}
