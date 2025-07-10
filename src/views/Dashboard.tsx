import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { getUserGroupingStatsRpc } from "@/services/performance";

import BaseButton from "@/components/BaseButton";
import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import DashboardAI from "@/components/DashboardAI";
import InviteModal from "@/components/InviteModal";
import CommanderView from "@/components/CommanderView";

import { Activity, Brain, SplinePointerIcon } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { getUserHitPercentage, getSquadStats } = useStore(performanceStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const user = useUserStore.user;
  const userRole = useUserStore.user?.user_role ?? null;
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const tabs = [
    { label: "Overview", icon: <Activity /> },
    { label: "AI Insights", icon: <Brain /> },
    { label: "Commander View", icon: <SplinePointerIcon /> },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await getUserGroupingStatsRpc(user.id);
        await getUserHitPercentage(user?.id);
        await loadNextAndLastTraining(user?.team_id);
        await getSquadMetricsByRole(user?.id);
        await getSquadStats(null, null);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <SpPage>
      <Header title={"Dashboard"}>
        <BaseButton onClick={() => setIsInviteModalOpen(!isInviteModalOpen)}>Invite</BaseButton>
      </Header>
      <SpPageHeader
        title="Dashboard"
        subtitle={activeTab === "Overview" ? "Team, Squad, and more" : "By Date, Squad, and more"}
        icon={<SplinePointerIcon />}
        breadcrumbs={[{ label: "Dashboard", link: "/" }]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <SpPageBody>
        {activeTab === "Overview" && (
          <>
            <DashboardRowOne user={user} />
            <DashboardRowKPI />
            <DashboardRowThree loading={loading} />
            <DashboardRowFour />
          </>
        )}

        {activeTab === "AI Insights" && <DashboardAI />}

        {activeTab === "Commander View" && <CommanderView />}
      </SpPageBody>

      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </SpPage>
  );
}
