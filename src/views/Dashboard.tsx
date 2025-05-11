import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import Header from "@/components/Header";

import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import InviteModal from "@/components/InviteModal";
import { TrainingStore } from "@/store/trainingStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { getUserGroupingSummaryRpc } from "@/services/performance";
import DashboardRowKPI from "@/components/DashboardRowKPI";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { getUserHitPercentage, getTopAccurateSnipers, getDayNightPerformance, getSquadStats } = useStore(performanceStore);

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
        await getUserHitPercentage(user.id);
        await loadNextAndLastTraining(user.team_id);
        await getSquadMetricsByRole(user.id);
        await getTopAccurateSnipers(user.team_id);
        await getDayNightPerformance(user.team_id);
        await getSquadStats(user.team_id, null, null);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-[calc(100dvh-100px)] max-w-screen-3xl mx-auto  from-[#1E1E20] text-gray-100 p-3">
      {userRole !== "soldier" && <Header setIsOpen={setIsInviteModalOpen} />}
      <div className="grid grid-cols-1 gap-2">
        <DashboardRowOne user={user} />
        <DashboardRowKPI />
        <DashboardRowThree loading={loading} />
        {/* <DashboardRowTwo /> */}
        <DashboardRowFour />
      </div>
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
