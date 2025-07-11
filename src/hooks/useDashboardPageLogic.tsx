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
import CommanderView from "@/components/CommanderView";

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
    { label: "Overview", icon: Activity },
    { label: "AI Insights", icon: Brain },
    { label: "Commander View", icon: SplinePointerIcon },
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

  const RenderComponent = (): React.ReactNode => {
    if (activeTab === "Overview") {
      return (
        <div className="flex flex-col gap-4">
          <DashboardRowOne user={user} />
          <DashboardRowKPI />
          <DashboardRowThree loading={loading} />
          <DashboardRowFour />
        </div>
      );
    }
    if (activeTab === "AI Insights") {
      return <DashboardAI />;
    }
    if (activeTab === "Commander View") {
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
