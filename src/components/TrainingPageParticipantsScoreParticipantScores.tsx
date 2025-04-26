import { useState } from "react";
import { Trophy, Edit, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { TrainingPageParticipantsScoreInput } from "./TrainingPageParticipantsScoreInput";
import { TrainingPageParticipantsScoreSelect } from "./TrainingPageParticipantsScoreSelect";
import { ScorePosition, TrainingPageParticipantsScoreParticipantScoresProps } from "@/types/training";

export function TrainingPageParticipantsScoreParticipantScores({
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
  training,
}: TrainingPageParticipantsScoreParticipantScoresProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTrainingLocked = training?.status === "completed" || training?.status === "canceled";

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
          {isParticipant && isCurrentUser && !isEditing && !isTrainingLocked && (
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
          {isTrainingLocked && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-md">
              <p className="text-sm text-yellow-400">This training is {training?.status}. Scores cannot be modified.</p>
            </div>
          )}
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
                {!isTrainingLocked && <th className="py-2 px-4 text-right text-sm font-medium text-gray-400">Actions</th>}
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
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreInput
                          value={scoreData.shots_fired}
                          onChange={(value) => setScoreData({ ...scoreData, shots_fired: value })}
                          placeholder="Shots"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.shots_fired ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreInput
                          value={scoreData.hits}
                          onChange={(value) => setScoreData({ ...scoreData, hits: value })}
                          placeholder="Hits"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.hits ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreInput
                          value={scoreData.time_until_first_shot}
                          onChange={(value) => setScoreData({ ...scoreData, time_until_first_shot: value })}
                          placeholder="Time"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.time_until_first_shot ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreInput
                          value={scoreData.distance}
                          onChange={(value) => setScoreData({ ...scoreData, distance: value })}
                          placeholder="Dist."
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.distance ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreSelect
                          value={scoreData.position}
                          onChange={(value: string) => setScoreData({ ...scoreData, position: value })}
                          options={Object.values(ScorePosition)}
                          className="w-24"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">{participantScore?.position ?? "—"}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isEditingThisAssignment && !isTrainingLocked ? (
                        <TrainingPageParticipantsScoreSelect
                          value={scoreData.day_night}
                          onChange={(value: string) => setScoreData({ ...scoreData, day_night: value })}
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
                    {!isTrainingLocked && (
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
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
