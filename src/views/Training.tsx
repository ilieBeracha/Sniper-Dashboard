import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import FilterDrawer from "@/components/FilterDrawer";
import AssignmentStackView from "@/components/AssignmentStackView";
import { Filter } from "lucide-react";

export default function TrainingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);
  const { sessionStats, getSessionStatsByTrainingId, deleteSessionStats, setFilters } = useStore(sessionStore);
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
  const { theme } = useTheme();

  // Filters
  const [filterDay, setFilterDay] = useState<string>("all");

  const [filterEffort, setFilterEffort] = useState<string>("all");
  const [filterDistance, setFilterDistance] = useState<string>("all");
  const [filterParticipated, setFilterParticipated] = useState<boolean>(false);

  // Sort order
  const [sortOrder, setSortOrder] = useState<string>("recent");

  // Filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<"grid" | "stack">(() => {
    const savedMode = localStorage.getItem("sessionViewMode");
    return savedMode === "stack" ? "stack" : "grid";
  });

  // Auto-load stack view preference
  const [autoLoadStackView, setAutoLoadStackView] = useState(() => {
    const saved = localStorage.getItem("autoLoadStackView");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sessionViewMode", viewMode);
    setViewMode(viewMode);
  }, [viewMode]);

  // Update filters in store when they change
  useEffect(() => {
    setFilters({
      dayNight: filterDay,
      effort: filterEffort,
      distance: filterDistance,
      participated: filterParticipated,
    });
  }, [filterDay, filterEffort, filterDistance, filterParticipated, setFilters]);

  useEffect(() => {
    if (id && hasLoadedData.current) {
      getSessionStatsByTrainingId(id, 20, 0);
    }
  }, [filterDay, filterEffort, filterDistance, filterParticipated, id]);

  useEffect(() => {
    localStorage.setItem("autoLoadStackView", autoLoadStackView.toString());
  }, [autoLoadStackView]);

  // Check if any filters are active
  const hasActiveFilters = filterDay !== "all" || filterEffort !== "all" || filterDistance !== "all" || filterParticipated || sortOrder !== "recent";

  // Disable stack view when filters are active (if auto-load is enabled)
  useEffect(() => {
    if (hasActiveFilters && autoLoadStackView && viewMode === "stack") {
      setViewMode("grid");
    }
  }, [hasActiveFilters, autoLoadStackView, viewMode]);

  // Client-side filtering only for distance (complex query)
  const filteredSessionStats = Array.isArray(sessionStats)
    ? sessionStats.filter((s) => {
        // Distance filtering (still done client-side due to complexity)
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
        return true;
      })
    : [];

  const sortedSessionStats = [...filteredSessionStats].sort((a, b) => {
    // 1. Most recent
    if (sortOrder === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    // 2. Best sessions – high-to-low overall hit percentage, then effort flag, then max distance.
    if (sortOrder === "best") {
      const aPct = a.overall_hit_percentage ?? 0;
      const bPct = b.overall_hit_percentage ?? 0;
      if (aPct !== bPct) {
        return bPct - aPct; // highest percentage first
      }

      // Tie-breaker 1 – effort sessions first
      if (a.effort !== b.effort) {
        return a.effort === true ? -1 : 1;
      }

      // Tie-breaker 2 – longer distance first
      const aDistances = (a.target_stats || []).map((t: any) => t.distance_m).filter(Boolean);
      const bDistances = (b.target_stats || []).map((t: any) => t.distance_m).filter(Boolean);
      const aMax = aDistances.length ? Math.max(...aDistances) : 0;
      const bMax = bDistances.length ? Math.max(...bDistances) : 0;
      return bMax - aMax;
    }

    return 0;
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

          <TrainingSessionStatsCard trainingSessionId={id!} />

          {/* Filter Button and View Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium opacity-80">Sessions</h3>
              {(filterDay !== "all" || filterEffort !== "all" || filterDistance !== "all" || filterParticipated || sortOrder !== "recent") && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-zinc-700/50 text-zinc-300" : "bg-gray-200 text-gray-700"}`}
                >
                  {
                    [
                      filterDay !== "all" && 1,
                      filterEffort !== "all" && 1,
                      filterDistance !== "all" && 1,
                      filterParticipated && 1,
                      sortOrder !== "recent" && 1,
                    ].filter(Boolean).length
                  }{" "}
                  active
                </span>
              )}
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === "dark"
                  ? "bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 hover:border-zinc-600"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>

          {/* Old Filters Section removed - hidden but kept for reference */}
          {false && (
            <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"}`}>
              <h3 className="text-sm font-medium mb-3 opacity-80">Filters</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <Select value={filterDay} onValueChange={(v) => setFilterDay(v)}>
                    <SelectTrigger
                      className={`min-w-[120px] ${theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                      <span className="text-xs opacity-70">Day/Night</span>
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                      <SelectItem value="all" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        All
                      </SelectItem>
                      <SelectItem value="day" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        Day
                      </SelectItem>
                      <SelectItem value="night" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        Night
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Select value={filterEffort} onValueChange={(v) => setFilterEffort(v)}>
                    <SelectTrigger
                      className={`min-w-[120px] ${theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                      <span className="text-xs opacity-70">Effort</span>
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                      <SelectItem value="all" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        All
                      </SelectItem>
                      <SelectItem value="true" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        Yes
                      </SelectItem>
                      <SelectItem value="false" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Select value={filterDistance} onValueChange={(v) => setFilterDistance(v)}>
                    <SelectTrigger
                      className={`min-w-[140px] ${theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                      <span className="text-xs opacity-70">Distance (m)</span>
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                      <SelectItem value="all" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        All
                      </SelectItem>
                      <SelectItem value="0-300" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        0-300m
                      </SelectItem>
                      <SelectItem value="300-600" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        300-600m
                      </SelectItem>
                      <SelectItem value="600-900" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        600-900m
                      </SelectItem>
                      <SelectItem value="900+" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                        900m+
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <label
                  className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    filterParticipated
                      ? theme === "dark"
                        ? "bg-zinc-700/50 border border-zinc-600"
                        : "bg-gray-200 border border-gray-300"
                      : theme === "dark"
                        ? "bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterParticipated}
                    onChange={(e) => setFilterParticipated(e.target.checked)}
                    className="accent-blue-500"
                  />
                  <span className="text-xs">My sessions</span>
                </label>
              </div>

              {/* Active Filters Summary */}
              {(filterDay !== "all" || filterEffort !== "all" || filterDistance !== "all" || filterParticipated) && (
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-60">Active filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {filterDay !== "all" && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-blue-600/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                        >
                          {filterDay}
                        </span>
                      )}
                      {filterEffort !== "all" && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-green-600/20 text-green-300" : "bg-green-100 text-green-700"}`}
                        >
                          Effort: {filterEffort === "true" ? "Yes" : "No"}
                        </span>
                      )}
                      {filterDistance !== "all" && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark" ? "bg-purple-600/20 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                        >
                          {filterDistance}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sort Order Section - also hidden */}
          {false && (
            <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium opacity-80">Sort By</h3>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v)}>
                  <SelectTrigger
                    className={`min-w-[160px] ${theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                  >
                    <span className="text-xs">{sortOrder === "recent" ? "Most Recent" : "Best Sessions"}</span>
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
                    <SelectItem value="recent" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                      Most Recent
                    </SelectItem>
                    <SelectItem value="best" className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : ""}>
                      Best Sessions
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sortOrder === "best" && <p className="text-xs opacity-60 mt-2">Sorted by effort and maximum target distance</p>}
            </div>
          )}

          {/* Conditional view rendering */}
          {viewMode === "grid" ? (
            <SessionStatsCardGrid
              data={sortedSessionStats}
              onCardClick={handleSessionClick}
              onEdit={handleEditSession}
              onDelete={handleDeleteSession}
            />
          ) : (
            <AssignmentStackView
              data={sortedSessionStats}
              onCardClick={handleSessionClick}
              onEdit={handleEditSession}
              onDelete={handleDeleteSession}
            />
          )}
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
                navigate(`/training/${id}/session-stats-full/`);
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={{
          filterDay,
          filterEffort,
          filterDistance,
          filterParticipated,
          sortOrder,
        }}
        onFiltersChange={(newFilters) => {
          setFilterDay(newFilters.filterDay);
          setFilterEffort(newFilters.filterEffort);
          setFilterDistance(newFilters.filterDistance);
          setFilterParticipated(newFilters.filterParticipated);
          setSortOrder(newFilters.sortOrder);
        }}
        onApply={() => {
          setIsFilterDrawerOpen(false);
        }}
        onClear={() => {}}
        autoLoadStackView={autoLoadStackView}
        onAutoLoadChange={(value) => setAutoLoadStackView(value)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </SpPage>
  );
}
