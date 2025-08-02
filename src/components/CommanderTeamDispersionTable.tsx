import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Users, User } from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";
import NoDataDisplay from "./base/BaseNoData";

interface CommanderTeamDispersionEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  median_cm_dispersion: number | null;
  squad_name: string;
  weapon_name: string | null;
  position: string | null;
  effort: boolean | null;
  type: string | null;
  day_period: string | null;
}

interface CommanderTeamDispersionTableProps {
  theme: string;
  data: CommanderTeamDispersionEntry[] | null;
}

const CommanderTeamDispersionTable: React.FC<CommanderTeamDispersionTableProps> = ({ theme, data }) => {
  const [expandedSquads, setExpandedSquads] = useState<Set<string>>(new Set());

  const toggleSquad = (squadName: string) => {
    const updated = new Set(expandedSquads);
    updated.has(squadName) ? updated.delete(squadName) : updated.add(squadName);
    setExpandedSquads(updated);
  };

  const grouped = useMemo(() => {
    const map = new Map<string, CommanderTeamDispersionEntry[]>();
    (data ?? []).forEach((entry) => {
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

  return (
    <BaseDashboardCard
      header="Median CM Dispersion by Squad"
      tooltipContent="Hierarchical view of median CM dispersion across squads and users"
    >
      {!data || data.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <div
          className={`rounded-xl border ${
            theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          <table
            className={`min-w-full text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-zinc-800/50 border-zinc-800" : "bg-gray-50 border-gray-200"
                } text-xs uppercase border-b`}
              >
                <th className="text-left p-4 font-medium">Hierarchy</th>
                <th className="text-left p-4 font-medium">Median</th>
                <th className="text-left p-4 font-medium">Effort</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Day/Night</th>
                <th className="text-left p-4 font-medium">Weapon</th>
                <th className="text-left p-4 font-medium">Position</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(([squadName, users]) => {
                const expanded = expandedSquads.has(squadName);
                const medians = users.map(u => u.median_cm_dispersion).filter(cm => cm != null) as number[];
                const avgMedian =
                  medians.length > 0 ? medians.reduce((sum, cm) => sum + cm, 0) / medians.length : null;

                return (
                  <React.Fragment key={squadName}>
                    {/* Squad Row */}
                    <tr
                      onClick={() => toggleSquad(squadName)}
                      className={`cursor-pointer border-t ${
                        theme === "dark"
                          ? "border-zinc-800 hover:bg-zinc-800/40"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      <td className="p-4 flex items-center gap-3">
                        {expanded ? (
                          <ChevronDown className="text-blue-500" />
                        ) : (
                          <ChevronRight className="text-gray-500" />
                        )}
                        <Users
                          className={`w-5 h-5 ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <span className="font-semibold">{squadName}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ml-2 ${
                            theme === "dark"
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {users.length} user{users.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getColor(avgMedian) }}
                          />
                          <span className="font-semibold">
                            {avgMedian != null ? `${avgMedian.toFixed(2)}cm` : "–"}
                          </span>
                        </div>
                      </td>
                      <td colSpan={5} />
                    </tr>

                    {/* User Rows */}
                    {expanded &&
                      users.map((user) => (
                        <tr
                          key={user.user_id}
                          className={`${
                            theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50/50"
                          } border-t`}
                        >
                          <td className="p-4 pl-12 flex items-center gap-2">
                            <User
                              className={`w-4 h-4 ${
                                theme === "dark" ? "text-green-400" : "text-green-600"
                              }`}
                            />
                            <span>
                              {user.first_name} {user.last_name}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getColor(user.median_cm_dispersion) }}
                              />
                              <span className="font-semibold">
                                {user.median_cm_dispersion != null
                                  ? `${user.median_cm_dispersion.toFixed(2)}cm`
                                  : "–"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">{user.effort === true ? "Yes" : user.effort === false ? "No" : "–"}</td>
                          <td className="p-4">{user.type || "–"}</td>
                          <td className="p-4">{user.day_period || "–"}</td>
                          <td className="p-4">{user.weapon_name || "–"}</td>
                          <td className="p-4">{user.position || "–"}</td>
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
