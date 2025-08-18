// /components/FirstShotMatrixHeatmap.tsx
import { useMemo, useState } from "react";
import { useStore } from "zustand";
import { useStatsStore } from "@/store/statsStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Crosshair, Target, Activity, ChevronDown, ChevronUp } from "lucide-react";

type RangeKey = "0-100" | "100-200" | "200-300" | "300+";
type BucketRow = { distance_bucket: number; targets: number; first_shot_hit_rate: number | null };

export default function FirstShotMatrixHeatmap() {
  const { firstShotMatrix } = useStore(useStatsStore);
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const { ranges, overallAccuracy, bestRange, mostActiveRange, maxTargetsAcrossRanges, topBuckets } = useMemo(() => {
    const byRange: Record<RangeKey, { buckets: BucketRow[]; totalTargets: number; weightedHits: number }> = {
      "0-100": { buckets: [], totalTargets: 0, weightedHits: 0 },
      "100-200": { buckets: [], totalTargets: 0, weightedHits: 0 },
      "200-300": { buckets: [], totalTargets: 0, weightedHits: 0 },
      "300+": { buckets: [], totalTargets: 0, weightedHits: 0 },
    };

    for (const r of (firstShotMatrix ?? []) as any[]) {
      const b = r.totalShots ?? 0;
      const targets = r.totalHits ?? 0;
      const rate = r.hitRatio ?? 0;

      const key: RangeKey = b < 100 ? "0-100" : b < 200 ? "100-200" : b < 300 ? "200-300" : "300+";
      byRange[key].buckets.push({ distance_bucket: b, targets, first_shot_hit_rate: rate } as BucketRow);
      byRange[key].totalTargets += targets;
      byRange[key].weightedHits += targets * rate;
    }

    const ranges = (Object.keys(byRange) as RangeKey[]).map((k) => {
      const r = byRange[k];
      const acc = r.totalTargets > 0 ? r.weightedHits / r.totalTargets : null;
      return {
        key: k,
        totalTargets: r.totalTargets,
        accuracy: acc, // 0..1 or null
        buckets: r.buckets.sort((a, b) => a.distance_bucket - b.distance_bucket),
      };
    });

    const overallTargets = ranges.reduce((s, r) => s + r.totalTargets, 0);
    const overallHits = ranges.reduce((s, r) => s + (r.accuracy ? r.accuracy * r.totalTargets : 0), 0);
    const overallAccuracy = overallTargets > 0 ? overallHits / overallTargets : null;

    // Best range = highest accuracy with at least some volume (fallback to null if none)
    const bestRange = ranges.filter((r) => r.totalTargets > 0 && r.accuracy != null).sort((a, b) => b.accuracy! - a.accuracy!)[0] ?? null;

    // Most active = most targets
    const mostActiveRange = ranges.filter((r) => r.totalTargets > 0).sort((a, b) => b.totalTargets - a.totalTargets)[0] ?? null;

    const maxTargetsAcrossRanges = Math.max(1, ...ranges.map((r) => r.totalTargets));

    // Top 8 buckets across all ranges (by targets) for an optional details section
    const allBuckets = ranges.flatMap((r) =>
      r.buckets.map((b) => ({
        bucket: b.distance_bucket,
        targets: b.targets,
        rate: b.first_shot_hit_rate,
      })),
    );
    const topBuckets = allBuckets
      .filter((b) => (b.targets ?? 0) > 0)
      .sort((a, b) => b.targets - a.targets)
      .slice(0, 8);

    return { ranges, overallAccuracy, bestRange, mostActiveRange, maxTargetsAcrossRanges, topBuckets };
  }, [firstShotMatrix]);

  const textMuted = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const border = theme === "dark" ? "border-zinc-700" : "border-gray-200";
  const cardBg = theme === "dark" ? "bg-zinc-900/90" : "bg-white";
  const softBg = theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50";

  const fmtPct = (v: number | null, d = 0) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);

  return (
    <div className={`rounded-xl p-4 md:p-5 border ${border} ${cardBg}`}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h4 className={`text-base md:text-lg font-semibold ${textMain}`}>First Shot Matrix (Summary)</h4>
          <p className={`text-xs md:text-sm ${textMuted}`}>Aggregated by distance range</p>
        </div>
        <button
          onClick={() => setShowDetails((s) => !s)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs border ${border} ${
            theme === "dark" ? "hover:bg-zinc-800/60" : "hover:bg-gray-100"
          }`}
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showDetails ? "Hide details" : "Show details"}
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Highlight icon={Crosshair} title="Overall Accuracy" value={fmtPct(overallAccuracy, 0)} theme={theme} />
        <Highlight icon={Target} title="Best Range" value={bestRange ? `${bestRange.key}m · ${fmtPct(bestRange.accuracy, 0)}` : "—"} theme={theme} />
        <Highlight
          icon={Activity}
          title="Most Active"
          value={mostActiveRange ? `${mostActiveRange.key}m · ${mostActiveRange.totalTargets} targets` : "—"}
          theme={theme}
        />
      </div>

      {/* 4 Range Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ranges.map((r) => (
          <RangeCard
            key={r.key}
            label={`${r.key}m`}
            accuracy={r.accuracy}
            targets={r.totalTargets}
            maxTargets={maxTargetsAcrossRanges}
            theme={theme}
          />
        ))}
      </div>

      {/* Optional minimal details (collapsed by default) */}
      {showDetails && (
        <div className={`mt-4 p-3 rounded-lg ${softBg} border ${border}`}>
          <div className={`text-xs font-medium mb-2 ${textMuted}`}>Top buckets by volume</div>
          {topBuckets.length === 0 ? (
            <div className={`text-xs ${textMuted}`}>No data available.</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {topBuckets.map((b) => {
                const rateStr = b.rate == null ? "—" : `${Math.round(b.rate * 100)}%`;
                return (
                  <span
                    key={b.bucket}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border ${border} ${
                      theme === "dark" ? "bg-zinc-900/70" : "bg-white"
                    }`}
                    title={`${b.bucket}m • ${b.targets} targets • ${rateStr}`}
                  >
                    <span className={`font-medium ${textMain}`}>{b.bucket}m</span>
                    <span className={`${textMuted}`}>·</span>
                    <span className={`${textMuted}`}>{b.targets}t</span>
                    <span className={`${textMuted}`}>·</span>
                    <span className="text-emerald-500">{rateStr}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Highlight({ icon: Icon, title, value, theme }: { icon: any; title: string; value: string; theme: string }) {
  const textMuted = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const bg = theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50";
  const border = theme === "dark" ? "border-zinc-700" : "border-gray-200";
  return (
    <div className={`rounded-xl p-3 flex items-center gap-3 ${bg} border ${border}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-zinc-900/60" : "bg-white"} border ${border}`}>
        <Icon className={textMuted} size={16} />
      </div>
      <div className="min-w-0">
        <div className={`text-xs ${textMuted}`}>{title}</div>
        <div className={`text-lg font-semibold truncate ${textMain}`}>{value}</div>
      </div>
    </div>
  );
}

function RangeCard({
  label,
  accuracy,
  targets,
  maxTargets,
  theme,
}: {
  label: string;
  accuracy: number | null;
  targets: number;
  maxTargets: number;
  theme: string;
}) {
  const textMuted = theme === "dark" ? "text-zinc-400" : "text-gray-600";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const bg = theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50";
  const border = theme === "dark" ? "border-zinc-700" : "border-gray-200";

  const pct = accuracy == null ? "—" : `${Math.round(accuracy * 100)}%`;
  const width = Math.max(6, Math.round((targets / Math.max(1, maxTargets)) * 100)); // visual weight

  return (
    <div className={`rounded-xl p-4 ${bg} border ${border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs ${textMuted}`}>{label}</div>
        <div className={`text-xs ${textMuted}`}>{targets} targets</div>
      </div>

      <div className={`text-2xl font-bold mb-2 ${textMain}`}>{pct}</div>

      {/* Activity bar */}
      <div className={`h-2 rounded-full w-full ${theme === "dark" ? "bg-zinc-900/60" : "bg-white"} border ${border}`}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background:
              theme === "dark"
                ? "linear-gradient(90deg, rgba(34,197,94,0.65) 0%, rgba(34,197,94,0.35) 100%)"
                : "linear-gradient(90deg, rgba(16,185,129,0.9) 0%, rgba(16,185,129,0.5) 100%)",
          }}
        />
      </div>
    </div>
  );
}
