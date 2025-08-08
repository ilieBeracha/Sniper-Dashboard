import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { getUserGroupingStatsRpc } from "@/services/performance";
import { SpPage, SpPageBody } from "@/layouts/SpPage";
import InviteModal from "@/components/InviteModal";
import Header from "@/Headers/Header";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import DashboardOverview from "@/components/DashboardOverview";
import CommanderView from "@/components/DashboardCommanderView";
import ActivityFeedDrawer from "@/components/ActivityFeedDrawer";
import { weaponsStore } from "@/store/weaponsStore";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const user = useUserStore.user;
  const userRole = useUserStore.user?.user_role ?? null;
  const { getWeapons } = useStore(weaponsStore);
  const { getUserHitStatsFull } = useStore(performanceStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    const load = async () => {
      if (user?.team_id) {
        await getWeapons(user.team_id);
        await getUserGroupingStatsRpc(user.id);
        await getUserHitStatsFull(user?.id);
        await loadNextAndLastTraining(user?.team_id);
        await getSquadMetricsByRole(user?.id);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Removed tabs UI for a cleaner, more professional look.

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Dashboard", link: "/" }]} />
      <SpPageBody>
        <DashboardOverview loading={loading} />
        {isCommander(userRole as UserRole) && (
          <div className="mt-6">
            <CommanderView />
          </div>
        )}
      </SpPageBody>
      {userRole !== "soldier" && user?.id && (
        <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />
      )}
      <ActivityFeedDrawer isOpen={isActivityFeedOpen} onClose={() => setIsActivityFeedOpen(false)} />
    </SpPage>
  );
}
