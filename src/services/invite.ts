import { Invite } from "@/types/Invite";
import { supabase } from "./supabaseClient";

export async function getInviteByInviterId(
  userId: string
): Promise<Invite | null> {
  console.log(userId);
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("inviter_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching invite by user ID:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
