import { getInviteByInviterId } from "@/services/invite";
import { Invite } from "@/types/Invite";
import { create } from "zustand";

interface InvitationStore {
  Invitation: Invite;
  getInviteByInviterId: (userId: string) => Promise<Invite | null>;
}

export const InvitationStore = create<InvitationStore>((set) => ({
  Invitation: {} as Invite,

  getInviteByInviterId: async (userId) => {
    const inviteData = await getInviteByInviterId(userId);
    console.log(inviteData);
    set({ Invitation: inviteData as Invite });
    return inviteData;
  },
}));
