import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { createTrainingPDFExporter } from "@/services/pdfExportService";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { TrainingTeamAnalytics, SquadPerformance } from "@/types/performance";

export default function DashboardDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const performance = useStore(performanceStore);
  const training = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  const handleExport = async () => {
    if (!training.training || isExporting) return;

    setIsExporting(true);
    try {
      const pdfExporter = createTrainingPDFExporter();
      const defaultAnalytics: TrainingTeamAnalytics = {
        total_participants: 0,
        total_shots_fired: 0,
        overall_hit_percentage: 0,
        total_targets_eliminated: 0,
        avg_time_to_first_shot: 0,
        avg_cm_dispersion: 0,
        best_cm_dispersion: 0,
        best_user_first_name: "",
        best_user_last_name: "",
        short_shots: 0,
        medium_shots: 0,
        long_shots: 0,
        short_hit_percentage: 0,
        medium_hit_percentage: 0,
        long_hit_percentage: 0,
        times_grouped: 0,
      };

      const defaultSquadPerformance: SquadPerformance[] =
        training.training.participants?.map((p) => ({
          squad_id: p.user?.id || "",
          squad_name: `${p.user?.first_name} ${p.user?.last_name}`,
          total_missions: 0,
          avg_accuracy: 0,
          avg_reaction_time: 0,
          first_shot_success_rate: 0,
          elimination_rate: 0,
          total_snipers: 0,
          best_sniper: `${p.user?.first_name} ${p.user?.last_name}`,
        })) || [];

      await pdfExporter.exportTrainingReport({
        training: training.training,
        participants: training.training.participants || [],
        analytics: performance.trainingTeamAnalytics || defaultAnalytics,
        squadStats: performance.squadStats || [],
        weaponStats: performance.weaponUsageStats ? [performance.weaponUsageStats] : [],
        dayNightPerformance: [],
        squadPerformance: defaultSquadPerformance,
        trainingEffectiveness: performance.trainingEffectiveness || [],
        weapons: weapons || [],
        equipment: equipments || [],
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Training Report Export</h3>
            <p className="text-sm text-gray-500">
              Export detailed training reports including performance analytics, squad statistics, and equipment usage.
            </p>
            <Button onClick={handleExport} disabled={isExporting || !training.training} className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Training Report"}
            </Button>
          </div>
        </Card>

        {/* Add more export options here as needed */}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-4">Export History</h4>
        <p className="text-sm text-gray-500">Recent exports will appear here. Export history is currently under development.</p>
      </div>
    </div>
  );
}
