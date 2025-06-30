import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import { supabase } from "@/services/supabaseClient";
import EditTrainingSessionModal from "@/components/EditTrainingSessionModal";
import { teamStore } from "@/store/teamStore";
import TrainingPageChangeStatus from "@/components/TrainingPageChangeStatus";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import { useModal } from "@/hooks/useModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import Header from "@/Headers/Header";
import { format, parseISO } from "date-fns";
import ScoreDistanceChart from "@/components/ScoreDistanceChart";
import ScoreDistanceTable from "@/components/ScoreDistnaceTable";
import { ScoreTarget } from "@/types/score";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/ui/table";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function TrainingPage() {
  const { id } = useParams();

  const { training, loadTrainingById, loadAssignments, createAssignment, assignments } = useStore(TrainingStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isAddScoreOpen, setIsOpen: setIsAddScoreOpen, toggleIsOpen: toggleIsAddScoreOpen } = useModal();

  const { userRole, user } = useStore(userStore);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { members } = useStore(teamStore);
  const { getScoresByTrainingId, scores, handleCreateScore: createScoreAction } = useStore(scoreStore);
  const { getScoreRangesByTrainingId, scoreRanges } = useStore(scoreStore);

  /* ------------ data loading ------------ */
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
      await getScoresByTrainingId(id);
      await getScoreRangesByTrainingId(id);
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
    try {
      await createScoreAction(data);
      setIsAddScoreOpen(false);
    } catch (error) {
      console.error("Error adding score:", error);
    }
  };

  const formattedDate = training?.date ? format(parseISO(training.date), "dd MMM yyyy") : "";

  /* ------------ ui ------------ */
  return (
    <div className="min-h-screen w-full  text-gray-100">
      <Header title="Training">
        <span className="flex items-center rounded-full bg-indigo-500/20 py-1.5 px-3 text-sm font-medium text-indigo-300">{formattedDate}</span>
      </Header>

      <main className="mt-6 space-y-4 px-4 pb-10 md:space-y-4 md:px-6 2xl:px-10 w-full">
        <div className="flex items-center justify-end w-full mb-4">
          {/* stats bar */}
          <button
            onClick={() => toggleIsAddScoreOpen()}
            className="px-4 py-1.s5  flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
          >
            <span className="text-xs font-medium">Add Score</span>
            <Plus size={12} />
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
          {/* distance accuracy – chart */}
          <div className="col-span-1 lg:col-span-8">
            <ScoreDistanceChart rows={scoreRanges as unknown as ScoreTarget[]} />
          </div>

          {/* per-distance breakdown – table */}
          <div className="col-span-1 lg:col-span-4">
            <ScoreDistanceTable rows={scoreRanges as unknown as ScoreTarget[]} />
          </div>

          <div className="col-span-1 lg:col-span-12">
            <BaseDashboardCard header="Scores" withBtn>
              <div className="rounded-xl overflow-x-auto">
                <Table className="w-full min-w-[800px] border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="border-b border-white/10 text-xs font-medium uppercase tracking-wider text-gray-400">
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Assignment
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Participant
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Squad
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Position
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Day/Night
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Target Eliminated
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Time to Shot
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-left py-3 sm:text-sm md:text-base  px-3 md:py-4 md:px-6   font-semibold text-gray-300  whitespace-nowrap"
                      >
                        Date
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score: any) => (
                      <TableRow key={score.id} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors">
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                          <div className="max-w-[120px] md:max-w-none truncate">{score.assignment_session?.assignment?.assignment_name || "N/A"}</div>
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                          <div className="max-w-[100px] md:max-w-none truncate">
                            {score.score_participants?.[0]?.user
                              ? `${score.score_participants[0].user.first_name} ${score.score_participants[0].user.last_name}`
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                          <div className="max-w-[80px] md:max-w-none truncate">{score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}</div>
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 capitalize whitespace-nowrap">
                          {score.position || "N/A"}
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 capitalize whitespace-nowrap">
                          {score.day_night || "N/A"}
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                              score.target_eliminated ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {score.target_eliminated ? "Yes" : <Badge variant="secondary">No</Badge>}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                          {score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}
                        </TableCell>
                        <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                          {format(parseISO(score.created_at), "dd MMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </BaseDashboardCard>
          </div>

          {/* commander-only status controls */}
          {isCommander(userRole) && (
            <div className="col-span-1 lg:col-span-12">
              <TrainingPageChangeStatus training={training as TrainingSession} onStatusChange={handleStatusChange} />
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
          editingScore={null}
          isOpen={isAddScoreOpen}
          onClose={() => setIsAddScoreOpen(false)}
          onSubmit={handleAddScore}
          assignmentSessions={assignments}
        />
      </main>
    </div>
  );
}
