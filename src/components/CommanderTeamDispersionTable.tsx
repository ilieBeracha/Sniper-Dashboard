import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Users, User } from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import NoDataDisplay from "./base/BaseNoData";
import { CommanderTeamDispersionEntry } from "@/types/performance";
import { getEnumValues } from "@/services/supabaseEnums";

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

const CommanderTeamDispersionTable: React.FC<CommanderTeamDispersionTableProps> = ({ 
  theme, 
  data, 
  selectedWeapon, 
  selectedPosition, 
  selectedDayPeriod, 
  onWeaponChange, 
  onPositionChange, 
  onDayPeriodChange 
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

  const grouped = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const map = new Map<string, CommanderTeamDispersionEntry[]>();
    data.forEach((entry) => {
      if (!map.has(entry.squad_name)) map.set(entry.squad_name, []);
      map.get(entry.squad_name)!.push(entry);
    });
    return Array.from(map.entries());
  }, [data]);

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

  return (
    <BaseDashboardCard 
      header="Median CM Dispersion by Squad" 
      tooltipContent="View of multiple median metrics per user in each squad"
      withFilter={[
        {
          label: "Weapon Type",
          value: "weapon_type",
          onChange: onWeaponChange,
          options: [
            { label: "All Weapons", value: "" },
            ...weaponTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))
          ],
          type: "select",
        },
        {
          label: "Position",
          value: "position",
          onChange: onPositionChange,
          options: [
            { label: "All Positions", value: "" },
            ...positions.map((pos) => ({ label: formatEnumLabel(pos), value: pos }))
          ],
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

      {!data || data.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <div className={`rounded-xl border ${theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"}`}>
          <table className={`min-w-full text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <thead>
              <tr className={`${theme === "dark" ? "bg-zinc-800/50 border-zinc-800" : "bg-gray-50 border-gray-200"} text-xs uppercase border-b`}>
                <th className="text-left p-4 font-medium">Hierarchy</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Effort: No</th>
                <th className="text-left p-4 font-medium">Effort: Yes</th>
                <th className="text-left p-4 font-medium">Timed</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(([squadName, users]) => {
                const expanded = expandedSquads.has(squadName);
                const squadAvg = calculateSquadAverages(users);

                return (
                  <React.Fragment key={squadName}>
                    <tr
                      onClick={() => toggleSquad(squadName)}
                      className={`cursor-pointer border-t ${theme === "dark" ? "border-zinc-800 hover:bg-zinc-800/40" : "hover:bg-blue-50"}`}
                    >
                      <td className="p-4 flex items-center gap-3">
                        {expanded ? <ChevronDown className="text-blue-500" /> : <ChevronRight className="text-gray-500" />}
                        <Users className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                        <span className="font-semibold">{squadName}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ml-2 ${theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                        >
                          {users.length} user{users.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td style={{ color: getColor(squadAvg.total_median) }} className="p-4 font-bold">
                        {squadAvg.total_median != null ? `${squadAvg.total_median.toFixed(2)}cm` : "–"}
                      </td>
                      <td style={{ color: getColor(squadAvg.median_effort_false) }} className="p-4 font-bold">
                        {squadAvg.median_effort_false != null ? `${squadAvg.median_effort_false.toFixed(2)}cm` : "–"}
                      </td>
                      <td style={{ color: getColor(squadAvg.median_effort_true) }} className="p-4 font-bold">
                        {squadAvg.median_effort_true != null ? `${squadAvg.median_effort_true.toFixed(2)}cm` : "–"}
                      </td>
                      <td style={{ color: getColor(squadAvg.median_type_timed) }} className="p-4 font-bold">
                        {squadAvg.median_type_timed != null ? `${squadAvg.median_type_timed.toFixed(2)}cm` : "–"}
                      </td>
                    </tr>

                    {expanded &&
                      users.map((user) => (
                        <tr key={user.user_id} className={`${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50/50"} border-t`}>
                          <td className="p-4 pl-12 flex items-center gap-2">
                            <User className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                            <span>
                              {user.first_name} {user.last_name}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold" style={{ color: getColor(user.total_median) }}>
                              {user.total_median != null ? `${user.total_median.toFixed(2)}cm` : "–"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold" style={{ color: getColor(user.median_effort_false) }}>
                              {user.median_effort_false != null ? `${user.median_effort_false.toFixed(2)}cm` : "–"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold" style={{ color: getColor(user.median_effort_true) }}>
                              {user.median_effort_true != null ? `${user.median_effort_true.toFixed(2)}cm` : "–"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold" style={{ color: getColor(user.median_type_timed) }}>
                              {user.median_type_timed != null ? `${user.median_type_timed.toFixed(2)}cm` : "–"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </BaseDashboardCard>
  );
};

export default CommanderTeamDispersionTable;
