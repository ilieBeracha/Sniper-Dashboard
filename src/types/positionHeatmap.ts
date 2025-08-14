export interface PositionHeatmapDay {
  date: string;
  position: "Lying" | "Sitting" | "Standing" | "Operational";
  engagements: number;
  totalShots: number;
  totalHits: number;
  hitRatio: number;
}