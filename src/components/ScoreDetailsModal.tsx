import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";
import { scoreStore } from "@/store/scoreSrore";
import { useStore } from "zustand";

interface ScoreDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  score: any;
}

export default function ScoreDetailsModal({ isOpen, setIsOpen, score }: ScoreDetailsModalProps) {
  const { scoreTargetsByScoreId } = useStore(scoreStore);

  const content = (
    <div className=" space-y-6">
      {score ? (
        <div className="space-y-6">
          {/* Assignment Info */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h3 className="text-lg font-medium text-white mb-3">Assignment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Assignment:</span>
                <p className="text-white font-medium">{score.assignment_session?.assignment?.assignment_name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Date:</span>
                <p className="text-white font-medium">{new Date(score.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Participant Info */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h3 className="text-lg font-medium text-white mb-3">Participant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-400">Name:</span>
                <p className="text-white font-medium">
                  {score.score_participants?.map((participant: any) => participant.user.first_name + " " + participant.user.last_name).join(", ")}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Squad:</span>
                <p className="text-white font-medium">{score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Position:</span>
                <p className="text-white font-medium capitalize">{score.position || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Mission Details */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h3 className="text-lg font-medium text-white mb-3">Mission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Day/Night:</span>
                <p className="text-white font-medium capitalize">{score.day_night || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Time to First Shot:</span>
                <p className="text-white font-medium">{score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Target Eliminated:</span>
                <p className={`font-medium ${score.target_eliminated ? "text-green-400" : "text-red-400"}`}>
                  {score.target_eliminated ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-400">First Shot Hit:</span>
                <p className={`font-medium ${score.first_shot_hit ? "text-green-400" : "text-red-400"}`}>{score.first_shot_hit ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          {(score.wind_strength || score.wind_direction) && (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h3 className="text-lg font-medium text-white mb-3">Environmental Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {score.wind_strength && (
                  <div>
                    <span className="text-sm text-gray-400">Wind Strength:</span>
                    <p className="text-white font-medium">{score.wind_strength}</p>
                  </div>
                )}
                {score.wind_direction && (
                  <div>
                    <span className="text-sm text-gray-400">Wind Direction:</span>
                    <p className="text-white font-medium">{score.wind_direction}°</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {score.note && (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h3 className="text-lg font-medium text-white mb-3">Notes</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{score.note}</p>
            </div>
          )}

          {/* Score Targets - Shooting Performance */}
          {scoreTargetsByScoreId && scoreTargetsByScoreId.length > 0 ? (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h3 className="text-lg font-medium text-white mb-4">Shooting Performance</h3>
              <div className="space-y-4">
                {scoreTargetsByScoreId.map((target: any, index: number) => {
                  const accuracy = target.shots_fired > 0 ? ((target.target_hits / target.shots_fired) * 100).toFixed(1) : "0";
                  return (
                    <div key={target.id} className="bg-zinc-900/40 rounded-lg p-4 border border-zinc-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-medium text-white">Target #{index + 1}</h4>
                        <span className="text-sm text-gray-400">{new Date(target.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <span className="text-xs text-gray-400 block mb-1">Distance</span>
                          <p className="text-lg font-bold text-indigo-400">{target.distance}m</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-gray-400 block mb-1">Shots Fired</span>
                          <p className="text-lg font-bold text-white">{target.shots_fired}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-gray-400 block mb-1">Hits</span>
                          <p className="text-lg font-bold text-green-400">{target.target_hits}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-gray-400 block mb-1">Accuracy</span>
                          <p
                            className={`text-lg font-bold ${parseFloat(accuracy) >= 80 ? "text-green-400" : parseFloat(accuracy) >= 60 ? "text-yellow-400" : "text-red-400"}`}
                          >
                            {accuracy}%
                          </p>
                        </div>
                      </div>
                      {/* Visual accuracy bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Accuracy Rate</span>
                          <span>{accuracy}%</span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              parseFloat(accuracy) >= 80 ? "bg-green-500" : parseFloat(accuracy) >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary if multiple targets */}
              {scoreTargetsByScoreId.length > 1 && (
                <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-700/30">
                  <h4 className="text-sm font-medium text-indigo-300 mb-2">Overall Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-xs text-gray-400 block">Total Shots</span>
                      <p className="text-sm font-bold text-white">
                        {scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.shots_fired, 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Total Hits</span>
                      <p className="text-sm font-bold text-green-400">
                        {scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.target_hits, 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Overall Accuracy</span>
                      <p className="text-sm font-bold text-indigo-400">
                        {scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.shots_fired, 0) > 0
                          ? (
                              (scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.target_hits, 0) /
                                scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.shots_fired, 0)) *
                              100
                            ).toFixed(1)
                          : "0"}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h3 className="text-lg font-medium text-white mb-3">Shooting Performance</h3>
              <div className="text-center py-4">
                <p className="text-gray-400">No shooting data available</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No score data available</p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <BaseMobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Score Details">
        {content}
      </BaseMobileDrawer>
    );
  }

  return (
    <BaseDesktopDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Score Details">
      {content}
    </BaseDesktopDrawer>
  );
}
