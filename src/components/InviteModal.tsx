import { useState } from "react";
import { UserPlus, ClipboardCheck, Loader2, Info } from "lucide-react";
import { InvitationStore } from "@/store/InvitationStore";
import { useStore } from "zustand";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";

export default function InviteModal({ isOpen, setIsOpen, userId }: { isOpen: boolean; setIsOpen: (open: boolean) => void; userId: string }) {
  const useInvitationStore = useStore(InvitationStore);
  const invitation = useInvitationStore.invitation;
  const [loading, setLoading] = useState(false);
  const [inviteFetched, setInviteFetched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    setShowInfo(false);
  };

  const Content = (
    <div className="flex flex-col items-center text-center px-4 sm:px-6 py-4 space-y-6 h-full w-full">
      <div className="p-4 rounded-full bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
        <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
      </div>

      {inviteFetched ? (
        <div className="w-full space-y-4">
          {/* Token Display */}
          <div className="relative flex items-center justify-evenly px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-white font-mono text-sm">
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

          {/* Instructions */}
          <div className="text-left space-y-3 text-sm text-zinc-400 bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/50">
            <h3 className="font-medium text-white">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Share this token securely with your chosen Squad Commander</li>
              <li>They will use this token to register and join your team</li>
              <li>Monitor your team dashboard for when they complete registration</li>
              <li>This token can only be used once and is time-limited</li>
            </ol>
          </div>

          <button
            onClick={onCloseModal}
            className="w-full px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 sm:px-6 h-full w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Invite Your Squad Commander</h2>
            <p className="text-sm text-zinc-400 max-w-md">Generate and share the invite token below to onboard your Squad Commander.</p>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <Info className="w-4 h-4" />
            {showInfo ? "Hide Process Details" : "Show Process Details"}
          </button>

          {showInfo && (
            <div className="w-full text-left space-y-4 text-sm text-zinc-400 bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/50">
              <div className="space-y-3">
                <h3 className="font-medium text-white">Team Manager Process:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Generate a unique invitation token</li>
                  <li>Share the token securely with your Squad Commander</li>
                  <li>Monitor the registration process in your dashboard</li>
                  <li>Assign the Squad Commander to their squad once registered</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-white">Squad Commander Process:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Receive the invitation token from Team Manager</li>
                  <li>Use the token to register and join the team</li>
                  <li>Complete profile setup and squad information</li>
                  <li>Access squad management tools and resources</li>
                </ol>
              </div>
            </div>
          )}

          <button
            onClick={handleInvite}
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed"
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
