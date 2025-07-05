import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { TrainingStatus } from "@/types/training";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import { supabase } from "@/services/supabaseClient";
import EditTrainingSessionModal from "@/components/EditTrainingSessionModal";
import { teamStore } from "@/store/teamStore";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import { useModal } from "@/hooks/useModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import Header from "@/Headers/Header";
import { format, parseISO } from "date-fns";
import ScoreDistanceChart from "@/components/ScoreDistanceChart";
import { ScoreTarget } from "@/types/score";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import { Plus, Calendar, Activity, Target, Loader2 } from "lucide-react";
import ScoreDetailsModal from "@/components/ScoreDetailsModal";
import BaseButton from "@/components/BaseButton";
import { isMobile } from "react-device-detect";
import { useTheme } from "@/contexts/ThemeContext";
import { BiCurrentLocation } from "react-icons/bi";
import TrainingStatusButtons from "@/components/TrainingStatusButtons";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import TrainingScoresTable from "@/components/TrainingScoresTable";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function TrainingPage() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { userRole } = useStore(userStore);
  const { training, loadTrainingById, loadAssignments, createAssignment, assignments } = useStore(TrainingStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isAddScoreOpen, setIsOpen: setIsAddScoreOpen, toggleIsOpen: toggleIsAddScoreOpen } = useModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false);
  const [newlyAddedScoreId, setNewlyAddedScoreId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"scores" | "analytics" | "status">("scores");
  const { setIsLoading, isLoading } = useStore(loaderStore);
  const { members } = useStore(teamStore);
  const {
    getScoresByTrainingId,
    scores,
    handleCreateScore: createScoreAction,
    getScoreRangesByTrainingId,
    scoreRanges,
    getScoreTargetsByScoreId,
    handlePatchScore,
  } = useStore(scoreStore);

  /* ------------ data loading ------------ */
  useEffect(() => {
    setIsLoading(true);
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
      await getScoresByTrainingId(id);
      await getScoreRangesByTrainingId(id);
      setIsLoading(false);
    };
    load();
  }, [id]);

  /* ------------ handlers ------------ */
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

  const handleEditSuccess = () => training?.id && loadTrainingById(training.id);

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

  const handleAddScore = async (data: any) => {
    if (editingScore?.id) {
      handleUpdateScore(data);
      return;
    }
    try {
      const newScore = await createScoreAction(data);
      setIsAddScoreOpen(false);
      if (newScore?.[0]?.id) {
        setNewlyAddedScoreId(newScore[0].id as string);
      }
      await getScoresByTrainingId(id as string);
    } catch (error) {
      console.error("Error adding score:", error);
    }
  };

  const handleScoreClick = (score: any) => {
    setSelectedScore(score);
    getScoreTargetsByScoreId(score.id);
    setIsScoreDetailsOpen(true);
  };

  const handleEditScore = (score: any) => {
    setEditingScore(score);
    getScoreTargetsByScoreId(score.id);
    setIsAddScoreOpen(true);
  };

  const handleUpdateScore = async (data: any) => {
    try {
      await handlePatchScore(data, editingScore.id);
      setIsAddScoreOpen(false);
      setEditingScore(null);
      await getScoresByTrainingId(id as string);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const formattedDate = training?.date ? format(parseISO(training.date), "dd MMM yyyy") : "";

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Header title="Training Session"> </Header>
      )}

      <main className="space-y-4 pb-10 md:space-y-4 px-4 md:px-6 py-4 2xl:px-6 w-full">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/"
                  className={`hover:text-purple-500 transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/trainings"
                  className={`hover:text-purple-500 transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  Trainings
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {training?.session_name || "Training Session"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Session Header Card */}

        <div className={`p-4 rounded-2xl transition-all duration-200`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <BiCurrentLocation className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{training?.session_name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <div className={`flex items-center gap-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  {training?.status && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs  ${
                        training.status === TrainingStatus.Scheduled
                          ? theme === "dark"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                          : training.status === TrainingStatus.InProgress
                            ? theme === "dark"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-yellow-100 text-yellow-700"
                            : theme === "dark"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Activity className="w-3 h-3" />
                      {training.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add Score Button */}
            <BaseButton
              type="button"
              disabled={training?.status === TrainingStatus.Completed}
              onClick={() => toggleIsAddScoreOpen()}
              style="purple"
              className={`flex mt-2 items-center gap-2 font-medium transition-all duration-200 ${
                isMobile ? "w-full justify-center rounded-xl px-4 py-3 text-sm " : "px-4 py-2.5 rounded-lg text-sm hover:shadow-lg"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Plus size={16} />
              <span>Add Score</span>
            </BaseButton>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
          <nav className={`flex space-x-8 ${isMobile ? "justify-center" : "justify-start"} items-center`} aria-label="Tabs">
            {[
              { id: "scores", label: "Scores", icon: Target },
              { id: "analytics", label: "Analytics", icon: Activity },
              { id: "status", label: "Status", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "scores" | "analytics" | "status")}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "border-purple-400 text-purple-400"
                        : "border-purple-500 text-purple-600"
                      : theme === "dark"
                        ? "border-transparent text-gray-400 hover:text-gray-300"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "scores" && (
            <div className="space-y-4 w-full">
              {/* Scores Grid */}
              <TrainingScoresTable
                scores={scores}
                onScoreClick={handleScoreClick}
                onEditClick={handleEditScore}
                newlyAddedScoreId={newlyAddedScoreId}
              />

              {/* Empty State */}
              {scores.length === 0 && (
                <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No scores yet</h3>
                  <p className="text-sm">Add your first score to get started</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {/* Chart */}
                <div className="lg:col-span-2">
                  <ScoreDistanceChart rows={scoreRanges as unknown as ScoreTarget[]} />
                </div>

                {/* Analytics placeholder */}
                <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Performance Analytics</h3>
                  <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Analytics dashboard coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <div className="space-y-6">
              {/* Status Controls */}
              {isCommander(userRole) && (
                <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Training Status Management</h3>
                  <TrainingStatusButtons currentStatus={training?.status as TrainingStatus} onStatusChange={handleStatusChange} />
                </div>
              )}

              {/* Status Information */}
              <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Session Information</h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Current Status</label>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                        training?.status === TrainingStatus.Scheduled
                          ? theme === "dark"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                          : training?.status === TrainingStatus.InProgress
                            ? theme === "dark"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-yellow-100 text-yellow-700"
                            : theme === "dark"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {training?.status}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Participants</label>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {training?.participants?.length || 0} registered
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Total Scores</label>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{scores.length} recorded</span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Assignments</label>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {training?.assignments?.length || 0} assigned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* modals */}
        <EditTrainingSessionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          teamMembers={members}
          assignments={assignments}
          training={training}
        />

        <ConfirmStatusChangeModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmStatusChange}
          newStatus={pendingStatus as TrainingStatus}
        />

        <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
        <TrainingPageScoreFormModal
          trainingId={training?.id as string}
          editingScore={editingScore}
          isOpen={isAddScoreOpen}
          onClose={() => {
            setIsAddScoreOpen(false);
            setEditingScore(null);
          }}
          onSubmit={handleAddScore}
          assignmentSessions={assignments}
        />

        <ScoreDetailsModal isOpen={isScoreDetailsOpen} setIsOpen={setIsScoreDetailsOpen} score={selectedScore} />
      </main>
    </div>
  );
}
