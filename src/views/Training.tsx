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
import { BiAddToQueue } from "react-icons/bi";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/ui/table";
import BaseDashboardCard from "@/components/BaseDashboardCard";

export default function TrainingPage() {
  const { id } = useParams();

  const { training, loadTrainingById, loadAssignments, createAssignment, assignments } = useStore(TrainingStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isAddScoreOpen, setIsOpen: setIsAddScoreOpen } = useModal();

  const { userRole } = useStore(userStore);

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
  }, [id, isLoading]);

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
    await createScoreAction(data);
    setIsAddScoreOpen(true);
  };

  const formattedDate = training?.date ? format(parseISO(training.date), "dd MMM yyyy") : "";

  /* ------------ ui ------------ */
  return (
    <div className="min-h-screen  text-gray-100">
      <Header title="Training">
        <span className="flex items-center rounded-full bg-indigo-500/20 py-1.5 px-3 text-xs font-medium text-indigo-300">{formattedDate}</span>
        <button onClick={() => setIsAddScoreOpen(true)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200">
          <BiAddToQueue className="text-indigo-400" />{" "}
        </button>
      </Header>

      <main className="mt-6 space-y-8 px-4 pb-10 md:px-6 2xl:px-10">
        {/* stats bar */}

        <div className="grid gap-6 xl:grid-cols-12">
          {/* distance accuracy – chart */}
          <div className="xl:col-span-8">
            <ScoreDistanceChart rows={scoreRanges as unknown as ScoreTarget[]} />
          </div>

          {/* per-distance breakdown – table */}
          <div className="xl:col-span-4">
            <ScoreDistanceTable rows={scoreRanges as unknown as ScoreTarget[]} />
          </div>

          <div className="xl:col-span-12">
            <BaseDashboardCard header="Scores">
              <div className="rounded-xl ">
                <Table className="w-full border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="border-b border-gray-700/50">
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Assignment
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Participant
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Squad
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Position
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Day/Night
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Target Eliminated
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Time to Shot
                      </TableCell>
                      <TableCell isHeader className="text-left py-4 px-6 text-sm font-semibold text-gray-300 bg-gray-800/30">
                        Date
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score: any) => (
                      <TableRow key={score.id} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors">
                        <TableCell className="py-4 px-6 text-sm text-gray-100">
                          {score.assignment_session?.assignment?.assignment_name || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100">
                          {score.score_participants?.[0]?.user
                            ? `${score.score_participants[0].user.first_name} ${score.score_participants[0].user.last_name}`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100">
                          {score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100 capitalize">{score.position || "N/A"}</TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100 capitalize">{score.day_night || "N/A"}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              score.target_eliminated ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {score.target_eliminated ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100">
                          {score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm text-gray-100">{format(parseISO(score.created_at), "dd MMM yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </BaseDashboardCard>
          </div>

          {/* commander-only status controls */}
          {isCommander(userRole) && (
            <div className="xl:col-span-12">
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
