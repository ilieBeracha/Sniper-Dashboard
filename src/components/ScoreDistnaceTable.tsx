import { ScoreTarget } from "@/types/score";
import BaseDashboardCard from "./BaseDashboardCard";
import { useTheme } from "@/contexts/ThemeContext";

export default function ScoreDistanceTable({ rows }: { rows: ScoreTarget[] }) {
  const { theme } = useTheme();

  const aggregated = Object.values(
    rows.reduce<Record<number, { bucket: number; shots_fired: number; target_hit: number }>>((acc, { distance, shots_fired, target_hits }) => {
      const bucket = Math.floor(distance / 100) * 100; // 100-m buckets
      const item = acc[bucket] || { bucket, shots_fired: 0, target_hit: 0 };
      item.shots_fired += shots_fired;
      item.target_hit += target_hits || 0;
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
            <tr
              className={`border-b text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                theme === "dark" ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-600"
              }`}
            >
              <th
                className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                Distance (m)
              </th>
              <th
                className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                Shots
              </th>
              <th
                className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                Hits
              </th>
              <th
                className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-700"
                }`}
              >
                Accuracy
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsWithPercentage.length > 0 ? (
              rowsWithPercentage.map((r) => (
                <tr
                  key={`${r.bucket}`}
                  className={`border-b transition-colors ${
                    theme === "dark" ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {r.rangeLabel}
                  </td>
                  <td
                    className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {r.shots_fired}
                  </td>
                  <td
                    className={`py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {r.target_hit}
                  </td>
                  <td className="py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm whitespace-nowrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.hitPercentage >= 70
                          ? theme === "dark"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-green-100 text-green-700"
                          : r.hitPercentage >= 40
                            ? theme === "dark"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-amber-100 text-amber-700"
                            : theme === "dark"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.hitPercentage}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className={`px-6 py-8 text-center transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
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
