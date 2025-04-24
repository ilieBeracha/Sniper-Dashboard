import { getInviteByInviterId } from "@/services/invite";
import { Invite } from "@/types/Invite";
import { create } from "zustand";

interface InvitationStore {
  invitation: Invite;
  getInviteByInviterId: (userId: string) => Promise<Invite | null>;
}

export const InvitationStore = create<InvitationStore>((set) => ({
  invitation: {} as Invite,

  getInviteByInviterId: async (userId) => {
    const inviteData = await getInviteByInviterId(userId);
    set({ invitation: inviteData as Invite });
    return inviteData;
  },
}));
