import { useState } from "react";
import { Target } from "lucide-react";

interface EngagementsStepProps {
  targets: any[];
  participants: any[];
  updateEngagement: (targetIndex: number, engagementIndex: number, field: any, value: any) => void;
}

export default function EngagementsStep({ targets, participants, updateEngagement }: EngagementsStepProps) {
  // Track which targets have separated hits per participant
  const [separatedTargets, setSeparatedTargets] = useState<Set<number>>(new Set());
  // Track combined total hits for each target
  const [combinedTotalHits, setCombinedTotalHits] = useState<{ [targetIndex: number]: number }>({});

  // Only show snipers
  const snipers = participants.filter((p) => p.userDuty === "Sniper");

  // Toggle whether a target shows separated hits
  const toggleSeparatedHits = (targetIndex: number) => {
    const newSet = new Set(separatedTargets);
    if (newSet.has(targetIndex)) {
      newSet.delete(targetIndex);
      // Reset individual hits when going back to combined
      const target = targets[targetIndex];
      target.engagements.forEach((engIndex: number) => {
        updateEngagement(targetIndex, engIndex, "targetHits", undefined);
      });
      // Clear the combined total hits for this target
      const newCombinedHits = { ...combinedTotalHits };
      delete newCombinedHits[targetIndex];
      setCombinedTotalHits(newCombinedHits);
    } else {
      newSet.add(targetIndex);
    }
    setSeparatedTargets(newSet);
  };

  // Calculate total shots for a target
  const getTotalShots = (target: any) => {
    return target.engagements.reduce((sum: number, eng: any) => sum + (eng.shotsFired || 0), 0);
  };

  // Calculate total hits for a target
  const getTotalHits = (target: any) => {
    return target.engagements.reduce((sum: number, eng: any) => sum + (eng.targetHits || 0), 0);
  };

  // Auto-distribute hits based on shots fired ratio
  const autoDistributeHits = (targetIndex: number, totalHits: number) => {
    const target = targets[targetIndex];
    const totalShots = getTotalShots(target);

    if (totalShots === 0) return;

    target.engagements.forEach((eng: any, engIndex: number) => {
      const participant = participants.find((p: any) => p.userId === eng.userId);
      if (participant?.userDuty === "Sniper" && eng.shotsFired > 0) {
        const ratio = eng.shotsFired / totalShots;
        const estimatedHits = Math.round(totalHits * ratio);
        // Make sure hits don't exceed shots
        const finalHits = Math.min(estimatedHits, eng.shotsFired);
        updateEngagement(targetIndex, engIndex, "targetHits", finalHits);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-blue-800 dark:text-blue-200 mb-1 sm:mb-2">🎯 Target Engagements</h4>
        <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
          Enter shots fired for each participant per target. You can enter total hits for all participants or track individual hits.
        </p>
      </div>

      {targets.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-neutral-400">
          <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
          <p className="text-xs sm:text-sm">No targets added yet. Add targets in the previous step.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {targets.map((target: any, targetIndex: number) => {
            const isSeparated = separatedTargets.has(targetIndex);
            const totalShots = getTotalShots(target);
            const totalHits = getTotalHits(target);

            return (
              <div key={target.id} className="border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                {/* Target Header */}
                <div className="bg-gray-50 dark:bg-neutral-700 px-2 sm:px-4 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-800 dark:text-neutral-200 text-xs sm:text-sm">
                        Target {targetIndex + 1} - {target.distance}m
                      </h6>
                      <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-gray-600 dark:text-neutral-400 mt-0.5">
                        <span>Shots: {totalShots}</span>
                        {isSeparated && <span>Hits: {totalHits}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSeparatedHits(targetIndex)}
                      className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/70 whitespace-nowrap"
                    >
                      {isSeparated ? "Combined" : "Separate"}
                    </button>
                  </div>
                </div>

                {/* Participants */}
                <div className="p-2 sm:p-4 space-y-2">
                  {participants.map((participant: any) => {
                    const engIndex = target.engagements.findIndex((e: any) => e.userId === participant.userId);
                    if (engIndex === -1) return null;

                    const engagement = target.engagements[engIndex];
                    const isSniper = participant.userDuty === "Sniper";

                    return (
                      <div
                        key={participant.userId}
                        className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 p-2 sm:p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs sm:text-sm font-medium truncate">{participant.name}</span>
                            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400">({participant.userDuty})</span>
                          </div>
                        </div>

                        {isSniper ? (
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <label className="text-[10px] sm:text-xs text-gray-600 dark:text-neutral-400">Shots:</label>
                              <input
                                type="number"
                                value={engagement.shotsFired ?? ""}
                                onChange={(e) =>
                                  updateEngagement(targetIndex, engIndex, "shotsFired", e.target.value === "" ? 0 : parseInt(e.target.value))
                                }
                                className="w-14 sm:w-16 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                                min="0"
                                placeholder="0"
                              />
                            </div>

                            {isSeparated && (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <label className="text-[10px] sm:text-xs text-gray-600 dark:text-neutral-400">Hits:</label>
                                <input
                                  type="number"
                                  value={engagement.targetHits ?? ""}
                                  onChange={(e) =>
                                    updateEngagement(
                                      targetIndex,
                                      engIndex,
                                      "targetHits",
                                      e.target.value === "" ? undefined : parseInt(e.target.value),
                                    )
                                  }
                                  className="w-14 sm:w-16 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                                  min="0"
                                  max={engagement.shotsFired || 0}
                                  placeholder="0"
                                />
                                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400 min-w-[2rem] text-right">
                                  {engagement.shotsFired > 0 && engagement.targetHits !== undefined
                                    ? `${((engagement.targetHits / engagement.shotsFired) * 100).toFixed(0)}%`
                                    : "0%"}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400">Observer</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Combined hits input */}
                  {!isSeparated && snipers.length > 0 && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-neutral-600">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-300">Total Hits:</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400">max: {totalShots}</span>
                          <input
                            type="number"
                            value={combinedTotalHits[targetIndex] ?? ""}
                            onChange={(e) => {
                              const newTotalHits = e.target.value ? parseInt(e.target.value) : 0;
                              setCombinedTotalHits({ ...combinedTotalHits, [targetIndex]: newTotalHits });
                              autoDistributeHits(targetIndex, newTotalHits);
                            }}
                            className="w-16 sm:w-20 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                            min="0"
                            max={totalShots}
                          />
                        </div>
                      </div>
                      {(combinedTotalHits[targetIndex] ?? 0) > totalShots && (
                        <p className="mt-1 text-[10px] sm:text-xs text-red-600 dark:text-red-400">⚠️ Hits cannot exceed total shots</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
