import { useState, useEffect, useCallback } from "react";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { sessionGroupStore } from "@/store/sessionGroupStore";
import { useLoadingState } from "@/hooks/useLoadingState";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import TrainingListEnhanced from "@/components/TrainingList/TrainingListEnhanced";
import SpPagination from "@/layouts/SpPagination";
import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import SessionGroupFilterCard from "@/components/SessionGroups/SessionGroupFilterCard";
import SessionGroupBulkActionsBar from "@/components/SessionGroups/SessionGroupBulkActionsBar";
import SessionGroupManagementModal from "@/components/SessionGroups/SessionGroupManagementModal";
import { BiCurrentLocation } from "react-icons/bi";
import { Settings } from "lucide-react";
import Header from "@/Headers/Header";
import { weaponsStore } from "@/store/weaponsStore";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { TrainingsListSkeleton } from "@/components/DashboardSkeletons";
import { TrainingGroup } from "@/types/sessionGroup";
import { TrainingSession } from "@/types/training";

export default function Trainings() {
  // Store hooks
  const { loadTrainingByTeamId, getTrainingCountByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const user = useStore(userStore).user;
  const assignments = useStore(TrainingStore).assignments;
  const { getWeapons } = useStore(weaponsStore);
  const { selectedGroup, trainingsInGroup, loadTrainingsInGroup } = useStore(sessionGroupStore);

  // Pagination state
  const LIMIT = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Training data state
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);

  const isCommanderUser = isCommander(user?.user_role as UserRole);

  // Load initial data
  useLoadingState(async () => {
    if (!user?.team_id) return;
    await Promise.all([
      loadWeeklyAssignmentsStats(user.team_id),
      loadAssignments(),
      getWeapons(user.team_id)
    ]);
  }, [user?.team_id]);

  // Load trainings based on group selection
  const loadTrainings = useCallback(async () => {
    if (!user?.team_id) return;

    setIsLoading(true);
    
    try {
      if (selectedGroup) {
        // Load trainings for selected group
        await loadTrainingsInGroup(selectedGroup.id);
        setHasMore(false);
        setCurrentPage(0);
      } else {
        // Load all trainings with pagination
        const [result, count] = await Promise.all([
          loadTrainingByTeamId(user.team_id, LIMIT, currentPage * LIMIT),
          getTrainingCountByTeamId(user.team_id),
        ]);
        
        setTrainings(result || []);
        setTotalCount(count);
        setHasMore((result?.length || 0) === LIMIT);
      }
    } catch (error) {
      console.error("Error loading trainings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.team_id, currentPage, selectedGroup, loadTrainingByTeamId, getTrainingCountByTeamId, loadTrainingsInGroup]);

  // Effect to load trainings when dependencies change
  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  // Update displayed trainings based on group selection
  useEffect(() => {
    if (selectedGroup && trainingsInGroup) {
      setTrainings(trainingsInGroup);
      setTotalCount(trainingsInGroup.length);
    }
  }, [selectedGroup, trainingsInGroup]);

  // Page scrolling effect
  useEffect(() => {
    if (isPageChanging) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsPageChanging(false);
      }, 200);
    }
  }, [isPageChanging]);

  // Event handlers
  const handleGroupChange = (_group: TrainingGroup | null) => {
    // Reset selection when group changes
    setSelectedSessions([]);
    setIsSelectionMode(false);
    setCurrentPage(0); // Reset to first page
  };

  const handleSelectionChange = (sessionId: string, isSelected: boolean) => {
    setSelectedSessions(prev => 
      isSelected 
        ? [...prev, sessionId]
        : prev.filter(id => id !== sessionId)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = trainings
        .filter(t => t.id)
        .map(t => t.id as string);
      setSelectedSessions(allIds);
    } else {
      setSelectedSessions([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedSessions([]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Exiting selection mode - clear selections
      setSelectedSessions([]);
    }
  };

  const fetchTrainings = async () => {
    if (!user?.team_id) return;
    await loadTrainings();
    setIsAddTrainingOpen(false);
  };

  const handleModalClose = async () => {
    setIsAddTrainingOpen(false);
    if (user?.team_id) await loadAssignments();
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setIsPageChanging(true);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
      setIsPageChanging(true);
    }
  };

  // Action buttons
  const getActions = (): { label: string; onClick: () => void; icon?: any }[] => {
    const actions = [];
    
    if (isCommanderUser) {
      actions.push({ 
        label: "Add Training", 
        onClick: () => setIsAddTrainingOpen(true) 
      });
      
      actions.push({ 
        label: isSelectionMode ? "Cancel Selection" : "Bulk Select", 
        onClick: toggleSelectionMode
      });

      actions.push({
        label: "Manage Groups",
        onClick: () => setIsGroupManagementOpen(true),
        icon: Settings
      });
    }
    
    return actions;
  };

  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
        ]}
      />
      <SpPageHeader 
        title="Trainings" 
        subtitle="Add, edit, and manage training sessions" 
        icon={BiCurrentLocation} 
        action={getActions()} 
      />

      <SpPageBody>
        {/* Group Filter Cards */}
        <SessionGroupFilterCard 
          onGroupChange={handleGroupChange}
          onCreateClick={() => setIsGroupManagementOpen(true)}
        />

        {/* Bulk Actions Toolbar - Commanders Only */}
        {isCommanderUser && isSelectionMode && selectedSessions.length > 0 && (
          <SessionGroupBulkActionsBar
            selectedSessions={selectedSessions}
            onClearSelection={handleClearSelection}
            trainings={trainings}
          />
        )}

        {/* Training List */}
        {isLoading ? (
          <TrainingsListSkeleton count={5} />
        ) : (
          <TrainingListEnhanced 
            trainings={trainings}
            isSelectionMode={isSelectionMode && isCommanderUser}
            selectedSessions={selectedSessions}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
          />
        )}
        
        {/* Pagination - only show when not filtering by group */}
        {!selectedGroup && !isSelectionMode && (
          <SpPagination
            currentPage={currentPage}
            totalCount={totalCount}
            LIMIT={LIMIT}
            prevPageWithScroll={handlePrevPage}
            nextPageWithScroll={handleNextPage}
          />
        )}
      </SpPageBody>

      {/* Modals */}
      <TrainingAddTrainingSessionModal 
        isOpen={isAddTrainingOpen} 
        onClose={handleModalClose} 
        onSuccess={fetchTrainings} 
        assignments={assignments} 
      />

      {isCommanderUser && (
        <SessionGroupManagementModal
          isOpen={isGroupManagementOpen}
          onClose={() => setIsGroupManagementOpen(false)}
        />
      )}
    </SpPage>
  );
}