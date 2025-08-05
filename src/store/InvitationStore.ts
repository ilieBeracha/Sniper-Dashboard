import { getInviteByInviterId, getInviteByInviterIdWithValidation, getInviteByTokenWithValidation } from "@/services/invite";
import { Invite, InviteWithValidation, getInviteWithValidation } from "@/types/Invite";
import { create } from "zustand";

interface InvitationStore {
  invitation: Invite;
  invitationWithValidation: InviteWithValidation | null;
  getInviteByInviterId: (userId: string) => Promise<Invite | null>;
  getInviteByInviterIdWithValidation: (userId: string) => Promise<InviteWithValidation | null>;
  getInviteByTokenWithValidation: (token: string) => Promise<InviteWithValidation | null>;
  setInvitationWithValidation: (invite: Invite | null) => void;
}

export const InvitationStore = create<InvitationStore>((set, get) => ({
  invitation: {} as Invite,
  invitationWithValidation: null,

  getInviteByInviterId: async (userId) => {
    const inviteData = await getInviteByInviterId(userId);
    set({ invitation: inviteData as Invite });
    return inviteData;
  },

  getInviteByInviterIdWithValidation: async (userId) => {
    const inviteData = await getInviteByInviterIdWithValidation(userId);
    set({ invitationWithValidation: inviteData });
    return inviteData;
  },

  getInviteByTokenWithValidation: async (token) => {
    const inviteData = await getInviteByTokenWithValidation(token);
    set({ invitationWithValidation: inviteData });
    return inviteData;
  },

  setInvitationWithValidation: (invite) => {
    if (invite) {
      const inviteWithValidation = getInviteWithValidation(invite);
      set({ invitationWithValidation: inviteWithValidation });
    } else {
      set({ invitationWithValidation: null });
    }
  },
}));
