import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { getUserGroupingStatsRpc } from "@/services/performance";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import InviteModal from "@/components/InviteModal";
import Header from "@/Headers/Header";
import { Activity, Brain, SplinePointerIcon } from "lucide-react";
import { isCommander } from "@/utils/permissions";
import { User, UserRole } from "@/types/user";
import { useTabs } from "@/hooks/useTabs";
import DashboardOverview from "@/components/DashboardOverview";
import DashboardAI from "@/components/DashboardAI";
import CommanderView from "@/components/DashboardCommanderView";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import ActivityFeedDrawer from "@/components/ActivityFeedDrawer";
export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const user = useUserStore.user;
  const userRole = useUserStore.user?.user_role ?? null;

  const { getUserHitStatsFull, getSquadStatsByRole } = useStore(performanceStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await getUserGroupingStatsRpc(user.id);
        await getUserHitStatsFull(user?.id);
        await loadNextAndLastTraining(user?.team_id);
        await getSquadMetricsByRole(user?.id);
        await getSquadStatsByRole(null, null);
      }
      setLoading(false);
    };
    load();
  }, []);

  const baseTabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "ai-insights", label: "AI Insights", icon: Brain },
    { id: "commander-view", label: "Commander View", icon: SplinePointerIcon, disabled: !isCommander(userRole as UserRole) },
  ];

  const { tabs, activeTab, handleTabChange } = useTabs({ tabs: baseTabs as any });

  const RenderComponent = (): React.ReactNode => {
    if (activeTab.id === "overview") {
      return <DashboardOverview />;
    }
    if (activeTab.id === "analytics") {
      return <DashboardAnalytics user={user as User} loading={loading} />;
    }
    if (activeTab.id === "ai-insights") {
      return <DashboardAI />;
    }
    if (activeTab.id === "commander-view") {
      return <CommanderView />;
    }
  };

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Dashboard", link: "/" }]} />
      <SpPageHeader
        isCommander={isCommander(userRole as UserRole)}
        title={activeTab.label}
        subtitle={activeTab.id === "overview" ? "Team, Squad, and more" : "By Date, Squad, and more"}
        icon={activeTab.icon}
        dropdownItems={[
          {
            label: "Invite",
            onClick: () => {
              setIsInviteModalOpen(true);
            },
          },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>{RenderComponent()}</SpPageBody>
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
      <ActivityFeedDrawer isOpen={isActivityFeedOpen} onClose={() => setIsActivityFeedOpen(false)} />
    </SpPage>
  );
}
