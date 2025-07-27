import { supabase } from "./supabaseClient";
import { Squad } from "@/types/squad";
import { toastService } from "./toastService";

export async function getSquadsWithUsersByTeamId(team_id: string) {
  try {
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

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("Failed to fetch squads with users:", error.message);
    throw new Error("Could not fetch squads with users for team");
  }
}

export async function getSquadUsersBySquadId(squad_id: string) {
  try {
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
      toastService.error(error.message);
      throw new Error("Failed to fetch squads with users");
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch squads with users:", error.message);
    throw new Error("Could not fetch squads with users for team");
  }
}

export async function getSquadMetricsByRoleRpc(team_id: string) {
  try {
    const { data, error } = await supabase.rpc("squad_metrics_by_role", {
      team_id_param: team_id,
    });

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("Failed to fetch squad metrics:", error.message);
    toastService.error(error.message);
    throw new Error("Could not fetch squad metrics");
  }
}

export async function getSquadsHitsByTeamId(team_id: string) {
  try {
    const { data, error } = await supabase.rpc("get_squads_avg_hit_prc_by_team_id ", {
      team_id_param: team_id,
    });

    if (error) {
      console.error("Failed to fetch squad average hit percentage:", error.message);
      toastService.error(error.message);
      throw new Error("Could not fetch squad average hit percentage");
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch squad average hit percentage:", error.message);
    toastService.error(error.message);
    throw new Error("Could not fetch squad average hit percentage");
  }
}

export async function getSquadById(squadId: string): Promise<Squad | null> {
  try {
    const { data, error } = await supabase.from("squads").select("*").eq("id", squadId).single();

    if (error) {
      console.error("Error fetching squad:", error.message);
      toastService.error(error.message);
      throw new Error("Failed to fetch squad");
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching squad:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to fetch squad");
  }
}

export async function updateSquadName(squadId: string, squadName: string): Promise<Squad | null> {
  try {
    const { data, error } = await supabase.from("squads").update({ squad_name: squadName }).eq("id", squadId).select().single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error updating squad name:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to update squad name");
  }
}

export async function getSquads(team_id: string) {
  try {
    const { data, error } = await supabase.from("squads").select("*").eq("team_id", team_id);

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("Error fetching squads:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to fetch squads");
  }
}
