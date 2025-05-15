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
import { List } from "lucide-react";
import { FaStackOverflow } from "react-icons/fa";

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
    <div className="min-h-[calc(100dvh-100px)] from-[#1E1E20] text-gray-100 ">
      <div className="flex items-center justify-between px-2 py-4 border-b border-white/5">
        <div className="flex items-center">
          <List className="w-5 h-5 text-indigo-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-xs font-medium bg-indigo-500/20 text-indigo-300 p-2 rounded-full">
            <FaStackOverflow className="w-3 h-3" />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-6">
        <DashboardRowOne user={user} />
        <DashboardRowKPI />
        <DashboardRowThree loading={loading} />
        <DashboardRowFour />
      </div>
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
