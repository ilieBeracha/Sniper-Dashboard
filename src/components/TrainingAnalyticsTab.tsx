import { useTheme } from "@/contexts/ThemeContext";
import { Activity } from "lucide-react";
import TrainingSessionStatsCard from "./TrainingSessionStatsCard";
import { PrimaryExportButton } from "@/components/TrainingPDFExportButton";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { performanceStore } from "@/store/performance";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";

export default function TrainingAnalyticsTab({ trainingSessionId }: { trainingSessionId: string }) {
  const { theme } = useTheme();
  const { training } = useStore(TrainingStore);
  const { trainingTeamAnalytics, squadStats } = performanceStore();
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

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
          <p className="text-sm mb-4">Analytics dashboard coming soon</p>
          
          {/* Advanced PDF Export */}
          <div className="mt-6">
            <PrimaryExportButton
              trainingData={{
                training: training!,
                participants: training?.participants || [],
                analytics: trainingTeamAnalytics!,
                squadStats: squadStats || [],
                weaponStats: [],
                dayNightPerformance: [],
                squadPerformance: [],
                trainingEffectiveness: [],
                weapons: weapons || [],
                equipment: equipments || []
              }}
              size="md"
              buttonText="Generate Detailed Analytics Report"
              disabled={!training || !trainingTeamAnalytics}
              onExportComplete={() => {
                console.log('Detailed analytics report exported successfully!');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
