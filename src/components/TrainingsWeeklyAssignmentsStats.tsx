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
          <div className="rounded-xl overflow-hidden shadow-lg shadow-green-900/5">
            <div className="h-2 bg-gradient-to-r from-green-100 to-emerald-600"></div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-green-400 uppercase tracking-wider">Most Practiced</h4>
                  </div>
                  <p className="text-white font-semibold ">{weeklyAssignmentsStats.most_common.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {weeklyAssignmentsStats.least_common && weeklyAssignmentsStats.total_unique_assignments > 1 && (
          <div className="rounded-xl overflow-hidden  border-blue-500/20 shadow-lg shadow-blue-900/5">
            <div className="h-2 bg-gradient-to-r from-blue-100 to-sky-600"></div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wider">Needs Focus</h4>
                  </div>
                  <p className="text-white font-semibold ">{weeklyAssignmentsStats.least_common.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Assignments Section */}
      {weeklyAssignmentsStats.all_assignments && weeklyAssignmentsStats.all_assignments.length > 0 && (
        <div className="mt-4  rounded-xl border border-white/10 p-4">
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
            {weeklyAssignmentsStats.all_assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between px-4 py-3 rounded-lg ">
                <span className="text-white font-medium text-sm">{assignment.name}</span>
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
