import { Invite } from "@/types/Invite";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export async function getInviteByInviterId(userId: string): Promise<Invite | null> {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("inviter_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch invite by user ID");
    }

    if (!data) return null;

    const now = new Date();
    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    const isValid = (!expiresAt || expiresAt > now) && !data.used;

    return { ...data, valid: isValid } as Invite;
  } catch (error: any) {
    console.error("Error fetching invite by user ID:", error.message);
    throw new Error("Failed to fetch invite by user ID");
  }
}
export async function createInvite(invite: Invite): Promise<Invite | null> {
  try {
    const { data, error } = await supabase
      .rpc("create_invite", {
        inviter_id: invite.inviter_id,
        role: invite.role,
        team_id: invite.team_id,
        squad_id: invite.squad_id,
        email: invite.email,
      })
      .select("*")
      .single();

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to create invite");
    }

    if (!data) return null;

    const now = new Date();
    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    const isValid = (!expiresAt || expiresAt > now) && !data.used;

    return { ...data, valid: isValid } as Invite;
  } catch (error: any) {
    console.error("Error creating invite:", error.message);
    throw new Error("Failed to create invite");
  }
}
