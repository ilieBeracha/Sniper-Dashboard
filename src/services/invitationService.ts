import { supabase } from "./supabaseClient";

export async function createTeamInvite(inviter_id: string, team_id: string, email: string, invite_code: string) {
  const { data, error } = await supabase
    .from("invitations")
    .insert([
      {
        email: email,
        token: invite_code,
        role: "squad_commander",
        inviter_id,
        team_id,
        squad_id: null,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    ])
    .select();

  if (error) {
    throw new Error("Failed to create team invite: " + error.message);
  }

  return data[0].token;
}

export async function validateInvite(invite_token: string, role: string) {
  const { data: invite, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", invite_token)
    .eq("role", role)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !invite) {
    console.log(error);
    throw new Error("Invalid or expired invite");
  }

  return invite;
}
