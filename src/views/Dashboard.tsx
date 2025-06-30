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
import { getTopAccurateScores, getUserGroupingSummaryRpc } from "@/services/performance";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import Header from "@/Headers/Header";

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
        await getTopAccurateScores(user.team_id);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-[calc(100dvh-100px)]  text-gray-100 ">
      <Header title="Overview">
        {" "}
        <p className="bg-gray-700 text-xs rounded-2xl px-4 py-1" onClick={() => setIsInviteModalOpen(!isInviteModalOpen)}>
          Invite
        </p>
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4 md:p-6 2xl:p-10 ">
        <DashboardRowOne user={user} />
        <DashboardRowKPI />
        <DashboardRowThree loading={loading} />
        <DashboardRowFour />
      </div>
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
