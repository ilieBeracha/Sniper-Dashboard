import { useEffect } from "react";
import { useStore } from "zustand";
import { useAiStore } from "@/store/AiStore";
import { userStore } from "@/store/userStore";
import AiForm from "@/components/AiForm";

export default function Ai() {
  const { fetchUserProfile } = useAiStore();
  const { user } = useStore(userStore);

  useEffect(() => {
    const initialize = async () => {
      if (user?.id) {
        await fetchUserProfile(user.id);
      }
    };
    initialize();
  }, [user]);

  return (
    <div className="bg-[#121212] text-gray-100 p-6 min-h-[100dvh] w-full h-full">
      <div className="max-w-4xl mx-auto h-full">
        <AiForm />
      </div>
    </div>
  );
}
