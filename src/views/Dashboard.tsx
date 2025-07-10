import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { squadStore } from "@/store/squadStore";
import { performanceStore } from "@/store/performance";
import { TrainingStore } from "@/store/trainingStore";
import { getUserGroupingStatsRpc } from "@/services/performance";
import { isCommander } from "@/utils/permissions";

import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";
import DashboardAI from "@/components/DashboardAI";
import InviteModal from "@/components/InviteModal";
import CommanderView from "@/components/CommanderView";

import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Activity, Calendar, Brain, SplinePointerIcon } from "lucide-react";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { getUserHitPercentage, getSquadStats } = useStore(performanceStore);
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const user = useUserStore.user;
  const userRole = useUserStore.userRole;
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Overview" | "AI Insights" | "Commander View">("Overview");

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

  const handleTabChange = (tab: "Overview" | "AI Insights" | "Commander View") => {
    setActiveTab(tab);
  };

  const availableTabs = [
    { id: "Overview", label: "Overview", icon: Activity, description: "Performance metrics" },
    { id: "AI Insights", label: "AI Insights", icon: Brain, description: "AI recommendations" },
  ];

  if (isCommander(userRole)) {
    availableTabs.push({
      id: "Commander View",
      label: "Commander View",
      icon: SplinePointerIcon,
      description: "Compare squads and members",
    });
  }

  return (
    <div className={`min-h-[calc(100dvh-100px)] transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
      <Header title={activeTab}>
        <BaseButton
          className={`text-xs rounded-2xl px-4 py-1 cursor-pointer transition-colors duration-200 ${
            theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsInviteModalOpen(!isInviteModalOpen)}
        >
          Invite
        </BaseButton>
      </Header>

      <div className="px-8 py-14 rounded-2xl transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
              <SplinePointerIcon className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{activeTab}</h2>
              <div className="flex items-center gap-4 mt-1">
                <div className={`flex items-center gap-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <Calendar className="w-4 h-4" />
                  {activeTab === "Overview" ? <span>Team, Squad, and more</span> : <span>By Date, Squad, and more</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <nav className={`flex ${isMobile ? "justify-center space-x-4" : "justify-start space-x-8"} items-center px-4`} aria-label="Tabs">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`group relative flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? theme === "dark"
                      ? "border-purple-400 text-purple-400"
                      : "border-purple-600 text-purple-600"
                    : theme === "dark"
                      ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                title={tab.description}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
                <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>
                {tab.id === "AI Insights" && (
                  <span
                    className={`absolute -top-1 -right-1 inline-flex items-center justify-center w-2 h-2 rounded-full ${
                      theme === "dark" ? "bg-purple-500" : "bg-purple-600"
                    }`}
                  >
                    <span className="sr-only">New AI feature</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
            <DashboardRowOne user={user} />
            <DashboardRowKPI />
            <DashboardRowThree loading={loading} />
            <DashboardRowFour />
          </div>
        </div>
      )}

      {activeTab === "AI Insights" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
            <DashboardAI />
          </div>
        </div>
      )}

      {activeTab === "Commander View" && isCommander(userRole) && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
            <div className="text-xl font-bold">Squad Comparison View</div>
            <CommanderView />
          </div>
        </div>
      )}

      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
