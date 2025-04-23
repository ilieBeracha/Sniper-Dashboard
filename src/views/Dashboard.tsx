// Dashboard.tsx - Main component
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import Header from "@/components/Header";

import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowTwo from "@/components/DashboardRowTwo";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import InviteModal from "@/components/InviteModal";
import { groupingScoreStore } from "@/store/groupingScoresStore";
import { ScoreStore } from "@/store/scoreStore";
import { trainingStore } from "@/store/trainingStore";
import { squadStore } from "@/store/squadStore";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const { getUserHitPercentage } = useStore(ScoreStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadTrainings } = useStore(trainingStore);
  const [loading, setLoading] = useState(true);
  const { getUserGroupingScores } = useStore(groupingScoreStore);

  const userRole = useUserStore.userRole;
  const user = useUserStore.user;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await fetchMembers(user.team_id);
        await getUserGroupingScores(user.id);
        await getUserHitPercentage(user.id);
        await loadTrainings(user.team_id);
        await getSquadMetricsByRole(user.id);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <Header setIsOpen={setIsInviteModalOpen} />
      <div className="space-y-12">
        <DashboardRowOne user={user} />
        <DashboardRowTwo />
        <DashboardRowThree loading={loading} />
        <DashboardRowFour />
      </div>
      {userRole !== "soldier" && user?.id && (
        <InviteModal
          isOpen={isInviteModalOpen}
          setIsOpen={setIsInviteModalOpen}
          userId={user.id}
        />
      )}
    </div>
  );
}
