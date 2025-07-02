import { useEffect } from "react";
import { useStore } from "zustand";
import { useAiStore } from "@/store/AiStore";
import { userStore } from "@/store/userStore";
import AiForm from "@/components/AiForm";
import Header from "@/Headers/Header";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Ai() {
  const { fetchUserProfile } = useAiStore();
  const { user } = useStore(userStore);
  const isMobile = useIsMobile();
  useEffect(() => {
    const initialize = async () => {
      if (user?.id) {
        await fetchUserProfile(user.id);
      }
    };
    initialize();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100">
      {isMobile && (
        <Header title="AI Assistant">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        </Header>
      )}

      <div className="container mx-auto h-full">
        <AiForm />
      </div>
    </div>
  );
}
