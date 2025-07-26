import { supabase } from "./supabaseClient";

export async function getReportGrouping(team_id: string, start_date: string, end_date: string) {
  const res = await supabase.rpc("get_grouping_stats_for_report", {
    p_team_id: team_id,
    p_start_date: start_date,
    p_end_date: end_date,
  });
  return res.data;
}
