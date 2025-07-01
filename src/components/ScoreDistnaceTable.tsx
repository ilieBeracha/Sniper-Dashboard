import { ScoreTarget } from "@/types/score";
import BaseDashboardCard from "./BaseDashboardCard";

export default function ScoreDistanceTable({ rows }: { rows: ScoreTarget[] }) {
  const aggregated = Object.values(
    rows.reduce<Record<number, { bucket: number; shots_fired: number; target_hit: number }>>((acc, { distance, shots_fired, target_hit }) => {
      const bucket = Math.floor(distance / 100) * 100; // 100-m buckets
      const item = acc[bucket] || { bucket, shots_fired: 0, target_hit: 0 };
      item.shots_fired += shots_fired;
      item.target_hit += target_hit;
      acc[bucket] = item;
      return acc;
    }, {}),
  ).sort((a, b) => a.bucket - b.bucket);

  const rowsWithPercentage = aggregated.map((row) => ({
    ...row,
    rangeLabel: `${row.bucket}-${row.bucket + 99}m`,
    hitPercentage: row.shots_fired > 0 ? Math.round((row.target_hit / row.shots_fired) * 100) : 0,
  }));

  return (
    <BaseDashboardCard header="Distance Statistics">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wider text-gray-400">
              <th className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">Distance (m)</th>
              <th className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">Shots</th>
              <th className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">Hits</th>
              <th className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {rowsWithPercentage.length > 0 ? (
              rowsWithPercentage.map((r) => (
                <tr key={`${r.bucket}`} className="border-b border-white/5 transition-colors hover:bg-white/5">
                  <td className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">{r.rangeLabel}</td>
                  <td className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">{r.shots_fired}</td>
                  <td className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">{r.target_hit}</td>
                  <td className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm text-gray-100 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.hitPercentage >= 70
                          ? "bg-green-500/20 text-green-300"
                          : r.hitPercentage >= 40
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {r.hitPercentage}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No distance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BaseDashboardCard>
  );
}
