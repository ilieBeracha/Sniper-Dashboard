import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Target as TargetIcon, Crosshair } from "lucide-react";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";

interface EngagementsSectionProps {
  section: any;
  targets: Target[];
  participants: Participant[];
  updateEngagement: (targetId: string, userId: string, field: "shotsFired" | "targetHits", value: number) => void;
}

export const EngagementsSection = ({ section, targets, participants, updateEngagement }: EngagementsSectionProps) => {
  return (
    <div id="engagements" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4 ">
      <SectionHeader section={section} />
      <Card className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 ">
        <CardContent className="p-0">
          <div className="space-y-6 lg:space-y-8">
            {targets.map((target, targetIndex) => (
              <div key={target.id}>
                <div className="border-b border-gray-200 dark:border-white/10 p-4 lg:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>
                        Target #{targetIndex + 1} - {target.distance}m
                      </span>
                      {(target.windStrength || target.windDirection) && (
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          (Wind: {target.windStrength || 0}m/s at {target.windDirection || 0}°)
                        </span>
                      )}
                    </div>
                  </h3>
                </div>
                <div className="p-4 lg:p-6">
                  {/* Header row */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Shots</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Hits</span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-3">
                    {participants
                      .filter((p) => p.userDuty === "Sniper")
                      .map((participant) => {
                        const engagement = target.engagements.find((e) => e.userId === participant.userId);

                        return (
                          <div
                            key={participant.userId}
                            className="grid grid-cols-3 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {/* Name column */}
                            <div className="flex items-center space-x-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{participant.name}</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">{participant.position} position</p>
                              </div>
                            </div>

                            {/* Shots fired column */}
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={engagement?.shotsFired || ""}
                                onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                                className="w-20 h-9 text-center border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                              />
                            </div>

                            {/* Target hits column */}
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={engagement?.targetHits || ""}
                                onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                                className="w-20 h-9 text-center border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                              />
                            </div>
                          </div>
                        );
                      })}

                    {participants.filter((p) => p.userDuty === "Sniper").length === 0 && (
                      <div className="text-center  text-gray-500 dark:text-zinc-400">
                        <Crosshair className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-zinc-600" />
                        <p>No snipers assigned. Add participants with sniper role to record engagements.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {targets.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg bg-gray-50/50 dark:bg-zinc-800">
                <TargetIcon className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No targets to engage</h3>
                <p className="text-gray-600 dark:text-zinc-400">Configure targets above to record engagements</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
