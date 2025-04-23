import { useState } from "react";
import BaseModal from "./BaseModal";
import { UserPlus, ClipboardCheck } from "lucide-react";
import { InvitationStore } from "@/store/InvitationStore";
import { useStore } from "zustand";

export default function InviteModal({
  isOpen,
  setIsOpen,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}) {
  const useInvitationStore = useStore(InvitationStore);
  const invitation = useInvitationStore.Invitation;
  const [loading, setLoading] = useState(false);
  const [inviteFetched, setInviteFetched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    try {
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

  return (
    <BaseModal isOpen={isOpen} onClose={onCloseModal}>
      <div className="flex flex-col items-center text-center space-y-6 px-4 py-2">
        <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full shadow-inner">
          <UserPlus className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Invite Your Squad Commander
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
          Share the code below to invite your Squad Commander to join your team.
        </p>

        {inviteFetched ? (
          <div className="w-full space-y-4">
            <div className="relative flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg text-gray-800 dark:text-white font-mono text-sm shadow-inner">
              <span className="truncate">{invitation?.token}</span>
              <button
                onClick={handleCopy}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 ml-4"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <ClipboardCheck className="w-4 h-4" /> Copied
                  </span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
            <button
              onClick={onCloseModal}
              className="w-full px-6 py-2 text-sm bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={handleInvite}
            className="mt-4 px-6 py-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow hover:opacity-90 transition-all"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Invite Code"}
          </button>
        )}
      </div>
    </BaseModal>
  );
}
