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
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Target Engagements</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter shots fired for each participant per target. You can enter total hits for all participants or track individual hits.
        </p>
      </div>

      {targets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No targets added yet. Add targets in the previous step.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {targets.map((target: any, targetIndex: number) => {
            const isSeparated = separatedTargets.has(targetIndex);
            const totalShots = getTotalShots(target);
            const totalHits = getTotalHits(target);

            return (
              <div key={target.id} className="border-2 border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                {/* Target Header */}
                <div className="bg-gray-50 dark:bg-neutral-700 px-4 py-3 flex items-center justify-between">
                  <div>
                    <h6 className="font-medium text-gray-800 dark:text-neutral-200">
                      Target {targetIndex + 1} - {target.distance}m
                    </h6>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-neutral-400 mt-1">
                      <span>Total shots: {totalShots}</span>
                      {isSeparated && <span>Total hits: {totalHits}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSeparatedHits(targetIndex)}
                    className="px-3 py-1 text-sm font-medium rounded-full transition-colors bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/70"
                  >
                    {isSeparated ? "Combined Hits" : "Separate Hits"}
                  </button>
                </div>

                {/* Participants */}
                <div className="p-4 space-y-3">
                  {participants.map((participant: any) => {
                    const engIndex = target.engagements.findIndex((e: any) => e.userId === participant.userId);
                    if (engIndex === -1) return null;

                    const engagement = target.engagements[engIndex];
                    const isSniper = participant.userDuty === "Sniper";

                    return (
                      <div key={participant.userId} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{participant.name}</span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">({participant.userDuty})</span>
                        </div>

                        {isSniper ? (
                          <>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600 dark:text-neutral-400">Shots:</label>
                              <input
                                type="number"
                                value={engagement.shotsFired || 0}
                                onChange={(e) => updateEngagement(targetIndex, engIndex, "shotsFired", e.target.value ? parseInt(e.target.value) : 0)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                                min="0"
                              />
                            </div>

                            {isSeparated && (
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 dark:text-neutral-400">Hits:</label>
                                <input
                                  type="number"
                                  value={engagement.targetHits || 0}
                                  onChange={(e) =>
                                    updateEngagement(targetIndex, engIndex, "targetHits", e.target.value ? parseInt(e.target.value) : 0)
                                  }
                                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                                  min="0"
                                  max={engagement.shotsFired || 0}
                                />
                                <span className="text-xs text-gray-500 dark:text-neutral-400">
                                  {engagement.shotsFired > 0 && engagement.targetHits !== undefined
                                    ? `${((engagement.targetHits / engagement.shotsFired) * 100).toFixed(0)}%`
                                    : "0%"}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-neutral-400">Observer</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Combined hits input */}
                  {!isSeparated && snipers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-600">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Total Hits on Target:</label>
                        <input
                          type="number"
                          value={combinedTotalHits[targetIndex] ?? ""}
                          onChange={(e) => {
                            const newTotalHits = e.target.value ? parseInt(e.target.value) : 0;
                            setCombinedTotalHits({ ...combinedTotalHits, [targetIndex]: newTotalHits });
                            autoDistributeHits(targetIndex, newTotalHits);
                          }}
                          className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                          min="0"
                          max={totalShots}
                        />
                        <span className="text-sm text-gray-500 dark:text-neutral-400">(max: {totalShots} shots)</span>
                      </div>
                      {(combinedTotalHits[targetIndex] ?? 0) > totalShots && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">⚠️ Hits cannot exceed total shots fired</p>
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
