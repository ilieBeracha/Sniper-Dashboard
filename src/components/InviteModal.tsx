import { useState } from "react";
import { UserPlus, ClipboardCheck, Loader2, Info } from "lucide-react";
import { InvitationStore } from "@/store/InvitationStore";
import { useStore } from "zustand";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";
import BaseButton from "./base/BaseButton";
import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";

export default function InviteModal({ isOpen, setIsOpen, userId }: { isOpen: boolean; setIsOpen: (open: boolean) => void; userId: string }) {
  const invitation = useStore(InvitationStore).invitation;
  const [loading, setLoading] = useState(false);
  const [inviteFetched, setInviteFetched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { getInviteByInviterId, regenerateInvite } = useStore(InvitationStore);

  const handleCreateInvite = async () => {
    if (!user) return;

    if (!user.user_role) return;
    const newInvite = await regenerateInvite(user?.id);

    if (newInvite) {
      setInviteFetched(true);
    }
  };
  const handleInvite = async () => {
    setLoading(true);
    try {
      if (!userId) return;

      const existingInvite = await getInviteByInviterId(userId);
      if (existingInvite && existingInvite.valid) {
        setInviteFetched(true);
      } else {
        await handleCreateInvite();
      }
    } catch (err) {
      console.error("Failed to fetch or create invite:", err);
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
    <div className="flex flex-col items-center text-center py-4 space-y-6 h-full w-full">
      <div
        className={`p-4 rounded-full shadow-lg transition-colors duration-200 ${
          theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50" : "bg-gray-100 border border-gray-300"
        }`}
      >
        <UserPlus className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
      </div>

      {inviteFetched ? (
        <div className="w-full space-y-4">
          {/* Token Display */}
          <div
            className={`relative flex items-center justify-evenly px-4 py-3 rounded-lg font-mono text-sm transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/50 border border-zinc-700/50 text-white" : "bg-gray-100 border border-gray-300 text-gray-900"
            }`}
          >
            <span className="truncate pr-4">{invitation?.token}</span>
            <BaseButton
              onClick={handleCopy}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white focus:ring-zinc-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 focus:ring-gray-400"
              }`}
              type="button"
            >
              {copied ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ClipboardCheck className="w-4 h-4" /> Copied
                </span>
              ) : (
                "Copy"
              )}
            </BaseButton>
          </div>

          {/* Instructions */}
          <div
            className={`text-left space-y-3 text-sm p-4 rounded-lg border transition-colors duration-200 ${
              theme === "dark" ? "text-zinc-400 bg-zinc-800/30 border-zinc-700/50" : "text-gray-600 bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className={`font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Share this token securely with your chosen Squad Commander</li>
              <li>They will use this token to register and join your team</li>
              <li>Monitor your team dashboard for when they complete registration</li>
              <li>This token can only be used once and is time-limited</li>
            </ol>
          </div>

          <BaseButton
            onClick={onCloseModal}
            className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 focus:ring-zinc-600"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 focus:ring-gray-400"
            }`}
          >
            Close
          </BaseButton>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 sm:px-6 h-full w-full space-y-6">
          <div className="space-y-2">
            <h2 className={`text-lg sm:text-xl font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Invite Your Squad Commander
            </h2>
            <p className={`text-sm max-w-md transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
              Generate and share the invite token below to onboard your Squad Commander.
            </p>
          </div>

          <BaseButton
            onClick={() => setShowInfo(!showInfo)}
            className={`flex items-center gap-2 text-sm transition-colors ${
              theme === "dark" ? "text-zinc-400 hover:text-zinc-300" : "text-gray-600 hover:text-gray-700"
            }`}
          >
            <Info className="w-4 h-4" />
            {showInfo ? "Hide Process Details" : "Show Process Details"}
          </BaseButton>

          {showInfo && (
            <div
              className={`w-full text-left space-y-4 text-sm p-4 rounded-lg border transition-colors duration-200 ${
                theme === "dark" ? "text-zinc-400 bg-zinc-800/30 border-zinc-700/50" : "text-gray-600 bg-gray-50 border-gray-200"
              }`}
            >
              <div className="space-y-3">
                <h3 className={`font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Team Manager Process:
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Generate a unique invitation token</li>
                  <li>Share the token securely with your Squad Commander</li>
                  <li>Monitor the registration process in your dashboard</li>
                  <li>Assign the Squad Commander to their squad once registered</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h3 className={`font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Squad Commander Process:
                </h3>
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
            className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              theme === "dark"
                ? "text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                : "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-gray-50"
            }`}
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
    <BaseMobileDrawer title="Invite Your Squad Commander" onClose={() => setIsOpen(false)} isOpen={isOpen} setIsOpen={setIsOpen}>
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer title="Invite Your Squad Commander" onClose={() => setIsOpen(false)} isOpen={isOpen} setIsOpen={setIsOpen} width="400px">
      {Content}
    </BaseDesktopDrawer>
  );
}
