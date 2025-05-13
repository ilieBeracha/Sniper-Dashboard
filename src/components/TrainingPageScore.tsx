import BaseDashboardCard from "./BaseDashboardCard";
import ScoreFormModal from "./TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";
import { Edit2Icon, Plus, Users, Moon, Sun, Clock, Target, ChevronDown, ChevronUp } from "lucide-react";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";

import { Score } from "@/types/score";
import ScoreParticipantsDisplay from "./TrainingPageScoreParticipantsDisplay";
import { TrainingStore } from "@/store/trainingStore";
import { loaderStore } from "@/store/loaderStore";
import { LoadingSpinner, Button } from "./common";

export default function TrainingPageScore() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSquads, setExpandedSquads] = useState<any>({});
  const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({});
  const [filterCondition, setFilterCondition] = useState("all");
  const { scores, createScore } = useStore(scoreStore);
  const { user } = useStore(userStore);
  const { training } = useStore(TrainingStore);
  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { getScoresByTrainingId } = useStore(scoreStore);

  const getSquadNameFromScore = (score: Score): string => {
    const participantWithSquad = score.score_participants?.find((participant: any) => participant.user?.squad?.squad_name);

    if (participantWithSquad) {
      return participantWithSquad.user.squad.squad_name;
    }
    return "Unknown Squad";
  };

  useEffect(() => {
    if (scores.length > 0) {
      const initialExpandState: { [key: string]: boolean } = {};
      scores.forEach((score) => {
        const squadName = getSquadNameFromScore(score);
        initialExpandState[squadName] = true;
      });
      setExpandedSquads(initialExpandState);
    }
  }, [scores]);

  const toggleScoreExpansion = (scoreId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedScores((prev) => ({
      ...prev,
      [scoreId]: !prev[scoreId],
    }));
  };

  const submitScore = async (formValues: any) => {
    try {
      formValues.creator_id = user?.id;
      formValues.squad_id = user?.squad_id;
      await createScore(formValues);
      setIsModalOpen(false);
      setIsLoading(true);
      await getScoresByTrainingId(training?.id || "");
    } catch (error) {
      console.error("Error submitting score:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scoresBySquad = scores.reduce((acc: any, score: Score) => {
    const squadName = getSquadNameFromScore(score);
    if (!acc[squadName]) acc[squadName] = [];
    acc[squadName].push(score);
    return acc;
  }, {});

  const toggleSquadExpansion = (squadName: any) => {
    setExpandedSquads((prev: any) => ({
      ...prev,
      [squadName]: !prev[squadName],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredScoresBySquad = Object.entries(scoresBySquad).reduce((acc: any, [squadName, squadScores]: [string, Score[] | unknown]) => {
    if (filterCondition === "all") {
      acc[squadName] = squadScores;
    } else {
      if (!squadScores || !Array.isArray(squadScores)) return acc;
      acc[squadName] = squadScores.filter((score: Score) => score && typeof score.day_night === "string" && score.day_night === filterCondition);
    }
    return acc;
  }, {});

  return (
    <BaseDashboardCard header="Training Score Dashboard" tooltipContent="Performance overview across all squads">
      <div className="relative">
        {isLoading && <LoadingSpinner text="Updating scores..." />}

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-zinc-400">Showing scores for all participating squads</div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-4 mb-6">
          <Button onClick={() => setIsModalOpen(true)} disabled={isLoading} leftIcon={<Plus size={16} />}>
            Record Score
          </Button>
          <div className="flex items-center space-x-3 w-full">
            <span className="text-sm text-zinc-400">Filter:</span>
            <div className="flex bg-[#1A1A1A] rounded-md overflow-hidden border border-[#2A2A2A] flex-1">
              <button
                className={`px-3 py-1.5 text-xs font-medium transition-colors flex-1 ${
                  filterCondition === "all" ? " text-white" : "text-zinc-400 hover:bg-[#7F5AF0]/10"
                }`}
                onClick={() => setFilterCondition("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-medium transition-colors flex-1 ${
                  filterCondition === "day" ? " text-white" : "text-zinc-400 hover:bg-gray-400/10"
                }`}
                onClick={() => setFilterCondition("day")}
              >
                <Sun size={12} className="inline mr-1 text-amber-400" />
                Day
              </button>
              <button
                className={`px-3 py-1.5 text-xs font-medium transition-colors flex-1 ${
                  filterCondition === "night" ? " text-white" : "text-zinc-400 hover:bg-gray-400/10"
                }`}
                onClick={() => setFilterCondition("night")}
              >
                <Moon size={12} className="inline mr-1 text-zinc-300" />
                Night
              </button>
            </div>
          </div>
        </div>

        {/* Scores by squad */}
        <div className="space-y-4">
          {Object.entries(filteredScoresBySquad).length > 0 ? (
            Object.entries(filteredScoresBySquad).map(([squadName, squadScores]: any[]) => (
              <div key={squadName} className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden">
                <div
                  className="flex justify-between items-center px-4 py-6 bg-zinc-800 cursor-pointer"
                  onClick={() => toggleSquadExpansion(squadName)}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-zinc-400 mr-2" />
                    <h3 className="text-md font-medium text-white">{squadName}</h3>
                    <span className="ml-2 text-sm bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                      {squadScores.length as any} {squadScores.length === 1 ? "record" : "records"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {expandedSquads[squadName] ? (
                      <ChevronUp size={16} className="text-zinc-400" />
                    ) : (
                      <ChevronDown size={16} className="text-zinc-400" />
                    )}
                  </div>
                </div>

                {expandedSquads[squadName] && (
                  <div className="divide-y divide-zinc-700/50">
                    <div className="grid grid-cols-4 px-4 py-2 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                      <div>Assignment</div>
                      <div>Conditions</div>
                      <div>Date & Time</div>
                      <div className="text-right">Actions</div>
                    </div>

                    {squadScores.map((score: Score) => (
                      <div key={score.id} className="divide-y divide-zinc-700/20">
                        <div className="grid grid-cols-4 px-4 py-3 hover:bg-zinc-700/20 transition-colors relative">
                          <div className="text-sm text-zinc-300 font-medium">{score.assignment_session?.assignment?.assignment_name}</div>
                          <div className="text-sm flex items-center text-zinc-400">
                            {score.day_night === "day" ? (
                              <>
                                <Sun size={14} className="mr-1.5 text-amber-400" />
                                <span>Day</span>
                              </>
                            ) : score.day_night === "night" ? (
                              <>
                                <Moon size={14} className="mr-1.5 text-zinc-300" />
                                <span>Night</span>
                              </>
                            ) : (
                              "Not specified"
                            )}
                          </div>
                          <div className="text-sm text-zinc-400 flex items-center">
                            <Clock size={14} className="mr-1.5 text-zinc-500" />
                            {formatDate(score.created_at || "")}
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            {score.score_participants && score.score_participants.length > 0 && (
                              <button
                                onClick={(e) => toggleScoreExpansion(score.id || "", e)}
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                              >
                                <Users size={14} />
                                <span className="text-xs font-medium">
                                  {score.score_participants.length}
                                  {expandedScores[score.id || ""] ? (
                                    <ChevronUp size={14} className="ml-1 inline" />
                                  ) : (
                                    <ChevronDown size={14} className="ml-1 inline" />
                                  )}
                                </span>
                              </button>
                            )}
                            {((user?.squad_id === score.squad_id && user.id === score.creator_id) || isCommander(user?.user_role || null)) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 rounded-full hover:bg-zinc-700 text-zinc-400 
                                                                hover:text-white transition"
                                title="Edit score"
                              >
                                <Edit2Icon size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Participant details section */}
                        {expandedScores[score.id || ""] && score.score_participants && (
                          <div className="py-3 px-4 bg-zinc-800/30">
                            <ScoreParticipantsDisplay participants={score.score_participants} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <Target className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 mb-1">No scores match the current filter</p>
              <p className="text-zinc-500 text-sm">
                {filterCondition !== "all" ? "Try changing your filter selection" : "Record your first score to get started"}
              </p>
            </div>
          )}
        </div>

        <ScoreFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(formValues) => submitScore(formValues)}
          assignmentSessions={training?.assignment_sessions || []}
        />
      </div>
    </BaseDashboardCard>
  );
}
