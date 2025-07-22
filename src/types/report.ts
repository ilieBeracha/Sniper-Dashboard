export type ReportSection =
  | "basicSummary"
  | "performanceStats"
  | "targetEngagements"
  | "equipmentWeapons"
  | "teamSquadComparison";

// NOTE: This interface provides only the properties needed by the front-end components.
// If you require the complete definition, consider importing it from the service layer
// or extending this interface accordingly.
export interface TrainingReportData {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  // Flexible structure for individual sections – widen these as your application evolves.
  [key: string]: unknown;
}