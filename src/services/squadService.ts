import { supabase } from "./supabaseClient";

export async function getSquadsWithUsersByTeamId(team_id: string) {
  const { data, error } = await supabase
    .from("squads")
    .select(
      `
      id,
      squad_name,
      created_at,
      users!fk_users_squad_id (
        id,
        first_name,
        last_name,
        user_role,
        email
      )
    `,
    )
    .eq("team_id", team_id);

  if (error) {
    console.error("Failed to fetch squads with users:", error.message);
    throw new Error("Could not fetch squads with users for team");
  }

  return data;
}

export async function getSquadUsersBySquadId(squad_id: string) {
  const { data, error } = await supabase
    .from("squads")
    .select(
      `
      id,
      squad_name,
      created_at,
      users!fk_users_squad_id (
        id,
        first_name,
        last_name,
        user_role,
        email
      ) 
    `,
    )
    .eq("id", squad_id);

  if (error) {
    console.error("Failed to fetch squads with users:", error.message);
    throw new Error("Could not fetch squads with users for team");
  }

  return data;
}

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
