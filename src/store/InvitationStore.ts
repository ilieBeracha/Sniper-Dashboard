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
    console.log("userId", userId);
    const inviteData = await getInviteByInviterId(userId);
    console.log(inviteData);
    set({ invitation: inviteData as Invite });
    return inviteData;
  },
}));
