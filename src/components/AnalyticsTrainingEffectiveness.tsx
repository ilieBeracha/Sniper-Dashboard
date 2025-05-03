import { TrainingEffectiveness } from "@/types/performance";
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle, Clock, Calendar } from "lucide-react";

export default function DashboardTrainingEffectiveness({ trainingData }: { trainingData: TrainingEffectiveness[] }) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High Impact":
        return "text-green-400 bg-green-400/10";
      case "Moderate Impact":
        return "text-yellow-400 bg-yellow-400/10";
      case "Low Impact":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-red-400 bg-red-400/10";
    }
  };

  const getGapStatus = (gapDays: number, frequency: string) => {
    const thresholds = {
      Weekly: 7,
      "Bi-weekly": 14,
      Monthly: 30,
    };

    const threshold = thresholds[frequency as keyof typeof thresholds] || 30;

    if (gapDays > threshold * 1.5) return { color: "text-red-400", text: "Overdue", icon: AlertTriangle };
    if (gapDays > threshold) return { color: "text-yellow-400", text: "Due Soon", icon: Clock };
    return { color: "text-green-400", text: "On Schedule", icon: CheckCircle };
  };

  // Separate actionable insights
  const overdueTrainings = trainingData.filter((t) => {
    const status = getGapStatus(t.current_gap_days, t.recommended_frequency);
    return status.text === "Overdue";
  });

  const highImpactTrainings = trainingData.filter((t) => t.skill_correlation === "High Impact");

  return (
    <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-purple-400" />
          <h3 className="text-base font-semibold text-white">Training Effectiveness Analysis</h3>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-400" />
            <h4 className="text-sm font-medium text-red-400">Immediate Action Required</h4>
          </div>
          {overdueTrainings.length > 0 ? (
            <ul className="space-y-1">
              {overdueTrainings.slice(0, 3).map((training) => (
                <li key={training.assignment_name} className="text-xs text-zinc-300">
                  • Schedule <span className="font-medium">{training.assignment_name}</span>
                  <span className="text-red-400"> ({training.current_gap_days} days overdue)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-400">All trainings on schedule</p>
          )}
        </div>

        <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-400" />
            <h4 className="text-sm font-medium text-green-400">High Impact Trainings</h4>
          </div>
          {highImpactTrainings.length > 0 ? (
            <ul className="space-y-1">
              {highImpactTrainings.slice(0, 3).map((training) => (
                <li key={training.assignment_name} className="text-xs text-zinc-300">
                  • <span className="font-medium">{training.assignment_name}</span>
                  <span className="text-green-400"> (+{training.avg_accuracy_improvement}% accuracy)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-400">No high impact trainings identified</p>
          )}
        </div>
      </div>

      {/* Training Analysis Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50">
              <th className="text-left py-2 px-3 text-xs font-medium text-zinc-400">Training</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-zinc-400">Impact</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-zinc-400">Accuracy Δ</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-zinc-400">Schedule</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-zinc-400">Status</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-zinc-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {trainingData.map((training) => {
              const gapStatus = getGapStatus(training.current_gap_days, training.recommended_frequency);
              const GapIcon = gapStatus.icon;

              return (
                <tr key={training.assignment_name} className="border-b border-zinc-700/30 hover:bg-zinc-800/30">
                  <td className="py-2 px-3">
                    <div>
                      <p className="text-sm font-medium text-white">{training.assignment_name}</p>
                      <p className="text-xs text-zinc-500">{training.total_sessions} sessions</p>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(training.skill_correlation)}`}>
                      {training.skill_correlation}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-sm font-medium ${training.avg_accuracy_improvement > 0 ? "text-green-400" : "text-red-400"}`}>
                      {training.avg_accuracy_improvement > 0 ? "+" : ""}
                      {training.avg_accuracy_improvement}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar size={12} className="text-zinc-400" />
                      <span className="text-xs text-zinc-300">{training.recommended_frequency}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className={`flex items-center justify-center gap-1 ${gapStatus.color}`}>
                      <GapIcon size={12} />
                      <span className="text-xs">{gapStatus.text}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        gapStatus.text === "Overdue"
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {gapStatus.text === "Overdue" ? "Schedule Now" : "Schedule"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Commander's Summary */}
      <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
        <h4 className="text-sm font-medium text-white mb-2">Commander's Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-zinc-400 mb-1">Top Performing Training:</p>
            <p className="text-white font-medium">{trainingData[0]?.assignment_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-zinc-400 mb-1">Most Overdue:</p>
            <p className="text-red-400 font-medium">{overdueTrainings[0]?.assignment_name || "None"}</p>
          </div>
          <div>
            <p className="text-zinc-400 mb-1">Recommended Focus:</p>
            <p className="text-green-400 font-medium">{highImpactTrainings[0]?.assignment_name || "Continue current schedule"}</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {trainingData.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No training data available</p>
          <p className="text-xs text-zinc-500 mt-1">Complete training sessions to see effectiveness analysis</p>
        </div>
      )}
    </div>
  );
}
