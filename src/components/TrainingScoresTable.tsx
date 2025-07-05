import BaseDashboardCard from "@/components/BaseDashboardCard";
import { Edit, Eye, Target, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TrainingScoresTableProps {
  scores: any[];
  onScoreClick: (score: any) => void;
  onEditClick: (score: any) => void;
  newlyAddedScoreId?: string | null;
}

export default function TrainingScoresTable({ scores, onScoreClick, onEditClick, newlyAddedScoreId }: TrainingScoresTableProps) {
  const { theme } = useTheme();

  return (
    <BaseDashboardCard header="Scores" withBtn>
      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {scores.map((score: any) => {
          const isNewlyAdded = newlyAddedScoreId === score.id;

          return (
            <div
              key={score.id}
              className={`rounded-lg  transition-all duration-300 ${isNewlyAdded ? "bg-indigo-500/20 border-indigo-400/50 animate-pulse" : ""}`}
            >
              {/* Main Score Row */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  {/* Main Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Assignment */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Target className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm font-medium truncate transition-colors duration-200 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {score.assignment_session?.assignment?.assignment_name || "N/A"}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {score.score_participants?.[0]?.user
                              ? `${score.score_participants[0].user.first_name} ${score.score_participants[0].user.last_name}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`text-sm mt capitalize transition-colors duration-200 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
                      >
                        {score.position || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScoreClick(score);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300"
                          : "hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700"
                      }`}
                      title="View Full Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(score);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-amber-600/20 text-amber-400 hover:text-amber-300"
                          : "hover:bg-amber-100 text-amber-600 hover:text-amber-700"
                      }`}
                      title="Edit Score"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Section - Always Shown */}
            </div>
          );
        })}
      </div>
    </BaseDashboardCard>
  );
}
