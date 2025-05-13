import { useState } from "react";
import { UserPlus, ClipboardCheck, Loader2 } from "lucide-react";
import { InvitationStore } from "@/store/InvitationStore";
import { useStore } from "zustand";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function InviteModal({ isOpen, setIsOpen, userId }: { isOpen: boolean; setIsOpen: (open: boolean) => void; userId: string }) {
  const isMobile = useIsMobile();
  const useInvitationStore = useStore(InvitationStore);
  const invitation = useInvitationStore.invitation;
  const [loading, setLoading] = useState(false);
  const [inviteFetched, setInviteFetched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    try {
      if (!userId) return;
      await useInvitationStore.getInviteByInviterId(userId);
      setInviteFetched(true);
    } catch (err) {
      console.error("Failed to fetch invite:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!invitation?.token) return;
    try {
      await navigator.clipboard.writeText(invitation.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy");
    }
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setInviteFetched(false);
    setCopied(false);
  };

  const Content = (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 py-4 space-y-6 h-full w-full">
      <div className="p-4 rounded-full bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Invite Your Squad Commander</h2>
        <p className="text-sm text-zinc-400 max-w-md">Generate and share the invite token below to onboard your Squad Commander.</p>
      </div>

      {inviteFetched ? (
        <div className="w-full space-y-4">
          {/* Token Display */}
          <div className="relative flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-white font-mono text-sm">
            <span className="truncate pr-4">{invitation?.token}</span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 px-3 py-1.5 rounded-md bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              {copied ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ClipboardCheck className="w-4 h-4" /> Copied
                </span>
              ) : (
                "Copy"
              )}
            </button>
          </div>

          <button
            onClick={onCloseModal}
            className="w-full px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 sm:px-6 py-4 space-y-6 h-full w-full">
          <div className="flex flex-col items-center text-center px-4 sm:px-6 py-4 space-y-6 h-full w-full"></div>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="flex-shrink-0 px-3 py-1.5 rounded-md bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate Invite Code"
            )}
          </button>
          <div className="flex flex-col items-center text-center px-4 sm:px-6 py-4 space-y-6 h-full w-full">
            <p className="text-xs text-zinc-400">Generate and share the invite token below to onboard your Squad Commander.</p>
          </div>
        </div>
      )}
    </div>
  );

  return isMobile ? (
    <BaseMobileDrawer title="Invite Your Squad Commander" isOpen={isOpen} setIsOpen={setIsOpen}>
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer title="Invite Your Squad Commander" isOpen={isOpen} setIsOpen={setIsOpen} width="400px">
      {Content}
    </BaseDesktopDrawer>
  );
}
