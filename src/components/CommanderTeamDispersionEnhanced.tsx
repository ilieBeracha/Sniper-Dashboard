import React, { useState, useMemo, useEffect } from "react";
import { Users, User, ChevronDown, ChevronRight } from "lucide-react";
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
            <div className="flex items-center gap-2 py-1">
              <button className="p-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
                {row.isExpanded ? (
                  <ChevronDown className="text-blue-500 w-4 h-4" />
                ) : (
                  <ChevronRight className="text-gray-500 w-4 h-4" />
                )}
              </button>
              <Users className={`w-3 h-3 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <div className="flex flex-col gap-0">
                <span className="font-semibold text-xs leading-tight">{row.first_name}</span>
                <span className={`text-[10px] leading-tight ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  {row.userCount} members
                </span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 pl-8 py-1">
            <User className={`w-3 h-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
            <span className="text-xs">
              {row.first_name} {row.last_name}
            </span>
          </div>
        );
      },
    },
    {
      key: "total_median",
      label: "Overall Performance",
      width: "20%",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs" style={{ color: getColor(value) }}>
            {value != null ? `${value.toFixed(2)}cm` : "—"}
          </span>
          {row.performanceLevel && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              row.performanceLevel === "excellent" 
                ? "text-green-700 dark:text-green-400"
                : row.performanceLevel === "good"
                ? "text-blue-700 dark:text-blue-400"
                : row.performanceLevel === "warning"
                ? "text-amber-700 dark:text-amber-400"
                : "text-red-700 dark:text-red-400"
            }`}>
              ({row.performanceLevel})
            </span>
          )}
        </div>
      ),
    },
    {
      key: "median_effort_false",
      label: "Without Effort",
      hideOnMobile: true,
      render: (value) => (
        <span className="text-xs" style={{ color: getColor(value) }}>
          {value != null ? `${value.toFixed(2)}cm` : "—"}
        </span>
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
          <div className="flex flex-col gap-0">
            <span className="text-xs" style={{ color: getColor(value) }}>
              {value != null ? `${value.toFixed(2)}cm` : "—"}
            </span>
            {improvement !== null && improvement > 0 && (
              <span className="text-[10px] text-green-600 dark:text-green-400">
                -{improvement.toFixed(0)}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "median_type_timed",
      label: "Timed Performance",
      render: (value) => (
        <span className="text-xs" style={{ color: getColor(value) }}>
          {value != null ? `${value.toFixed(2)}cm` : "—"}
        </span>
      ),
    },
  ];

  return (
    <BaseDashboardCard
      header={
                  <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Team Dispersion Analysis</h3>
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