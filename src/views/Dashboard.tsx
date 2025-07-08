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
import { getUserGroupingStatsRpc } from "@/services/performance";
import DashboardRowKPI from "@/components/DashboardRowKPI";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Calendar, Brain, SplinePointerIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DashboardAI from "@/components/DashboardAI";

export default function Dashboard() {
  const useUserStore = useStore(userStore);
  const { getUserHitPercentage, getSquadStats } = useStore(performanceStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { getSquadMetricsByRole } = useStore(squadStore);
  const { loadNextAndLastTraining } = useStore(TrainingStore);

  const [loading, setLoading] = useState(true);

  const userRole = useUserStore.userRole;
  const user = useUserStore.user;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Overview" | "AI Insights">("Overview");
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

  const handleTabChange = (tab: "Overview" | "AI Insights") => {
    setActiveTab(tab);
  };

  return (
    <div className={`min-h-[calc(100dvh-100px)] transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
      <Header title="Overview">
        <BaseButton
          className={`text-xs rounded-2xl px-4 py-1 cursor-pointer transition-colors duration-200 ${
            theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsInviteModalOpen(!isInviteModalOpen)}
        >
          Invite
        </BaseButton>
      </Header>

      <div className={`px-8 py-14 rounded-2xl transition-all duration-200`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
              <SplinePointerIcon className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                {activeTab === "AI Insights" ? "AI Insights" : "Overview"}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <div className={`flex items-center gap-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <Calendar className="w-4 h-4" />
                  {activeTab === "Overview" ? (
                    <span>
                      Team, Squad, and more <span className="text-xs text-gray-400"></span>
                    </span>
                  ) : (
                    <span>By Date, Squad, and more</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">{activeTab === "AI Insights" && <div className="flex items-center gap-2"> </div>}</div>
        </div>
      </div>

      {/* Enhanced Tabs with AI */}
      <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <nav className={`flex ${isMobile ? "justify-center space-x-4" : "justify-start space-x-8"} items-center px-4 `} aria-label="Tabs">
          {[
            { id: "Overview", label: "Overview", icon: Activity, description: "Performance metrics" },
            { id: "AI Insights", label: "AI Insights", icon: Brain, description: "AI recommendations" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as "Overview" | "AI Insights")}
                className={`group relative flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? theme === "dark"
                      ? "border-purple-400 text-purple-400"
                      : ""
                    : theme === "dark"
                      ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                title={tab.description}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
                <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>

                {/* Active indicator */}
                {isActive && <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full`} />}

                {/* New badge for AI tab */}
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

      {activeTab === "AI Insights" ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
            <DashboardAI />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 px-4 md:px-6 py-4 2xl:px-6">
            <DashboardRowOne user={user} />
            <DashboardRowKPI />
            <DashboardRowThree loading={loading} />
            <DashboardRowFour />
          </div>
        </div>
      )}
      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </div>
  );
}
