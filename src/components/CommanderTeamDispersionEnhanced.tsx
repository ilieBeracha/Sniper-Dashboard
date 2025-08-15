import React, { useState, useMemo, useEffect } from "react";
import { Users, User, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { CommanderTeamDispersionEntry } from "@/types/performance";
import { getEnumValues } from "@/services/supabaseEnums";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import NoDataDisplay from "./base/BaseNoData";
import { useTheme } from "@/contexts/ThemeContext";

const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface CommanderTeamDispersionEnhancedProps {
  data: CommanderTeamDispersionEntry[] | null;
  selectedWeapon: string;
  selectedPosition: string;
  selectedDayPeriod: string;
  onWeaponChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onDayPeriodChange: (value: string) => void;
}

interface TableRow extends CommanderTeamDispersionEntry {
  id: string;
  isSquadHeader?: boolean;
  userCount?: number;
  isExpanded?: boolean;
  parentSquad?: string;
  performanceLevel?: "excellent" | "good" | "warning" | "critical";
}

const CommanderTeamDispersionEnhanced: React.FC<CommanderTeamDispersionEnhancedProps> = ({
  data,
  selectedWeapon,
  selectedPosition,
  selectedDayPeriod,
  onWeaponChange,
  onPositionChange,
  onDayPeriodChange,
}) => {
  const { theme } = useTheme();
  const [expandedSquads, setExpandedSquads] = useState<Set<string>>(new Set());
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const weaponsEnums = await getEnumValues("weapon_names");
      const positionsEnums = await getEnumValues("positions");

      setWeaponTypes(weaponsEnums);
      setPositions(positionsEnums);
    })();
  }, []);

  const toggleSquad = (squadName: string) => {
    const updated = new Set(expandedSquads);
    updated.has(squadName) ? updated.delete(squadName) : updated.add(squadName);
    setExpandedSquads(updated);
  };

  const getPerformanceLevel = (cm: number | null): "excellent" | "good" | "warning" | "critical" => {
    if (cm == null) return "warning";
    if (cm <= 3) return "excellent";
    if (cm <= 5) return "good";
    if (cm <= 7) return "warning";
    return "critical";
  };

  const getColor = (cm: number | null) => {
    const level = getPerformanceLevel(cm);
    switch (level) {
      case "excellent": return "#10b981";
      case "good": return "#3b82f6";
      case "warning": return "#f59e0b";
      case "critical": return "#ef4444";
    }
  };

  const calculateSquadAverages = (users: CommanderTeamDispersionEntry[]) => {
    const validAvg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
    };
    return {
      total_median: validAvg(users.map((u) => u.total_median)),
      median_effort_false: validAvg(users.map((u) => u.median_effort_false)),
      median_effort_true: validAvg(users.map((u) => u.median_effort_true)),
      median_type_timed: validAvg(users.map((u) => u.median_type_timed)),
    };
  };

  // Transform data into flat structure for SpTable
  const tableData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = new Map<string, CommanderTeamDispersionEntry[]>();
    data.forEach((entry) => {
      if (!grouped.has(entry.squad_name)) grouped.set(entry.squad_name, []);
      grouped.get(entry.squad_name)!.push(entry);
    });

    const rows: TableRow[] = [];

    Array.from(grouped.entries()).forEach(([squadName, users]) => {
      const squadAvg = calculateSquadAverages(users);
      const isExpanded = expandedSquads.has(squadName);

      // Add squad header row
      rows.push({
        id: `squad-${squadName}`,
        user_id: `squad-${squadName}`,
        first_name: squadName,
        last_name: "",
        squad_name: squadName,
        total_median: squadAvg.total_median,
        median_effort_false: squadAvg.median_effort_false,
        median_effort_true: squadAvg.median_effort_true,
        median_type_timed: squadAvg.median_type_timed,
        weapon_type: null,
        shooting_position: null,
        day_period: null,
        isSquadHeader: true,
        userCount: users.length,
        isExpanded,
        performanceLevel: getPerformanceLevel(squadAvg.total_median),
      });

      // Add user rows if expanded
      if (isExpanded) {
        users.forEach((user) => {
          rows.push({
            ...user,
            id: user.user_id,
            parentSquad: squadName,
            performanceLevel: getPerformanceLevel(user.total_median),
          });
        });
      }
    });

    return rows;
  }, [data, expandedSquads]);

  const columns: SpTableColumn<TableRow>[] = [
    {
      key: "first_name",
      label: "Team Hierarchy",
      width: "35%",
      render: (_, row) => {
        if (row.isSquadHeader) {
          return (
            <div className="flex items-center gap-3 py-3">
              <button className="p-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
                {row.isExpanded ? (
                  <ChevronDown className="text-blue-500 w-5 h-5" />
                ) : (
                  <ChevronRight className="text-gray-500 w-5 h-5" />
                )}
              </button>
              <div className={`p-2 rounded-lg ${
                theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
              }`}>
                <Users className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{row.first_name}</span>
                <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  {row.userCount} members • Squad Average
                </span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-3 pl-12 py-3">
            <div className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-green-900/20" : "bg-green-50"
            }`}>
              <User className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {row.first_name} {row.last_name}
              </span>
              <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                Individual Performance
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "total_median",
      label: "Overall Performance",
      width: "20%",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm" style={{ color: getColor(value) }}>
                {value != null ? `${value.toFixed(2)}cm` : "—"}
              </span>
              {row.performanceLevel && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  row.performanceLevel === "excellent" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : row.performanceLevel === "good"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : row.performanceLevel === "warning"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {row.performanceLevel}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: value != null ? `${Math.max(10, 100 - (value * 10))}%` : "0%",
                  backgroundColor: getColor(value)
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "median_effort_false",
      label: "Without Effort",
      hideOnMobile: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(value) }} />
          <span className="font-medium text-sm" style={{ color: getColor(value) }}>
            {value != null ? `${value.toFixed(2)}cm` : "—"}
          </span>
        </div>
      ),
    },
    {
      key: "median_effort_true",
      label: "With Effort",
      hideOnMobile: true,
      render: (value, row) => {
        const improvement = row.median_effort_false && value 
          ? ((row.median_effort_false - value) / row.median_effort_false) * 100
          : null;
        
        return (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(value) }} />
              <span className="font-medium text-sm" style={{ color: getColor(value) }}>
                {value != null ? `${value.toFixed(2)}cm` : "—"}
              </span>
            </div>
            {improvement !== null && improvement > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  {improvement.toFixed(0)}% better
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "median_type_timed",
      label: "Timed Performance",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(value) }} />
          <span className="font-medium text-sm" style={{ color: getColor(value) }}>
            {value != null ? `${value.toFixed(2)}cm` : "—"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <BaseDashboardCard
      header={
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-semibold text-lg">Team Dispersion Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Detailed performance metrics by squad and individual
            </p>
          </div>
        </div>
      }
      tooltipContent="Track shooting dispersion patterns across different conditions and effort levels"
      withFilter={[
        {
          label: "Weapon Type",
          value: "weapon_type",
          onChange: onWeaponChange,
          options: [{ label: "All Weapons", value: "" }, ...weaponTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))],
          type: "select",
        },
        {
          label: "Position",
          value: "position",
          onChange: onPositionChange,
          options: [{ label: "All Positions", value: "" }, ...positions.map((pos) => ({ label: formatEnumLabel(pos), value: pos }))],
          type: "select",
        },
        {
          label: "Day Period",
          value: "day_period",
          onChange: onDayPeriodChange,
          options: [
            { label: "All Periods", value: "" },
            { label: "Day", value: "day" },
            { label: "Night", value: "night" },
          ],
          type: "select",
        },
      ]}
      onClearFilters={() => {
        onWeaponChange("");
        onPositionChange("");
        onDayPeriodChange("");
      }}
      currentFilterValues={{
        weapon_type: selectedWeapon,
        position: selectedPosition,
        day_period: selectedDayPeriod,
      }}
    >
      <SpTable<TableRow>
        data={tableData}
        columns={columns}
        emptyState={<NoDataDisplay />}
        actions={{
          onRowClick: (row) => {
            if (row.isSquadHeader) {
              toggleSquad(row.squad_name);
            }
          },
        }}
        highlightRow={(row) => !!row.parentSquad}
        isDisplayActions={false}
      />
    </BaseDashboardCard>
  );
};

export default CommanderTeamDispersionEnhanced;