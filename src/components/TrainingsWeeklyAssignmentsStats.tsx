import { TrendingUp, TrendingDown, Clock, Award, BarChart3, Target } from "lucide-react";
import { WeeklyAssignmentStats } from "@/types/training";

interface TrainingWeeklyStatsProps {
  weeklyAssignmentsStats: WeeklyAssignmentStats;
}

export default function TrainingsWeeklyAssignmentsStats({ weeklyAssignmentsStats }: TrainingWeeklyStatsProps) {
  // Empty state with more visual appeal
  if (!weeklyAssignmentsStats || weeklyAssignmentsStats.total_trainings === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-white/5 rounded-lg p-6 text-center space-y-3">
        <div className="bg-indigo-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
        </div>
        <h4 className="text-gray-200 font-medium">No Weekly Data Yet</h4>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">Schedule training sessions this week to see assignment statistics</p>
      </div>
    );
  }

  // Calculate total occurrences for percentage
  const totalOccurrences = weeklyAssignmentsStats.all_assignments?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weeklyAssignmentsStats.most_common && (
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20 shadow-lg shadow-green-900/5">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-green-500/30 to-green-400/10 border border-green-500/30">
                  <Target size={20} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-green-400 uppercase tracking-wider">Most Practiced</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs rounded-full bg-green-500/20 text-green-300 px-2 py-0.5 font-medium">
                        {weeklyAssignmentsStats.most_common.count}x
                      </span>
                      <TrendingUp size={14} className="text-green-400" />
                    </div>
                  </div>
                  <p className="text-white font-semibold ">{weeklyAssignmentsStats.most_common.name}</p>
                  <div className="mt-2 h-1.5 w-full bg-green-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{ width: `${(weeklyAssignmentsStats.most_common.count / totalOccurrences) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {weeklyAssignmentsStats.least_common && weeklyAssignmentsStats.total_unique_assignments > 1 && (
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/20 shadow-lg shadow-blue-900/5">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-sky-500"></div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-400/10 border border-blue-500/30">
                  <Target size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Needs Focus</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs rounded-full text-blue-300 px-2 py-0.5 font-medium">{weeklyAssignmentsStats.least_common.count}x</span>
                      <TrendingDown size={14} className="text-blue-400" />
                    </div>
                  </div>
                  <p className="text-white font-semibold ">{weeklyAssignmentsStats.least_common.name}</p>
                  <div className="mt-2 h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                      style={{ width: `${(weeklyAssignmentsStats.least_common.count / totalOccurrences) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Assignments Section */}
      {weeklyAssignmentsStats.all_assignments && weeklyAssignmentsStats.all_assignments.length > 0 && (
        <div className="mt-4  rounded-xl border border-white/10 p-4">
          <h4 className="text-sm text-gray-300 font-medium mb-3 flex items-center">
            <Award className="w-4 h-4 mr-2 text-amber-400" />
            <span>All Assignments This Week</span>
          </h4>

          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
            {weeklyAssignmentsStats.all_assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between px-4 py-3 rounded-lg ">
                <span className="text-white font-medium">{assignment.name}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/50 rounded-full" style={{ width: `${(assignment.count / totalOccurrences) * 100}%` }}></div>
                  </div>
                  <span className="text-white px-2 py-0.5 rounded text-xs">{assignment.count}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
