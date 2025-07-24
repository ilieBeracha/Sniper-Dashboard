import { Invite } from "@/types/Invite";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export async function getInviteByInviterId(userId: string): Promise<Invite | null> {
  try {
    const { data, error } = await supabase.from("invitations").select("*").eq("inviter_id", userId).maybeSingle();

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch invite by user ID");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching invite by user ID:", error.message);
    throw new Error("Failed to fetch invite by user ID");
  }
}
