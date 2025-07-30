import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import UserRoleAccuracyTable from "./UserRoleAccuracyTable";
import { Search, Zap } from "lucide-react";
import { GroupingStatsCommander } from "@/types/performance";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const {
    squadMajorityPerformance,
    fetchSquadMajorityPerformance,
    commanderUserRoleBreakdown,
    fetchCommanderUserRoleBreakdown,
    getGroupingStatsByTeamIdCommander,
    groupingStatsCommander,
  } = useStore(performanceStore);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"dispersion" | "effort" | "groups" | "time">("dispersion");
  const [filterEffort, setFilterEffort] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await fetchSquadMajorityPerformance(user.team_id);
      await fetchCommanderUserRoleBreakdown(user.team_id);
      await getGroupingStatsByTeamIdCommander(user.team_id, new Date("2025-01-01"), new Date("2025-01-31"));
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  useEffect(() => {
    if (groupingStatsCommander) {
      console.log(squadMajorityPerformance);
      console.log(groupingStatsCommander);
    }
  }, [groupingStatsCommander]);

  // Filter and sort grouping stats
  const filteredAndSortedStats = groupingStatsCommander
    ?.filter((stat) => {
      // Filter by search term
      const fullName = `${stat.first_name} ${stat.last_name}`.toLowerCase();
      if (!fullName.includes(searchTerm.toLowerCase())) return false;

      // Filter by effort percentage
      if (filterEffort === "high" && (stat.effort_percentage || 0) < 20) return false;
      if (filterEffort === "medium" && ((stat.effort_percentage || 0) < 10 || (stat.effort_percentage || 0) >= 20)) return false;
      if (filterEffort === "low" && (stat.effort_percentage || 0) >= 10) return false;

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

  const getDispersionColor = (dispersion: number) => {
    if (dispersion <= 3) return "text-green-500";
    if (dispersion <= 5) return "text-amber-500";
    return "text-red-500";
  };

  const getPerformanceRating = (stat: GroupingStatsCommander) => {
    const dispersionScore = stat.avg_dispersion ? Math.max(0, 100 - stat.avg_dispersion * 10) : 0;
    const effortScore = (stat.effort_percentage || 0) * 2;
    const consistencyScore =
      stat.best_dispersion && stat.worst_dispersion ? Math.max(0, 100 - (stat.worst_dispersion - stat.best_dispersion) * 5) : 0;

    return Math.round((dispersionScore + effortScore + consistencyScore) / 3);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}

      {/* Grouping Stats Section */}
      {groupingStatsCommander && groupingStatsCommander.length > 0 && (
        <div className="max-w-6xl mx-auto">
          {/* Section Header - minimal and clean */}
          <div className="mb-12 text-center">
            <h2 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>GROUPING ANALYSIS</h2>
            <div className={`h-px w-20 mx-auto ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />
          </div>

          {/* Filters - floating style */}
          <div className="mb-12 flex justify-center">
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-4xl">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`h-11 border-0 rounded-lg shadow-sm ${
                    theme === "dark" ? "bg-zinc-800/50 text-white placeholder:text-gray-500" : "bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              </div>

              <div className="flex gap-3 justify-center lg:justify-end">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger
                    className={`w-44 h-11 border-0 rounded-lg shadow-sm ${
                      theme === "dark" ? "bg-zinc-800/50 text-white" : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dispersion">Best Dispersion</SelectItem>
                    <SelectItem value="effort">Highest Effort</SelectItem>
                    <SelectItem value="groups">Most Groups</SelectItem>
                    <SelectItem value="time">Fastest Time</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter */}
                <Select value={filterEffort} onValueChange={(value: any) => setFilterEffort(value)}>
                  <SelectTrigger
                    className={`w-44 h-11 border-0 rounded-lg shadow-sm ${
                      theme === "dark" ? "bg-zinc-800/50 text-white" : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    <SelectValue placeholder="Filter..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Efforts</SelectItem>
                    <SelectItem value="high">High ≥20%</SelectItem>
                    <SelectItem value="medium">Medium 10-19%</SelectItem>
                    <SelectItem value="low">Low &lt;10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Grid - minimal dashboard style */}
          <div className="space-y-8">
            {filteredAndSortedStats?.map((stat, idx) => {
              const performanceRating = getPerformanceRating(stat);
              const hasData = stat.total_groups > 0;

              // Find matching user data from commanderUserRoleBreakdown
              const userData = commanderUserRoleBreakdown?.find(
                (user) => user.first_name.trim() === stat.first_name.trim() && user.last_name.trim() === stat.last_name.trim(),
              );

              return (
                <div key={idx} className={`group ${!hasData ? "opacity-50" : ""}`}>
                  {/* Sniper Row - simpler layout */}
                  <div className="flex flex-col gap-6">
                    {/* Header with name and score */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            theme === "dark" ? "bg-zinc-800 text-gray-400" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {stat.first_name.charAt(0)}
                          {stat.last_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {stat.first_name} {stat.last_name}
                          </h3>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                            {hasData ? `${stat.total_groups} groups` : "No data"}
                            {userData && (
                              <>
                                <span className={`mx-1 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>•</span>
                                {userData.role_or_weapon}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Performance Score */}
                      {hasData && (
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Performance</span>
                          <div
                            className={`text-2xl font-light ${
                              performanceRating >= 70 ? "text-green-500" : performanceRating >= 50 ? "text-amber-500" : "text-red-500"
                            }`}
                          >
                            {performanceRating}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metrics - flowing layout */}
                    {hasData && (
                      <div className="flex flex-wrap gap-x-12 gap-y-4 pl-14">
                        {/* Hit Accuracy if available */}
                        {userData && (
                          <div className="flex items-baseline gap-2">
                            <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Accuracy:</span>
                            <span
                              className={`text-lg font-light ${
                                userData.hit_percentage >= 75 ? "text-green-500" : userData.hit_percentage >= 50 ? "text-amber-500" : "text-red-500"
                              }`}
                            >
                              {userData.hit_percentage.toFixed(0)}%
                            </span>
                            <span className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}>
                              ({userData.hits}/{userData.shots})
                            </span>
                          </div>
                        )}

                        {/* Dispersion */}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Dispersion:</span>
                          <span className={`text-lg font-light ${getDispersionColor(stat.avg_dispersion)}`}>{stat.avg_dispersion.toFixed(1)}cm</span>
                          <span className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}>
                            ({stat.best_dispersion}-{stat.worst_dispersion})
                          </span>
                        </div>

                        {/* Sessions if available */}
                        {userData && (
                          <div className="flex items-baseline gap-2">
                            <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Sessions:</span>
                            <span className={`text-lg font-light ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{userData.sessions}</span>
                          </div>
                        )}

                        {/* Bullets */}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Avg bullets:</span>
                          <span className={`text-lg font-light ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {stat.avg_bullets.toFixed(1)}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Avg time:</span>
                          <span className={`text-lg font-light ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {stat.avg_time_seconds.toFixed(0)}s
                          </span>
                        </div>

                        {/* Effort */}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Effort:</span>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm ${
                              stat.effort_percentage >= 20
                                ? theme === "dark"
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-green-100 text-green-700"
                                : stat.effort_percentage >= 10
                                  ? theme === "dark"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-amber-100 text-amber-700"
                                  : theme === "dark"
                                    ? "bg-gray-500/10 text-gray-400"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            {stat.effort_percentage?.toFixed(0) || 0}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtle divider */}
                  {idx < filteredAndSortedStats.length - 1 && (
                    <div className={`mt-8 h-px ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-200/50"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state - minimal */}
          {filteredAndSortedStats?.length === 0 && (
            <div className="text-center py-20">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}
              >
                <Search className="w-8 h-8 opacity-40" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>No results found</h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* User Accuracy by Role */}
      <UserRoleAccuracyTable loading={loading} commanderUserRoleBreakdown={commanderUserRoleBreakdown} theme={theme} />
    </div>
  );
};

export default CommanderView;
