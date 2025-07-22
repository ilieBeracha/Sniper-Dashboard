import { User } from "@/types/user";
import { Team } from "@/types/team";
import { supabase } from "./supabaseClient";

export async function getTeamMembers(teamId: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
      *,
      squads:fk_users_squad_id (
        id,
        squad_name
      )
    `,
      )
      .eq("team_id", teamId);

    if (error) {
      console.error("Error fetching team members:", error.message);
      throw new Error("Failed to fetch team members");
    }

    return data ?? [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw new Error("Failed to fetch team members");
  }
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    const { data, error } = await supabase.from("teams").select("*").eq("id", teamId).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw new Error("Failed to fetch team");
  }
}

export async function updateTeamName(teamId: string, teamName: string): Promise<Team | null> {
  try {
    const { data, error } = await supabase.from("teams").update({ team_name: teamName }).eq("id", teamId).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating team name:", error);
    throw new Error("Failed to update team name");
  }
}
