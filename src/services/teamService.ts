import { User } from "@/types/user";
import { supabase } from "./supabaseClient";

export async function getTeamMembers(
  teamId: string,
  currentUser: User
): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      squads:fk_squad (
        id,
        squad_name
      )
    `
    )
    .eq("team_id", teamId);

  if (error) {
    console.error("Error fetching team members:", error.message);
    throw new Error("Failed to fetch team members");
  }

  if (!data) return [];

  // ✅ Filter logic based on role
  // if (["squad_commander", "soldier"].includes(currentUser.user_role)) {
  //   return data.filter((user) => user.squad_id === currentUser.squad_id);
  // }

  return data; // commander sees all
}
