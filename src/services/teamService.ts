import { User } from "../types/user";
import { supabase } from "./supabaseClient";

export async function getTeamMembers(teamId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("team_id", teamId);

  if (error) {
    console.error("Error fetching team members:", error.message);
    throw new Error("Failed to fetch team members");
  }

  return data as User[];
}
