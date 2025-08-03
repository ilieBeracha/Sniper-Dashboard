import React, { useState, useMemo, useEffect } from "react";
import { Users, User, ChevronDown, ChevronRight } from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { CommanderTeamDispersionEntry } from "@/types/performance";
import { getEnumValues } from "@/services/supabaseEnums";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import NoDataDisplay from "./base/BaseNoData";

const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface CommanderTeamDispersionTableProps {
  theme: string;
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
}

const CommanderTeamDispersionTable: React.FC<CommanderTeamDispersionTableProps> = ({
  theme,
  data,
  selectedWeapon,
  selectedPosition,
  selectedDayPeriod,
  onWeaponChange,
  onPositionChange,
  onDayPeriodChange,
}) => {
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

  const getColor = (cm: number | null) => {
    if (cm == null) return "#999999";
    if (cm <= 3) return "#2CB67D";
    if (cm <= 5) return "#FF8906";
    return "#F25F4C";
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
      });

      // Add user rows if expanded
      if (isExpanded) {
        users.forEach((user) => {
          rows.push({
            ...user,
            id: user.user_id,
            parentSquad: squadName,
          });
        });
      }
    });

    return rows;
  }, [data, expandedSquads]);

  const columns: SpTableColumn<TableRow>[] = [
    {
      key: "first_name",
      label: "Hierarchy",
      render: (_, row) => {
        if (row.isSquadHeader) {
          return (
            <div className="flex items-center gap-1 sm:gap-3 py-3">
              {row.isExpanded ? (
                <ChevronDown className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <span className="font-semibold text-xs sm:text-sm">{row.first_name}</span>
              <span
                className={`text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ml-1 sm:ml-2 ${theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"}`}
              >
                {row.userCount}
                <span className="hidden sm:inline"> user{row.userCount !== 1 ? "s" : ""}</span>
              </span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1 sm:gap-2 pl-6 py-3 sm:pl-12">
            <User className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
            <span className="text-xs sm:text-sm">
              <span className="sm:hidden">
                {row.first_name.charAt(0)}. {row.last_name}
              </span>
              <span className="hidden sm:inline">
                {row.first_name} {row.last_name}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "total_median",
      label: "Total",
      render: (value) => (
        <span className="font-semibold text-xs sm:text-sm" style={{ color: getColor(value) }}>
          {value != null ? (
            <>
              <span className="sm:hidden">{value.toFixed(1)}</span>
              <span className="hidden sm:inline">{value.toFixed(2)}cm</span>
            </>
          ) : (
            "–"
          )}
        </span>
      ),
    },
    {
      key: "median_effort_false",
      label: "Effort: No",
      hideOnMobile: true,
      render: (value) => (
        <span className="font-semibold text-xs sm:text-sm" style={{ color: getColor(value) }}>
          {value != null ? `${value.toFixed(2)}cm` : "–"}
        </span>
      ),
    },
    {
      key: "median_effort_true",
      label: "Effort: Yes",
      hideOnMobile: true,
      render: (value) => (
        <span className="font-semibold text-xs sm:text-sm" style={{ color: getColor(value) }}>
          {value != null ? `${value.toFixed(2)}cm` : "–"}
        </span>
      ),
    },
    {
      key: "median_type_timed",
      label: "Timed",
      render: (value) => (
        <span className="font-semibold text-xs sm:text-sm" style={{ color: getColor(value) }}>
          {value != null ? (
            <>
              <span className="sm:hidden">{value.toFixed(1)}</span>
              <span className="hidden sm:inline">{value.toFixed(2)}cm</span>
            </>
          ) : (
            "–"
          )}
        </span>
      ),
    },
  ];

  return (
    <BaseDashboardCard
      tooltipContent="View of multiple median metrics per user in each squad"
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

export default CommanderTeamDispersionTable;
