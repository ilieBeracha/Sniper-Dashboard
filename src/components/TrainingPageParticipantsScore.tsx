import BaseDashboardCard from "./BaseDashboardCard";
import { ScorePosition, TrainingSession } from "@/types/training";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Trophy, Save, X, Edit, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { useState, useEffect } from "react";
import { TrainingPageParticipantsScoreParticipantScores } from "./TrainingPageParticipantsScoreParticipantScores";
import { TrainingPageParticipantsScoreData } from "@/types/training";
type TrainingPageParticipantsScoreProps = {
  training: TrainingSession | null;
};

interface ScoreData {
  shots_fired: number | null;
  hits: number | null;
  time_until_first_shot: number | null;
  distance: number | null;
  target_hit: number | null;
  position: string;
  day_night: string;
}

interface ScoreInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  className?: string;
}

const ScoreInput = ({ value, onChange, placeholder, className = "" }: ScoreInputProps) => (
  <input
    type="number"
    min="0"
    value={value === null ? "" : value}
    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
    className={`w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-center text-white ${className}`}
    placeholder={placeholder}
  />
);

interface ScoreSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

const ScoreSelect = ({ value, onChange, options, className = "" }: ScoreSelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-2 py-1 bg-white/10 border border-white/20 rounded text-center text-white ${className}`}
  >
    {options.map((option) => (
      <option key={option} value={option} className="bg-gray-800 text-white">
        {option}
      </option>
    ))}
  </select>
);

interface ParticipantScoresProps {
  participant: any;
  assignments: any[];
  participantScores: Record<string, Record<string, any>>;
  isCurrentUser: boolean;
  isParticipant: boolean;
  onEditScore: (participantId: string, assignmentId: string) => void;
  onSaveScore: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  editingParticipantId: string | null;
  editingAssignmentId: string | null;
  scoreData: ScoreData;
  setScoreData: (data: ScoreData) => void;
  isSubmitting: boolean;
}

const ParticipantScores = ({
  participant,
  assignments,
  participantScores,
  isCurrentUser,
  isParticipant,
  onEditScore,
  onSaveScore,
  onCancelEdit,
  isEditing,
  editingParticipantId,
  editingAssignmentId,
  scoreData,
  setScoreData,
  isSubmitting,
}: ParticipantScoresProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-white/5">
      <div className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-white/5" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center ring-2 ring-indigo-500/20">
            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white">
                {participant.user?.first_name} {participant.user?.last_name}
              </h3>
              {isParticipant && isCurrentUser && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 text-indigo-300 rounded-full">
                  You
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{participant.user?.user_role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isParticipant && isCurrentUser && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditScore(participant.participant_id, assignments[0].id);
              }}
              className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all duration-300 hover:scale-105 active:scale-95"
              title="Add score"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-400">Assignment</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Shots</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Hits</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Time (s)</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Distance (m)</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Position</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-400">Lighting</th>
                <th className="py-2 px-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assignments.map((assignment) => {
                const participantScore = participantScores[assignment.id]?.[participant.participant_id];
                const isEditingThisAssignment =
                  isEditing && editingParticipantId === participant.participant_id && editingAssignmentId === assignment.id;

                return (
                  <tr key={assignment.id} className="hover:bg-white/5">
                    <td className="py-2 px-4">
                      <span className="text-sm font-medium text-gray-300">{assignment.assignment_name}</span>
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreInput
                          value={scoreData.shots_fired}
                          onChange={(value) => setScoreData({ ...scoreData, shots_fired: value })}
                          placeholder="Shots"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.shots_fired ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreInput value={scoreData.hits} onChange={(value) => setScoreData({ ...scoreData, hits: value })} placeholder="Hits" />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.hits ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreInput
                          value={scoreData.time_until_first_shot}
                          onChange={(value) => setScoreData({ ...scoreData, time_until_first_shot: value })}
                          placeholder="Time"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.time_until_first_shot ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreInput
                          value={scoreData.distance}
                          onChange={(value) => setScoreData({ ...scoreData, distance: value })}
                          placeholder="Dist."
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.distance ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreSelect
                          value={scoreData.position}
                          onChange={(value) => setScoreData({ ...scoreData, position: value.toString() })}
                          options={Object.values(ScorePosition)}
                          className="w-24"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.position ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment ? (
                        <ScoreSelect
                          value={scoreData.day_night}
                          onChange={(value) => setScoreData({ ...scoreData, day_night: value })}
                          options={["day", "night"]}
                          className="w-20"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">
                          {participantScore?.day_night
                            ? participantScore.day_night.charAt(0).toUpperCase() + participantScore.day_night.slice(1)
                            : "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-end">
                        {isEditingThisAssignment && (
                          <div className="flex space-x-2">
                            <button
                              onClick={onCancelEdit}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 hover:scale-105 active:scale-95"
                              title="Cancel"
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={onSaveScore}
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all duration-300 hover:scale-105 active:scale-95"
                              title="Save score"
                              disabled={isSubmitting}
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function TrainingPageParticipantsScore({ training }: TrainingPageParticipantsScoreProps) {
  const { user } = useStore(userStore);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<TrainingPageParticipantsScoreData>({
    shots_fired: null,
    hits: null,
    time_until_first_shot: null,
    distance: null,
    target_hit: null,
    position: "Standing",
    day_night: "day",
  });
  const [participantScores, setParticipantScores] = useState<Record<string, Record<string, any>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userParticipation = training?.participants?.find((participant) => participant.participant_id === user?.id);
  const isParticipant = !!userParticipation;

  useEffect(() => {
    if (!training?.id) return;

    const loadScores = async () => {
      setLoading(true);
      try {
        const assignments = training.assignments_trainings?.map((at) => at.assignment) || [];
        const allScores: Record<string, Record<string, any>> = {};

        for (const assignment of assignments) {
          const { data, error } = await supabase
            .from("scores")
            .select(
              `
              id, 
              shots_fired, 
              hits, 
              time_until_first_shot, 
              distance, 
              target_hit, 
              position,
              day_night,
              score_participants(
                user_id
              )
            `
            )
            .eq("assignment_id", assignment.id);

          if (error) throw error;

          const scoreMap: Record<string, any> = {};
          data?.forEach((score) => {
            const participant = score.score_participants?.find((p: any) => p.user_id);
            if (participant) {
              scoreMap[participant.user_id] = score;
            }
          });

          allScores[assignment.id] = scoreMap;
        }

        setParticipantScores(allScores);
      } catch (error) {
        console.error("Error loading scores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, [training?.id]);

  const handleEditScore = (participantId: string, assignmentId: string) => {
    if (participantId !== user?.id) return;

    const existingScore = participantScores[assignmentId]?.[participantId];

    setEditingParticipantId(participantId);
    setEditingAssignmentId(assignmentId);

    if (existingScore) {
      setScoreData({
        shots_fired: existingScore.shots_fired,
        hits: existingScore.hits,
        time_until_first_shot: existingScore.time_until_first_shot,
        distance: existingScore.distance,
        target_hit: existingScore.target_hit,
        position: existingScore.position || "Standing",
        day_night: existingScore.day_night || "day",
      });
    } else {
      setScoreData({
        shots_fired: null,
        hits: null,
        time_until_first_shot: null,
        distance: null,
        target_hit: null,
        position: "Standing",
        day_night: "day",
      });
    }
  };

  const handleSaveScore = async () => {
    if (!training?.id || !user?.id || !isParticipant || !editingAssignmentId) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (scoreData.shots_fired === null || scoreData.shots_fired < 0) {
        setSubmitError("Shots fired must be a positive number");
        return;
      }

      if (scoreData.hits === null || scoreData.hits < 0) {
        setSubmitError("Hits must be a positive number");
        return;
      }

      if (scoreData.hits > scoreData.shots_fired) {
        setSubmitError("Hits cannot exceed shots fired");
        return;
      }

      const existingScore = participantScores[editingAssignmentId]?.[user.id];

      let scoreId: string;

      if (existingScore) {
        const { data: updatedScore, error: updateError } = await supabase
          .from("scores")
          .update({
            shots_fired: scoreData.shots_fired,
            hits: scoreData.hits,
            time_until_first_shot: scoreData.time_until_first_shot,
            distance: scoreData.distance,
            target_hit: scoreData.target_hit,
            position: scoreData.position,
            day_night: scoreData.day_night,
          })
          .eq("id", existingScore.id)
          .select()
          .single();

        if (updateError) throw updateError;
        scoreId = existingScore.id;
      } else {
        const { data: newScore, error: insertError } = await supabase
          .from("scores")
          .insert({
            assignment_id: editingAssignmentId,
            shots_fired: scoreData.shots_fired,
            hits: scoreData.hits,
            time_until_first_shot: scoreData.time_until_first_shot,
            distance: scoreData.distance,
            target_hit: scoreData.target_hit,
            position: scoreData.position,
            day_night: scoreData.day_night,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newScore) {
          const { error: participantError } = await supabase.from("score_participants").insert({
            score_id: newScore.id,
            user_id: user.id,
            role: "shooter",
          });

          if (participantError) throw participantError;
          scoreId = newScore.id;
        }
      }

      setParticipantScores((prev) => ({
        ...prev,
        [editingAssignmentId]: {
          ...prev[editingAssignmentId],
          [user.id]: {
            id: scoreId,
            ...scoreData,
          },
        },
      }));

      setEditingParticipantId(null);
      setEditingAssignmentId(null);
    } catch (error) {
      console.error("Error saving score:", error);
      setSubmitError("Failed to save score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingParticipantId(null);
    setEditingAssignmentId(null);
    setSubmitError(null);
  };

  const assignments = training?.assignments_trainings?.map((at) => at.assignment) || [];

  return (
    <BaseDashboardCard title="Training Performance" tooltipContent="Track and manage participant performance scores">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {training?.participants?.map((participant) => (
            <TrainingPageParticipantsScoreParticipantScores
              key={participant.id}
              participant={participant}
              assignments={assignments}
              participantScores={participantScores}
              isCurrentUser={participant.participant_id === user?.id}
              isParticipant={isParticipant}
              onEditScore={handleEditScore}
              onSaveScore={handleSaveScore}
              onCancelEdit={handleCancelEdit}
              isEditing={editingParticipantId === participant.participant_id}
              editingParticipantId={editingParticipantId}
              editingAssignmentId={editingAssignmentId}
              scoreData={scoreData}
              setScoreData={setScoreData}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {submitError && (
        <div className="mt-4 bg-red-500/20 border border-red-500/40 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="text-sm text-red-400">{submitError}</span>
        </div>
      )}

      {!loading && training?.participants && training.participants.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No participants have been added to this training session.</p>
        </div>
      )}
    </BaseDashboardCard>
  );
}
