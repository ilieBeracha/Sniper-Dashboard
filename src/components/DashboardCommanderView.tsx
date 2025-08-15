import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useTheme } from "@/contexts/ThemeContext";
import UserRoleAccuracyTable from "./UserRoleAccuracyTable";
import { getSquads } from "@/services/squadService";
import CommanderTeamDispersionEnhanced from "./CommanderTeamDispersionEnhanced";
import CommanderStatsOverview from "./CommanderStatsOverview";
import CommanderPerformanceGrid from "./CommanderPerformanceGrid";
import { Calendar, Download, RefreshCw } from "lucide-react";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { commanderUserRoleBreakdown, fetchCommanderUserRoleBreakdown, commanderTeamDispersion } = useStore(performanceStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weaponType, setWeaponType] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [dayPeriod, setDayPeriod] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "detailed">("overview");

  // Set default date range to last month
  useEffect(() => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    setStartDate(lastMonth);
    setEndDate(now);
  }, []);

  useEffect(() => {
    if (!user?.team_id) return;

    const formattedStart = startDate?.toISOString().split("T")[0] ?? null;
    const formattedEnd = endDate?.toISOString().split("T")[0] ?? null;

    performanceStore.getState().fetchCommanderTeamDispersion(user.team_id, {
      startDate: formattedStart ?? undefined,
      endDate: formattedEnd ?? undefined,
      weaponType: weaponType ?? undefined,
      position: position ?? undefined,
      dayPeriod: dayPeriod ?? undefined,
    });
  }, [user?.team_id, startDate, endDate, weaponType, position, dayPeriod]);

  useEffect(() => {
    (async () => {
      if (!user?.team_id) return;
      await Promise.all([
        fetchCommanderUserRoleBreakdown(user.team_id),
        getSquads(user.team_id),
        fetchMembers(user.team_id),
        getSquadsWithUsersByTeamId(user.team_id)
      ]);
      setLoading(false);
    })();
  }, [user?.team_id, fetchCommanderUserRoleBreakdown]);

  const handleRefresh = async () => {
    if (!user?.team_id || isRefreshing) return;
    setIsRefreshing(true);
    await Promise.all([
      fetchCommanderUserRoleBreakdown(user.team_id),
      getSquads(user.team_id),
      fetchMembers(user.team_id),
      getSquadsWithUsersByTeamId(user.team_id)
    ]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Team Performance Dashboard
          </h2>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Monitor and analyze your team's shooting performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className={`flex rounded-lg p-1 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
            <button
              onClick={() => setActiveView("overview")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                activeView === "overview"
                  ? theme === "dark" 
                    ? "bg-zinc-700 text-white" 
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-zinc-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView("detailed")}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                activeView === "detailed"
                  ? theme === "dark" 
                    ? "bg-zinc-700 text-white" 
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-zinc-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Detailed
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-all ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            } ${isRefreshing ? "animate-spin" : ""}`}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            className={`p-2 rounded-lg transition-all ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className={`flex items-center gap-2 p-3 rounded-lg ${
        theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-gray-50 border border-gray-200"
      }`}>
        <Calendar className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
        <span className={`text-sm font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
          {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <CommanderStatsOverview />

          {/* Performance Grid */}
          {activeView === "overview" && (
            <CommanderPerformanceGrid 
              userRoleData={commanderUserRoleBreakdown}
              dispersionData={commanderTeamDispersion}
            />
          )}

          {/* Detailed Tables */}
          <div className={`space-y-6 ${activeView === "overview" ? "hidden" : ""}`}>
            <CommanderTeamDispersionEnhanced
              data={commanderTeamDispersion}
              selectedWeapon={weaponType || ""}
              selectedPosition={position || ""}
              selectedDayPeriod={dayPeriod || ""}
              onWeaponChange={setWeaponType}
              onPositionChange={setPosition}
              onDayPeriodChange={setDayPeriod}
            />
            <UserRoleAccuracyTable 
              loading={false} 
              commanderUserRoleBreakdown={commanderUserRoleBreakdown} 
              theme={theme} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CommanderView;
