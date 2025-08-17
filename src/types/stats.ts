export interface StatsFilters {
  teamId: string | null;
  squadId: string | null;
  userId: string | null;
  startDate: string | null; // ISO or null
  endDate: string | null; // ISO or null
  dayNight: string[] | null; // expect ["DAY","NIGHT"] (uppercase)
  positions: string[] | null; // enum literals: ["Sitting","Standing","Lying","Operational"]
  minShots: number | null; // null = no filter
  isSquad: boolean; // true = squad view, false = self view
}

/* ========= Mapper: UI -> RPC (p_*) ========= */

export type RpcFilters = {
  p_team_id: string | null;
  p_squad_id: string | null;
  p_user_id: string | null;
  p_is_squad: boolean;
  p_start: string | null;
  p_end: string | null;
  p_day_night: string[] | null;
  p_positions: string[] | null;
  p_min_shots: number | null;
};
