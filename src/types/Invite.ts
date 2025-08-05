import { UserRole } from "./user";

export interface Invite {
  id: string;
  token: string;
  role: UserRole;
  team_id: string | null;
  squad_id: string | null;
  email?: string | null;
  created_at: string;
  expires_at?: string;
  used: boolean;
  used_by?: string;
  inviter_id: string;
  multi_use: boolean;
}

export interface InviteWithValidation extends Invite {
  isValid: boolean;
}

export function getInviteWithValidation(invite: Invite): InviteWithValidation {
  const now = new Date();
  const expiresAt = invite.expires_at ? new Date(invite.expires_at) : null;
  
  const isValid = 
    // Not expired
    (!expiresAt || expiresAt > now) &&
    // Either not used, or multi-use is allowed
    (!invite.used || invite.multi_use);

  return {
    ...invite,
    isValid
  };
}
