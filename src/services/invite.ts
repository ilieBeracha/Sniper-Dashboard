import { Invite, InviteWithValidation, getInviteWithValidation } from "@/types/Invite";
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

export async function getInviteByInviterIdWithValidation(userId: string): Promise<InviteWithValidation | null> {
  try {
    const invite = await getInviteByInviterId(userId);
    if (!invite) return null;
    
    return getInviteWithValidation(invite);
  } catch (error: any) {
    console.error("Error fetching invite with validation:", error.message);
    throw new Error("Failed to fetch invite with validation");
  }
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
  try {
    const { data, error } = await supabase.from("invitations").select("*").eq("token", token).maybeSingle();

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch invite by token");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching invite by token:", error.message);
    throw new Error("Failed to fetch invite by token");
  }
}

export async function getInviteByTokenWithValidation(token: string): Promise<InviteWithValidation | null> {
  try {
    const invite = await getInviteByToken(token);
    if (!invite) return null;
    
    return getInviteWithValidation(invite);
  } catch (error: any) {
    console.error("Error fetching invite with validation by token:", error.message);
    throw new Error("Failed to fetch invite with validation by token");
  }
}
