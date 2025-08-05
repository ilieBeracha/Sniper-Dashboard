import { getInviteByInviterId } from "@/services/invite";
import { Invite } from "@/types/Invite";
import { create } from "zustand";
import { toastService } from "@/services/toastService";
import { UserRole } from "@/types/user";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "./userStore";

interface InvitationStore {
  invitation: Invite;
  getInviteByInviterId: (userId: string) => Promise<Invite | null>;
  regenerateInvite: (userId: string) => Promise<Invite | null>;
}

export const InvitationStore = create<InvitationStore>((set) => ({
  invitation: {} as Invite,

  getInviteByInviterId: async (userId) => {
    const inviteData = await getInviteByInviterId(userId);
    set({ invitation: inviteData as Invite });
    return inviteData;
  },

  regenerateInvite: async (userId: string) => {
    try {
      console.log("regenerateInvite", userId);
      const newInvite = await regenerateInvite(userId);
      if (!newInvite) {
        toastService.error("Failed to create invite");
        return null;
      }
      set({ invitation: newInvite });
      return newInvite;
    } catch (error) {
      console.error("Failed to create invite:", error);
      return null;
    }
  },
}));

export async function getUserInviteTargetRole() {
  const targetRole = userStore.getState().user?.user_role;
  console.log("getUserInviteTargetRole", targetRole);
  switch (targetRole) {
    case UserRole.Commander:
      return "squad_commander";
    case UserRole.SquadCommander:
      return "soldier";
    default:
      return null;
  }
}

export async function regenerateInvite(inviterId: string) {
  const targetRole = await getUserInviteTargetRole();
  console.log("regenerateInvite", inviterId, targetRole);
  const { data } = await supabase.rpc("regenerate_invite", {
    inviter_id: inviterId,
    target_role: targetRole as UserRole,
  });
  console.log("regenerateInvite data", data);
  return data;
}
