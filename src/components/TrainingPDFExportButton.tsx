import React from 'react';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useTrainingPDFExport } from '@/hooks/useTrainingPDFExport';
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

interface TrainingPDFExportButtonProps {
  // Option 1: Use existing data
  trainingData?: Partial<TrainingReportData>;
  
  // Option 2: Use training ID to fetch data
  trainingId?: string;
  
  // Customization props
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  
  // Text customization
  buttonText?: string;
  loadingText?: string;
  
  // Callbacks
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: string) => void;
}

export const TrainingPDFExportButton: React.FC<TrainingPDFExportButtonProps> = ({
  trainingData,
  trainingId,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  buttonText = 'Export PDF Report',
  loadingText = 'Generating PDF...',
  onExportStart,
  onExportComplete,
  onExportError,
}) => {
  const { 
    isExporting, 
    exportError, 
    exportTrainingReport, 
    exportTrainingReportById, 
    clearError 
  } = useTrainingPDFExport();

  const handleExport = async () => {
    if (disabled || isExporting) return;

    onExportStart?.();
    clearError();

    try {
      if (trainingData) {
        await exportTrainingReport(trainingData);
      } else if (trainingId) {
        await exportTrainingReportById(trainingId);
      } else {
        throw new Error('Either trainingData or trainingId must be provided');
      }
      onExportComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      onExportError?.(errorMessage);
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500 shadow-sm`;
      case 'secondary':
        return `${baseStyles} bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-300`;
      case 'outline':
        return `${baseStyles} border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-300`;
      case 'ghost':
        return `${baseStyles} hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300`;
      default:
        return `${baseStyles} bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500`;
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm rounded-md gap-2';
      case 'md':
        return 'px-4 py-2.5 text-sm rounded-md gap-2';
      case 'lg':
        return 'px-6 py-3 text-base rounded-lg gap-3';
      default:
        return 'px-4 py-2.5 text-sm rounded-md gap-2';
    }
  };

  const isDisabled = disabled || isExporting || (!trainingData && !trainingId);

  return (
    <div className="flex flex-col">
      <button
        onClick={handleExport}
        disabled={isDisabled}
        className={`
          ${getVariantStyles()} 
          ${getSizeStyles()} 
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        title={isDisabled ? 'Export unavailable' : 'Export training report as PDF'}
      >
        {isExporting ? (
          <>
            <Loader2 className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} strokeWidth={2.5} />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <FileText className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} strokeWidth={2.5} />
            <span>{buttonText}</span>
            <Download className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} strokeWidth={2.5} />
          </>
        )}
      </button>

      {/* Error Display */}
      {exportError && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700 font-medium">Export Failed</p>
            <p className="text-xs text-red-600 mt-1">{exportError}</p>
            <button
              onClick={clearError}
              className="text-xs text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Preset components for common use cases
export const PrimaryExportButton: React.FC<Omit<TrainingPDFExportButtonProps, 'variant'>> = (props) => (
  <TrainingPDFExportButton {...props} variant="primary" />
);

export const SecondaryExportButton: React.FC<Omit<TrainingPDFExportButtonProps, 'variant'>> = (props) => (
  <TrainingPDFExportButton {...props} variant="secondary" />
);

export const OutlineExportButton: React.FC<Omit<TrainingPDFExportButtonProps, 'variant'>> = (props) => (
  <TrainingPDFExportButton {...props} variant="outline" />
);

export const CompactExportButton: React.FC<TrainingPDFExportButtonProps> = (props) => (
  <TrainingPDFExportButton 
    {...props} 
    size="sm" 
    buttonText="Export PDF"
    loadingText="Exporting..."
  />
);

export default TrainingPDFExportButton;