import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { supabase } from "@/services/supabaseClient";
import { loaderStore } from "@/store/loaderStore";
import { TrainingStore } from "@/store/trainingStore";
import { sessionStore } from "@/store/sessionStore";
import { useLoadingState } from "@/hooks/useLoadingState";
import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { useModal } from "@/hooks/useModal";
import { useTabs } from "@/hooks/useTabs";
import { Activity, Calendar } from "lucide-react";
import { Target } from "lucide-react";
import SessionStatsTable from "@/components/SessionStatsTable";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import TrainingSessionStatsCard from "@/components/TrainingSessionStatsCard";
import { OutlineExportButton } from "@/components/TrainingPDFExportButton";
import { performanceStore } from "@/store/performance";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { userStore } from "@/store/userStore";

export default function TrainingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);
  const { getSessionStatsByTrainingId, sessionStats } = useStore(sessionStore);
  const { trainingTeamAnalytics, getTrainingTeamAnalytics, squadStats, getSquadStatsByRole } = performanceStore();
  const { weapons, getWeapons } = useStore(weaponsStore);
  const { equipments, getEquipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useLoadingState(async () => {
    if (!id || !user?.team_id) return;
    await loadAssignments();
    await loadTrainingById(id);
    await getSessionStatsByTrainingId(id);
    await getTrainingTeamAnalytics(id);
    await getSquadStatsByRole(null, null); // Get all squad stats
    await getWeapons(user.team_id);
    await getEquipments(user.team_id);
  }, [id, user?.team_id]);

  const handleStatusChange = (newStatus: TrainingStatus) => {
    setPendingStatus(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      await supabase.from("training_session").update({ status: pendingStatus }).eq("id", training?.id);
      await loadTrainingById(id as string);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsConfirmModalOpen(false);
      setPendingStatus(null);
    }
  };

  const handleAddAssignment = async (assignmentName: string) => {
    try {
      setIsLoading(true);
      await createAssignment(assignmentName, true, training?.id as string);
      await loadTrainingById(id as string);
    } catch (error) {
      console.error("Error adding assignment:", error);
    } finally {
      setIsAddAssignmentOpen(false);
      setIsLoading(false);
    }
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
  };
  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "session-stats", label: "Session Stats", icon: Target },
      { id: "analytics", label: "Analytics", icon: Activity },
      { id: "status", label: "Status", icon: Calendar },
    ],
  });

  const renderComponent = () => {
    if (activeTab.id === "session-stats") {
      return (
        <div className="grid grid-cols-1 gap-4">
          <TrainingSessionStatsCard trainingSessionId={id!} />
          <SessionStatsTable sessionStats={selectedSession} onSessionStatsClick={handleSessionClick} onSessionStatsEditClick={() => {}} />
        </div>
      );
    }

    if (activeTab.id === "analytics") {
      return <TrainingAnalyticsTab trainingSessionId={id!} />;
    }

    if (activeTab.id === "status") {
      return <TrainingStatusTab training={training as TrainingSession} sessionStats={selectedSession} handleStatusChange={handleStatusChange} />;
    }
  };

  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
          { label: "Training Session", link: `/trainings/${id}` },
        ]}
      />
      <SpPageHeader
        title={training?.session_name || "Training Session"}
        icon={BiCurrentLocation}
        dropdownItems={[
          {
            label: "Full Page Form",
            onClick: () => {
              navigate(`/training/${id}/session-stats-full`);
            },
          },
        ]}
      />
      
      {/* Custom Export Section */}
      <div className="px-6 pb-4 -mt-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {training?.date && (
              <span>Training Date: {new Date(training.date).toLocaleDateString()}</span>
            )}
            {training?.location && (
              <span className="ml-4">Location: {training.location}</span>
            )}
          </div>
                     <OutlineExportButton
             trainingData={{
               training: training!,
               participants: training?.participants || [],
               analytics: trainingTeamAnalytics!,
               squadStats: squadStats || [],
               weaponStats: [], // This would need to be fetched separately if available
               dayNightPerformance: [], // This would need to be fetched separately if available
               squadPerformance: [], // This would need to be fetched separately if available
               trainingEffectiveness: [], // This would need to be fetched separately if available
               weapons: weapons || [],
               equipment: equipments || []
             }}
             size="sm"
             buttonText="Export PDF Report"
             disabled={!training || !trainingTeamAnalytics}
             onExportComplete={() => {
               console.log('Training report exported successfully!');
               // You can add a toast notification here later
             }}
             onExportError={(error) => {
               console.error('Export failed:', error);
               // You can add an error toast notification here later
             }}
           />
        </div>
      </div>
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>{renderComponent()}</SpPageBody>
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus!}
      />
    </SpPage>
  );
}
