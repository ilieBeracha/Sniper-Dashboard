import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { getUserGroupingStatsRpc } from "@/services/performance";
import { Activity, Brain, SplinePointerIcon } from "lucide-react";
import DashboardAI from "@/components/DashboardAI";
import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import CommanderView from "@/components/DashboardCommanderView";

export function useDashboardPageLogic() {
  const useUserStore = useStore(userStore);
  const user = useUserStore.user;
  const userRole = useUserStore.user?.user_role ?? null;

  const { getUserHitPercentage, getSquadStats } = useStore(performanceStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "ai-insights", label: "Insights", icon: Brain },
    { id: "commander-view", label: "Commander", icon: SplinePointerIcon },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

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

  const RenderComponent = (): React.ReactNode => {
    if (activeTab === "overview") {
      return (
        <div className="flex flex-col gap-4">
          <DashboardRowOne user={user} />
          <DashboardRowKPI />
          <DashboardRowThree loading={loading} />
          <DashboardRowFour />
        </div>
      );
    }
    if (activeTab === "ai-insights") {
      return <DashboardAI />;
    }
    if (activeTab === "commander-view") {
      return <CommanderView />;
    }
  };

  return {
    user,
    userRole,
    loading,
    isInviteModalOpen,
    setIsInviteModalOpen,
    tabs,
    activeTab,
    setActiveTab,
    RenderComponent,
  };
}
