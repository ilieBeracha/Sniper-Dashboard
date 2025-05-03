import { SquadPerformance } from "@/types/performance";
import { Users, Target, Timer, Zap, Trophy, Shield } from "lucide-react";

export default function AnalyticsSquadPerformance({ squadPerformance }: { squadPerformance: SquadPerformance[] }) {
  return (
    <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-blue-400" />
          <h3 className="text-base font-semibold text-white">Squad Performance</h3>
        </div>
        <span className="text-xs text-zinc-400">{squadPerformance.length} squads</span>
      </div>

      {/* Squad Cards */}
      <div className="space-y-3">
        {squadPerformance.map((squad, index) => (
          <div key={squad.squad_id} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors">
            {/* Squad Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-amber-500/20 text-amber-400"
                      : index === 1
                      ? "bg-zinc-300/20 text-zinc-300"
                      : index === 2
                      ? "bg-orange-700/20 text-orange-600"
                      : "bg-zinc-700/50 text-zinc-400"
                  }`}
                >
                  {index + 1}
                </div>
                <h4 className="text-sm font-semibold text-white">{squad.squad_name}</h4>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Users size={12} />
                {squad.total_snipers} snipers
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1">
                  <Target size={12} />
                  Accuracy
                </div>
                <p className="text-sm font-semibold text-green-400">{squad.avg_accuracy}%</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1">
                  <Zap size={12} />
                  First Shot
                </div>
                <p className="text-sm font-semibold text-yellow-400">{squad.first_shot_success_rate}%</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1">
                  <Timer size={12} />
                  Reaction
                </div>
                <p className="text-sm font-semibold text-blue-400">{squad.avg_reaction_time}s</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1">
                  <Trophy size={12} />
                  Elimination
                </div>
                <p className="text-sm font-semibold text-red-400">{squad.elimination_rate}%</p>
              </div>
            </div>

            {/* Best Sniper */}
            {squad.best_sniper && (
              <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
                <span className="text-xs text-zinc-400">Top Sniper:</span>
                <div className="flex items-center gap-1">
                  <Trophy size={12} className="text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">{squad.best_sniper}</span>
                </div>
              </div>
            )}

            {/* Mission Count */}
            <div className="mt-2 text-xs text-zinc-500">{squad.total_missions} missions completed</div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {squadPerformance.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No squad data available</p>
          <p className="text-xs text-zinc-500 mt-1">Complete missions to see squad comparisons</p>
        </div>
      )}
    </div>
  );
}
