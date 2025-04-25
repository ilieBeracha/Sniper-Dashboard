import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(invitation);
  }, [invitation]);

  return (
    <BaseModal isOpen={isOpen} onClose={onCloseModal}>
      <div className="flex flex-col items-center text-center px-6 py-4 space-y-6">
        <div className="bg-indigo-500/10 text-indigo-400 p-4 rounded-full shadow-sm">
          <UserPlus className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Invite Your Squad Commander
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          Generate and share the invite token below to onboard your Squad
          Commander.
        </p>

        {inviteFetched ? (
          <div className="w-full space-y-4">
            <div className="relative flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg text-white font-mono text-sm shadow-md">
              <span className="truncate">{invitation?.token}</span>
              <button
                onClick={handleCopy}
                className="ml-4 text-indigo-400 hover:text-indigo-300 transition"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <ClipboardCheck className="w-4 h-4" /> Copied
                  </span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>

            <button
              onClick={onCloseModal}
              className="w-full px-6 py-2 text-sm text-gray-300 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={handleInvite}
            className="w-full mt-2 px-6 py-3 text-white text-sm bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Invite Code"}
          </button>
        )}
      </div>
    </BaseModal>
  );
}
