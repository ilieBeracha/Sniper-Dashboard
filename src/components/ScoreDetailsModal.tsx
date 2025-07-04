import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import { isMobile } from "react-device-detect";
import { scoreStore } from "@/store/scoreSrore";
import { useStore } from "zustand";
import { useTheme } from "@/contexts/ThemeContext";

interface ScoreDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  score: any;
}

export default function ScoreDetailsModal({ isOpen, setIsOpen, score }: ScoreDetailsModalProps) {
  const { scoreTargetsByScoreId } = useStore(scoreStore);
  const { theme } = useTheme();

  const content = (
    <div className=" space-y-6">
      {score ? (
        <div className="space-y-6">
          {/* Assignment Info */}
          <div className={`rounded-lg p-4 border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
          }`}>
            <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Assignment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Assignment:</span>
                <p className={`font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{score.assignment_session?.assignment?.assignment_name || "N/A"}</p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Date:</span>
                <p className={`font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{new Date(score.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Participant Info */}
          <div className={`rounded-lg p-4 border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
          }`}>
            <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Participant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Name:</span>
                <p className={`font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {score.score_participants?.map((participant: any) => participant.user.first_name + " " + participant.user.last_name).join(", ")}
                </p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Squad:</span>
                <p className={`font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}</p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Position:</span>
                <p className={`font-medium capitalize transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{score.position || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Mission Details */}
          <div className={`rounded-lg p-4 border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
          }`}>
            <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>Mission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Day/Night:</span>
                <p className={`font-medium capitalize transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{score.day_night || "N/A"}</p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Time to First Shot:</span>
                <p className={`font-medium transition-colors duration-200 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}</p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>Target Eliminated:</span>
                <p className={`font-medium ${score.target_eliminated ? "text-green-400" : "text-red-400"}`}>
                  {score.target_eliminated ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className={`text-sm transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>First Shot Hit:</span>
                <p className={`font-medium ${score.first_shot_hit ? "text-green-400" : "text-red-400"}`}>{score.first_shot_hit ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          {(score.wind_strength || score.wind_direction) && (
            <div className={`rounded-lg p-4 border transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
            }`}>
              <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Environmental Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {score.wind_strength && (
                  <div>
                    <span className={`text-sm transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>Wind Strength:</span>
                    <p className={`font-medium transition-colors duration-200 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>{score.wind_strength}</p>
                  </div>
                )}
                {score.wind_direction && (
                  <div>
                    <span className={`text-sm transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>Wind Direction:</span>
                    <p className={`font-medium transition-colors duration-200 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>{score.wind_direction}°</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {score.note && (
            <div className={`rounded-lg p-4 border transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
            }`}>
              <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Notes</h3>
              <p className={`whitespace-pre-wrap transition-colors duration-200 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>{score.note}</p>
            </div>
          )}

          {/* Score Targets - Shooting Performance */}
          {scoreTargetsByScoreId && scoreTargetsByScoreId.length > 0 ? (
            <div className={`rounded-lg p-4 border transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
            }`}>
              <h3 className={`text-lg font-medium mb-4 transition-colors duration-200 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Shooting Performance</h3>
              <div className="space-y-4">
                {scoreTargetsByScoreId.map((target: any, index: number) => {
                  const accuracy = target.shots_fired > 0 ? ((target.target_hits / target.shots_fired) * 100).toFixed(1) : "0";
                  return (
                    <div key={target.id} className={`rounded-lg p-4 border transition-colors duration-200 ${
                      theme === "dark" ? "bg-zinc-900/40 border-zinc-600/30" : "bg-white border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-base font-medium transition-colors duration-200 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>Target #{index + 1}</h4>
                        <span className={`text-sm transition-colors duration-200 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>{new Date(target.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <span className={`text-xs block mb-1 transition-colors duration-200 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}>Distance</span>
                          <p className="text-lg font-bold text-indigo-400">{target.distance}m</p>
                        </div>
                        <div className="text-center">
                          <span className={`text-xs block mb-1 transition-colors duration-200 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}>Shots Fired</span>
                          <p className={`text-lg font-bold transition-colors duration-200 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>{target.shots_fired}</p>
                        </div>
                        <div className="text-center">
                          <span className={`text-xs block mb-1 transition-colors duration-200 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}>Hits</span>
                          <p className="text-lg font-bold text-green-400">{target.target_hits}</p>
                        </div>
                        <div className="text-center">
                          <span className={`text-xs block mb-1 transition-colors duration-200 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}>Accuracy</span>
                          <p
                            className={`text-lg font-bold ${parseFloat(accuracy) >= 80 ? "text-green-400" : parseFloat(accuracy) >= 60 ? "text-yellow-400" : "text-red-400"}`}
                          >
                            {accuracy}%
                          </p>
                        </div>
                      </div>
                      {/* Visual accuracy bar */}
                      <div className="mt-3">
                        <div className={`flex items-center justify-between text-xs mb-1 transition-colors duration-200 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          <span>Accuracy Rate</span>
                          <span>{accuracy}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 transition-colors duration-200 ${
                          theme === "dark" ? "bg-zinc-700" : "bg-gray-300"
                        }`}>
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
                <div className={`mt-4 p-3 rounded-lg border transition-colors duration-200 ${
                  theme === "dark" ? "bg-indigo-900/20 border-indigo-700/30" : "bg-indigo-50 border-indigo-200"
                }`}>
                  <h4 className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}>Overall Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className={`text-xs block transition-colors duration-200 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>Total Shots</span>
                      <p className={`text-sm font-bold transition-colors duration-200 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.shots_fired, 0)}
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs block transition-colors duration-200 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>Total Hits</span>
                      <p className="text-sm font-bold text-green-400">
                        {scoreTargetsByScoreId.reduce((sum: number, target: any) => sum + target.target_hits, 0)}
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs block transition-colors duration-200 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>Overall Accuracy</span>
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
            <div className={`rounded-lg p-4 border transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-50 border-gray-300"
            }`}>
              <h3 className={`text-lg font-medium mb-3 transition-colors duration-200 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Shooting Performance</h3>
              <div className="text-center py-4">
                <p className={`transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>No shooting data available</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className={`transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>No score data available</p>
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
