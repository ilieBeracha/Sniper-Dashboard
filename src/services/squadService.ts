import { supabase } from "./supabaseClient";

export async function getSquadMetricsByRoleRpc(team_id: string) {
  const { data, error } = await supabase.rpc("squad_metrics_by_role", {
    team_id_param: team_id,
  });

  if (error) {
    console.error("Failed to fetch squad metrics:", error.message);
    throw new Error("Could not fetch squad metrics");
  }

  return data;
}
