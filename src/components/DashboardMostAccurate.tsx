import { TrendingUp } from "lucide-react";
import BaseDashboardCard from "./BaseDashboardCard";

export default function DashboardMostAccurate({ topAccurateSnipers }: { topAccurateSnipers: any[] }) {
  return (
    <div className="lg:col-span-3 h-full">
      <BaseDashboardCard title="Precision Accuracy">
        <ol className="space-y-3 mt-4 h-full overflow-y-auto">
          {(topAccurateSnipers || []).slice(0, 5).map((sniper: any, idx: number) => {
            const percentage = sniper.user_accuracy_percentage || 0;
            return (
              <li key={sniper.user_shooter_name + idx} className="space-y-1 px-2 rounded transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start">
                    {idx === 0 ? (
                      <div className="flex items-center flex-col justify-start">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mr-4">
                          <TrendingUp className="h-6 w-6 text-zinc-400" />
                        </div>
                      </div>
                    ) : null}

                    <span className={`text-zinc-100 font-medium text-lg flex flex-col`}>
                      {sniper.user_shooter_name || "Unknown"}
                      {idx === 0 ? <p className="text-zinc-400 text-xs ">Most Accurate</p> : null}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-zinc-300">{percentage.toFixed(2)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded">
                  <div className="h-full bg-zinc-400 rounded transition-all mt-4" style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
              </li>
            );
          })}

          {(!topAccurateSnipers || topAccurateSnipers.length === 0) && <li className="text-zinc-500 text-xs italic px-2 py-2">No data available.</li>}
        </ol>
      </BaseDashboardCard>
    </div>
  );
}
