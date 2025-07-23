// Report related types used across the dashboard
// Feel free to extend these definitions when the real report generation logic is implemented.

export type ReportSection =
  | "basicSummary"
  | "performanceStats"
  | "targetEngagements"
  | "equipmentWeapons"
  | "teamSquadComparison";

export interface TrainingReportData {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  basicSummary: {
    totalSessions: number;
    uniqueSquads: number;
    totalParticipants: number;
    averageSessionDuration: string;
  };
  performanceStats: {
    sessions: {
      id: string;
      name: string;
      date: Date;
      accuracy: number;
      hitPercentage: number;
      avgDispersion: number;
      avgReactionTime: number;
    }[];
  };
  targetEngagements: {
    engagements: {
      sessionName: string;
      targetId: string;
      distance: number;
      windSpeed: number;
      totalShots: number;
      totalHits: number;
      eliminated: boolean;
      participants: {
        userName: string;
        shots: number;
        hits: number;
        accuracy: number;
      }[];
    }[];
  };
  equipmentWeapons: {
    weapons: {
      name: string;
      type: string;
      usageCount: number;
      avgAccuracy: number;
    }[];
  };
  teamSquadComparison: {
    teams: {
      name: string;
      sessions: number;
      avgAccuracy: number;
      avgHitPercentage: number;
      topPerformer: string;
    }[];
    squads: {
      name: string;
      teamName: string;
      sessions: number;
      avgAccuracy: number;
      avgHitPercentage: number;
      topPerformer: string;
    }[];
  };
}