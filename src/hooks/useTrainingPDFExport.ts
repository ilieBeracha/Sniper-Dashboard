import { useState, useCallback } from 'react';
import { createTrainingPDFExporter } from '@/services/pdfExportService';
import { createTrainingDataAggregator } from '@/services/trainingDataAggregator';
import { TrainingSession, TrainingParticipant } from '@/types/training';
import { 
  TrainingTeamAnalytics, 
  SquadStats, 
  WeaponUsageStats, 
  DayNightPerformance,
  SquadPerformance,
  TrainingEffectiveness 
} from '@/types/performance';
import { Weapon } from '@/types/weapon';
import { Equipment } from '@/types/equipment';

interface TrainingReportData {
  training: TrainingSession;
  participants: TrainingParticipant[];
  analytics: TrainingTeamAnalytics;
  squadStats: SquadStats[];
  weaponStats: WeaponUsageStats[];
  dayNightPerformance: DayNightPerformance[];
  squadPerformance: SquadPerformance[];
  trainingEffectiveness: TrainingEffectiveness[];
  weapons: Weapon[];
  equipment: Equipment[];
}

interface UseTrainingPDFExportResult {
  isExporting: boolean;
  exportError: string | null;
  exportTrainingReport: (data: Partial<TrainingReportData>) => Promise<void>;
  exportTrainingReportById: (trainingId: string) => Promise<void>;
  clearError: () => void;
}

export const useTrainingPDFExport = (): UseTrainingPDFExportResult => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setExportError(null);
  }, []);

  /**
   * Export training report from existing data objects
   * Use this when you already have the data in your component state
   */
  const exportTrainingReport = useCallback(async (data: Partial<TrainingReportData>) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const dataAggregator = createTrainingDataAggregator();
      const pdfExporter = createTrainingPDFExporter();

      // Aggregate and enrich the data
      const completeData = dataAggregator.aggregateFromExistingData(data);
      const enrichedData = dataAggregator.enrichData(completeData);

      // Validate data before export
      const validation = dataAggregator.validateData(enrichedData);
      if (!validation.isValid) {
        console.warn('Data validation warnings:', validation.missingFields);
        // You can choose to still export or throw an error
        // throw new Error(`Missing required data: ${validation.missingFields.join(', ')}`);
      }

      // Export to PDF
      await pdfExporter.exportTrainingReport(enrichedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(errorMessage);
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Export training report by fetching data from API
   * Use this when you only have the training ID
   */
  const exportTrainingReportById = useCallback(async (trainingId: string) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const dataAggregator = createTrainingDataAggregator();
      const pdfExporter = createTrainingPDFExporter();

      // Fetch all training data
      const trainingData = await dataAggregator.aggregateTrainingData(trainingId);
      const enrichedData = dataAggregator.enrichData(trainingData);

      // Validate data before export
      const validation = dataAggregator.validateData(enrichedData);
      if (!validation.isValid) {
        console.warn('Data validation warnings:', validation.missingFields);
      }

      // Export to PDF
      await pdfExporter.exportTrainingReport(enrichedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(errorMessage);
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportTrainingReport,
    exportTrainingReportById,
    clearError
  };
};

export default useTrainingPDFExport;