import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
    <div id="engagements" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <SectionHeader section={section} />
      <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
        <CardContent className="px-2">
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
                  <div className="space-y-4 lg:space-y-6">
                    {participants
                      .filter((p) => p.userDuty === "Sniper")
                      .map((participant) => {
                        const engagement = target.engagements.find((e) => e.userId === participant.userId);

                        return (
                          <div key={participant.userId}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                              <div className="flex items-center space-x-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-0"
                                >
                                  Sniper
                                </Badge>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">{participant.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-zinc-400">{participant.position} position</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Shots Fired</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={engagement?.shotsFired || ""}
                                  onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                                  className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                                />
                              </div>

                              <div className="space-y-3">
                                <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Target Hits</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Optional"
                                  value={engagement?.targetHits || ""}
                                  onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                                  className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {participants.filter((p) => p.userDuty === "Sniper").length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
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
