import { useEffect, useState, useCallback } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import UserRoleAccuracyTable from "./UserRoleAccuracyTable";
import { Search } from "lucide-react";
import { GroupingStatsCommander } from "@/types/performance";
import { PositionScore } from "@/types/user";
import { Input } from "@headlessui/react";
import { DatePicker, DateValue } from "@heroui/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { squadStore } from "@/store/squadStore";
import { getSquads } from "@/services/squadService";
import BaseSelect from "./base/BaseSelect";

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */
const CommanderView = () => {
  /* ------------------------------------------------------------------ */
  /* stores & theme                                                      */
  /* ------------------------------------------------------------------ */
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const {
    commanderUserRoleBreakdown,
    fetchCommanderUserRoleBreakdown,
    getGroupingStatsByTeamIdCommander,
    getUserMediansInSquad,
    groupingStatsCommander,
    userMediansInSquad,
  } = useStore(performanceStore);
  const { squads } = useStore(squadStore);

  /* ------------------------------------------------------------------ */
  /* local state – search / sort / basic effort filter                  */
  /* ------------------------------------------------------------------ */
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"dispersion" | "effort" | "groups" | "time">("dispersion");
  const [filterEffort, setFilterEffort] = useState<"all" | "high" | "medium" | "low">("all");

  /* ------------------------------------------------------------------ */
  /* NEW state – full RPC filter set                                    */
  /* ------------------------------------------------------------------ */
  const [weaponId, setWeaponId] = useState<string | null>(null);
  const [effort, setEffort] = useState<string | null>(null); // “slow”, “medium”, “rapid” etc.
  const [shotType, setShotType] = useState<string | null>(null); // “single”, “burst”, …
  const [position, setPosition] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* initial load – NO median call here any more                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      if (!user?.team_id) return;
      await fetchCommanderUserRoleBreakdown(user.team_id);
      await getSquads(user.team_id);
      // Set default squad if user has one
      if (user.squad_id) {
        setSelectedSquadId(user.squad_id);
      }
      setLoading(false);
    })();
  }, [user?.team_id]);

  /* ------------------------------------------------------------------ */
  /* fetch grouping stats whenever dates change                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user?.team_id) return;
    getGroupingStatsByTeamIdCommander(user.team_id, startDate || new Date(), endDate || new Date());
  }, [user?.team_id, startDate, endDate]);

  /* ------------------------------------------------------------------ */
  /* fetch medians whenever any filter changes                          */
  /* ------------------------------------------------------------------ */
  const grabMedians = useCallback(async () => {
    if (!selectedSquadId) return;
    await getUserMediansInSquad(selectedSquadId, weaponId, effort, shotType, position, startDate, endDate);
  }, [selectedSquadId, weaponId, effort, shotType, position, startDate, endDate]);

  useEffect(() => {
    grabMedians();
  }, [grabMedians]);

  /* ------------------------------------------------------------------ */
  /* set initial position based on squad                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!selectedSquadId || !squads) return;
    const squad = squads.find((s) => s.id === selectedSquadId);
    if (squad && !position) {
      setPosition(squad.squad_name);
    }
  }, [selectedSquadId, squads]);

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const getDispersionColor = (d: number) => (d <= 3 ? "text-green-500" : d <= 5 ? "text-amber-500" : "text-red-500");

  const getPerformanceRating = (s: GroupingStatsCommander) => {
    const dispersionScore = s.avg_dispersion ? Math.max(0, 100 - s.avg_dispersion * 10) : 0;
    const effortScore = (s.effort_percentage || 0) * 2;
    const consistencyScore = s.best_dispersion && s.worst_dispersion ? Math.max(0, 100 - (s.worst_dispersion - s.best_dispersion) * 5) : 0;
    return Math.round((dispersionScore + effortScore + consistencyScore) / 3);
  };

  /* ------------------------------------------------------------------ */
  /* derived list with search / sort / effort                           */
  /* ------------------------------------------------------------------ */
  const filteredAndSortedStats = groupingStatsCommander
    ?.filter((stat) => {
      /* search name */
      const fullName = `${stat.first_name} ${stat.last_name}`.toLowerCase();
      if (!fullName.includes(searchTerm.toLowerCase())) return false;

      /* effort band */
      if (filterEffort === "high" && (stat.effort_percentage || 0) < 20) return false;
      if (filterEffort === "medium" && ((stat.effort_percentage || 0) < 10 || (stat.effort_percentage || 0) >= 20)) return false;
      if (filterEffort === "low" && (stat.effort_percentage || 0) >= 10) return false;

      /* filter by squad if selected */
      if (selectedSquadId) {
        const userData = commanderUserRoleBreakdown?.find(
          (u) => u.first_name.trim() === stat.first_name.trim() && u.last_name.trim() === stat.last_name.trim(),
        );
        const selectedSquad = squads?.find((s) => s.id === selectedSquadId);
        if (userData && selectedSquad && userData.squad_name !== selectedSquad.squad_name) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dispersion":
          return (a.avg_dispersion || Infinity) - (b.avg_dispersion || Infinity);
        case "effort":
          return (b.effort_percentage || 0) - (a.effort_percentage || 0);
        case "groups":
          return b.total_groups - a.total_groups;
        case "time":
          return (a.avg_time_seconds || Infinity) - (b.avg_time_seconds || Infinity);
        default:
          return 0;
      }
    });

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col gap-6">
      {/* 1️⃣  Filters */}

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl mx-auto">
        {/* search */}
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 h-11 rounded-lg shadow-sm border-0 ${
            theme === "dark" ? "bg-zinc-800/50 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
          }`}
        />

        {/* sort by */}
        <BaseSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "dispersion" | "effort" | "groups" | "time")}
          options={[
            { label: "Best Dispersion", value: "dispersion" },
            { label: "Highest Effort", value: "effort" },
            { label: "Most Groups", value: "groups" },
            { label: "Fastest Time", value: "time" },
          ]}
          placeholder="Sort by"
        />
        <BaseSelect
          value={filterEffort}
          onChange={(e) => setFilterEffort(e.target.value as "all" | "high" | "medium" | "low")}
          options={[
            { label: "All Efforts", value: "all" },
            { label: "High Effort", value: "high" },
            { label: "Medium Effort", value: "medium" },
            { label: "Low Effort", value: "low" },
          ]}
          placeholder="Filter Effort"
        />

        {/* NEW – full RPC filters (weapon, effort, type, position, dates) */}
        {/* weapon */}
        <Input
          className="w-44 h-11 bg-gray-50 dark:bg-zinc-800/50 rounded-lg shadow-sm"
          placeholder="Weapon ID"
          value={weaponId ?? ""}
          onChange={(e) => setWeaponId(e.target.value || null)}
        />
        {/* effort literal */}
        <Input
          className="w-32 h-11 bg-gray-50 dark:bg-zinc-800/50 rounded-lg shadow-sm"
          placeholder="Effort"
          value={effort ?? ""}
          onChange={(e) => setEffort(e.target.value || null)}
        />
        {/* type */}
        <Input
          className="w-32 h-11 bg-gray-50 dark:bg-zinc-800/50 rounded-lg shadow-sm"
          placeholder="Type"
          value={shotType ?? ""}
          onChange={(e) => setShotType(e.target.value || null)}
        />
        {/* position enum */}
        <BaseSelect
          value={position || ""}
          onChange={(e) => setPosition(e.target.value || null)}
          options={Object.values(PositionScore).map((p) => ({ label: p, value: p }))}
          placeholder="Position"
        />
        {/* dates */}
        <DatePicker label="Start" value={startDate as unknown as DateValue} onChange={(v) => setStartDate(v as unknown as Date | null)} />
        <DatePicker label="End" value={endDate as unknown as DateValue} onChange={(v) => setEndDate(v as unknown as Date | null)} />
      </div>

      {/* 2️⃣  Grouping stats list */}
      {filteredAndSortedStats?.length ? (
        <div className="space-y-8 max-w-6xl mx-auto">
          {filteredAndSortedStats.map((stat, idx) => {
            const perf = getPerformanceRating(stat);
            const hasData = stat.total_groups > 0;

            /* find user‑level median row (single lookup, O(1) with Map in prod) */
            const medianRec = userMediansInSquad?.find((m) => m.user_id === stat.sniper_user_id);

            const userData = commanderUserRoleBreakdown?.find(
              (u) => u.first_name.trim() === stat.first_name.trim() && u.last_name.trim() === stat.last_name.trim(),
            );

            return (
              <div key={stat.sniper_user_id} className={`group ${!hasData && "opacity-50"}`}>
                {/* header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {/* name / counts */}
                  <div className="flex gap-4 items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        theme === "dark" ? "bg-zinc-800 text-gray-400" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {stat.first_name[0]}
                      {stat.last_name[0]}
                    </div>
                    <div>
                      <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {stat.first_name} {stat.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex gap-1 items-center">
                        {hasData ? `${stat.total_groups} groups` : "No data"}
                        {userData && (
                          <>
                            <span className="mx-1">•</span>
                            {userData.role_or_weapon}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* performance score */}
                  {hasData && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Performance</span>
                      <span className={`text-2xl font-light ${perf >= 70 ? "text-green-500" : perf >= 50 ? "text-amber-500" : "text-red-500"}`}>
                        {perf}%
                      </span>
                    </div>
                  )}
                </div>

                {/* metrics */}
                {hasData && (
                  <div className="flex flex-wrap gap-x-12 gap-y-4 pl-14 mt-4">
                    {/* median dispersion */}
                    {medianRec && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">Median:</span>
                        <span className={`text-lg font-light ${getDispersionColor(medianRec.median_cm_dispersion)}`}>
                          {medianRec.median_cm_dispersion.toFixed(1)}cm
                        </span>
                      </div>
                    )}

                    {/* avg dispersion */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">Avg&nbsp;dispersion:</span>
                      <span className={`text-lg font-light ${getDispersionColor(stat.avg_dispersion)}`}>{stat.avg_dispersion.toFixed(1)}cm</span>
                      <span className="text-xs text-gray-500">
                        ({stat.best_dispersion}-{stat.worst_dispersion})
                      </span>
                    </div>

                    {/* avg bullets */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">Avg&nbsp;bullets:</span>
                      <span className="text-lg font-light">{stat.avg_bullets.toFixed(1)}</span>
                    </div>

                    {/* avg time */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">Avg&nbsp;time:</span>
                      <span className="text-lg font-light">{stat.avg_time_seconds.toFixed(1)}s</span>
                    </div>

                    {/* effort percentage */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">Effort:</span>
                      <span
                        className={`text-lg font-light ${stat.effort_percentage >= 20 ? "text-green-500" : stat.effort_percentage >= 10 ? "text-amber-500" : "text-red-500"}`}
                      >
                        {stat.effort_percentage.toFixed(0)}%
                      </span>
                    </div>

                    {/* mistakes */}
                    {stat.mistake_count !== null && stat.mistake_count > 0 && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">Top&nbsp;mistake:</span>
                        <span className="text-sm font-light text-amber-600">
                          {stat.top_mistake} ({stat.mistake_count})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* divider */}
                {idx < filteredAndSortedStats.length - 1 && <div className={`mt-8 h-px ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-200/50"}`} />}
              </div>
            );
          })}
        </div>
      ) : (
        /* empty */
        <div className="text-center py-20">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>No results found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* accuracy breakdown */}
      <UserRoleAccuracyTable loading={loading} commanderUserRoleBreakdown={commanderUserRoleBreakdown} theme={theme} />
    </div>
  );
};

export default CommanderView;
