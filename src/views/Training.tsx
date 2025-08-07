import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
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
import { Calendar, Target, Crosshair } from "lucide-react";
import GroupStatsTable from "@/components/GroupStatsTable";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import TrainingSessionStatsCard from "@/components/TrainingSessionStatsCard";
import TrainingPageGroupFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageGroupFormModal";
import { toast } from "react-toastify";
import { performanceStore } from "@/store/performance";
import BaseConfirmDeleteModal from "@/components/BaseConfirmDeleteModal";
import SessionStatsCardGrid from "@/components/SessionStatsCardGrid";
import { userStore } from "@/store/userStore";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function TrainingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);
  const { sessionStats, getSessionStatsByTrainingId, deleteSessionStats } = useStore(sessionStore);
  const { createGroupScore, updateGroupScore, deleteGroupScore } = useStore(sessionStore);
  const { fetchGroupingScores, getBestGroupingStatsByTraining } = useStore(performanceStore);
  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isOpen, setIsOpen: setIsOpen } = useModal();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [editingGroupScore, setEditingGroupScore] = useState<any>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [deletingGroupScore, setDeletingGroupScore] = useState<any>(null);
  const [deletingSession, setDeletingSession] = useState<any>(null);
  const hasLoadedData = useRef(false);

  // Filters
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterEffort, setFilterEffort] = useState<string>("all");
  const [filterDistance, setFilterDistance] = useState<string>("all");
  const [filterParticipated, setFilterParticipated] = useState<boolean>(false);

  const { user } = useStore(userStore);

  const filteredSessionStats = sessionStats.filter((s) => {
    // Day/Night
    if (filterDay !== "all" && s.day_period !== filterDay) return false;

    // Effort
    if (filterEffort !== "all") {
      const effortBool = filterEffort === "true";
      if (s.effort !== effortBool) return false;
    }

    // Distance
    if (filterDistance !== "all") {
      // Gather distances from any targets if present
      const targetDistances = (s.targets || s.target_stats || []).map((t: any) => t.distance_m || t.distance).filter(Boolean);
      const minDistance = targetDistances.length ? Math.min(...targetDistances) : null;
      if (minDistance !== null) {
        switch (filterDistance) {
          case "0-300":
            if (!(minDistance >= 0 && minDistance < 300)) return false;
            break;
          case "300-600":
            if (!(minDistance >= 300 && minDistance < 600)) return false;
            break;
          case "600-900":
            if (!(minDistance >= 600 && minDistance < 900)) return false;
            break;
          case "900+":
            if (minDistance < 900) return false;
            break;
        }
      } else {
        // no distance data, exclude when filter active
        return false;
      }
    }

    // Participation
    if (filterParticipated) {
      if (user?.email && s.users?.email !== user.email) {
        return false;
      }
    }

    return true;
  });

  const trainingStatus = training?.status as TrainingStatus;

  useLoadingState(async () => {
    if (!id || hasLoadedData.current) return;
    await loadAssignments();
    await loadTrainingById(id);
    await getSessionStatsByTrainingId(id, 20, 0);
    await getBestGroupingStatsByTraining(id as string);
    await fetchGroupingScores(id);
    hasLoadedData.current = true;
  }, [id]);

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

  const handleCreateGroupScore = async (groupScore: any) => {
    try {
      setIsLoading(true);

      if (editingGroupScore) {
        await updateGroupScore(editingGroupScore.id, groupScore);
        toast.success("Group score updated successfully");
      } else {
        await createGroupScore(groupScore);
        toast.success("Group score created successfully");
      }

      await fetchGroupingScores(id as string);
      setIsOpen(false);
      setEditingGroupScore(null);
    } catch (error) {
      console.error("Error saving group score:", error);
      toast.error("Failed to save group score");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGroupScore = (group: any) => {
    setEditingGroupScore(group);
    setIsOpen(true);
  };

  const handleEditSession = (session: any) => {
    navigate(`/training/${id}/session-stats-full/${session.id}`);
  };

  const handleDeleteSession = (session: any) => {
    setIsConfirmDeleteModalOpen(true);
    setDeletingSession(session);
  };

  const handleDeleteGroupScore = (group: any) => {
    setIsConfirmDeleteModalOpen(true);
    setDeletingGroupScore(group);
  };

  const handleConfirmDelete = async () => {
    if (deletingGroupScore) {
      try {
        setIsLoading(true);
        await deleteGroupScore(deletingGroupScore.id);
        await fetchGroupingScores(id as string);
        toast.success("Group score deleted successfully");
      } catch (error) {
        console.error("Error deleting group score:", error);
        toast.error("Failed to delete group score");
      } finally {
        setIsConfirmDeleteModalOpen(false);
        setDeletingGroupScore(null);
        setIsLoading(false);
      }
    }

    if (deletingSession) {
      try {
        setIsLoading(true);
        await deleteSessionStats(deletingSession.id);
        await getSessionStatsByTrainingId(id as string);
        toast.success("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
        toast.error("Failed to delete session");
      } finally {
        setIsConfirmDeleteModalOpen(false);
        setDeletingSession(null);
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingGroupScore(null);
  };

  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "session-stats", label: "Session Stats", icon: Target },
      { id: "group-stats", label: "Group Stats", icon: Crosshair },
      { id: "status", label: "Status", icon: Calendar },
    ],
  });

  const isDisabled = trainingStatus === TrainingStatus.Completed || trainingStatus === TrainingStatus.Canceled;

  const renderComponent = () => {
    if (activeTab.id === "session-stats") {
      return (
        <div className="grid grid-cols-1 gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-2">
            <Select value={filterDay} onValueChange={(v) => setFilterDay(v)}>
              <SelectTrigger>Day/Night</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEffort} onValueChange={(v) => setFilterEffort(v)}>
              <SelectTrigger>Effort</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDistance} onValueChange={(v) => setFilterDistance(v)}>
              <SelectTrigger>Distance</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-300">0-300</SelectItem>
                <SelectItem value="300-600">300-600</SelectItem>
                <SelectItem value="600-900">600-900</SelectItem>
                <SelectItem value="900+">900+</SelectItem>
              </SelectContent>
            </Select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={filterParticipated} onChange={(e) => setFilterParticipated(e.target.checked)} /> My sessions
            </label>
          </div>

          <TrainingSessionStatsCard trainingSessionId={id!} />
          <SessionStatsCardGrid
            data={filteredSessionStats}
            onCardClick={handleSessionClick}
            onEdit={handleEditSession}
            onDelete={handleDeleteSession}
          />
        </div>
      );
    }

    if (activeTab.id === "group-stats") {
      return (
        <div className="grid grid-cols-1 gap-4">
          <GroupStatsTable
            onGroupStatsClick={handleSessionClick}
            onGroupStatsEditClick={handleEditGroupScore}
            onGroupStatsDeleteClick={handleDeleteGroupScore}
            disabled={isDisabled}
          />
        </div>
      );
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
        title={"Training Session"}
        icon={BiCurrentLocation}
        action={[
          {
            label: "Add Session",
            onClick: () => {
              if (isDisabled) {
                toast.error("Training session is completed or canceled");
              } else {
                navigate(`/training/${id}/session-stats-full/ `);
              }
            },
          },
          {
            label: "Add Group",
            onClick: () => {
              setIsOpen(true);
            },
          },
        ]}
      />
      <SpPageTabs className="justify-center items-center" tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>{renderComponent()}</SpPageBody>
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus!}
      />
      <TrainingPageGroupFormModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        isLoading={isLoading}
        onSubmit={handleCreateGroupScore}
        initialData={editingGroupScore}
      />
      <BaseConfirmDeleteModal
        isLoading={isLoading}
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deletingGroupScore ? "Group Score" : "Session"}`}
        message={`Are you sure you want to delete this ${deletingGroupScore ? "group score" : "session"}?`}
      />
    </SpPage>
  );
}
