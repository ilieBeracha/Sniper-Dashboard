import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import InviteModal from "@/components/InviteModal";
import { TrainingStore } from "@/store/trainingStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { getUserGroupingSummaryRpc } from "@/services/performance";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { getUserHitPercentage, getSquadStats } = useStore(performanceStore);
  const { theme } = useTheme();

  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const [loading, setLoading] = useState(true);

  const userRole = useUserStore.userRole;
  const user = useUserStore.user;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await getUserGroupingSummaryRpc(user.id);
        await getUserHitPercentage(user?.id);
        await loadNextAndLastTraining(user?.team_id);
        await getSquadMetricsByRole(user?.id);
        await getSquadStats(user?.team_id, null, null);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className={`min-h-[calc(100dvh-100px)] transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
      <Header title="Overview">
        <BaseButton
          className={`text-xs rounded-2xl px-4 py-1 cursor-pointer transition-colors duration-200 ${
            theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsInviteModalOpen(!isInviteModalOpen)}
        >
          Invite
        </BaseButton>
      </Header>
      <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
        <DashboardRowOne user={user} />
        <DashboardRowKPI />
        <DashboardRowThree loading={loading} />
        <DashboardRowFour />
      </div>
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
