import { useState, useMemo } from "react";
import { CommanderUserRoleBreakdown } from "@/types/performance";
import BaseDashboardCard from "./base/BaseDashboardCard";
import NoDataDisplay from "./base/BaseNoData";
import { ChevronDown, ChevronRight, Users, User, Target } from "lucide-react";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";

interface UserRoleAccuracyTableProps {
  loading: boolean;
  commanderUserRoleBreakdown: CommanderUserRoleBreakdown[] | null;
  theme: string;
}

interface MergedUserData {
  name: string;
  roles: CommanderUserRoleBreakdown[];
  totalShots: number;
  totalHits: number;
  totalSessions: number;
  averageHitPercentage: number;
}

interface TableRow {
  id: string;
  squad_name: string;
  first_name: string;
  last_name: string;
  role_or_weapon: string;
  hit_percentage: number | null;
  shots: number;
  hits: number;
  sessions: number;
  // Additional fields for hierarchy
  level: "squad" | "user" | "role";
  parentId?: string;
  isExpanded?: boolean;
  childCount?: number;
}

const UserRoleAccuracyTable = ({ loading, commanderUserRoleBreakdown, theme }: UserRoleAccuracyTableProps) => {
  const [expandedSquads, setExpandedSquads] = useState<Set<string>>(new Set());
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const toggleSquad = (squadName: string) => {
    const newExpanded = new Set(expandedSquads);
    if (newExpanded.has(squadName)) {
      newExpanded.delete(squadName);
    } else {
      newExpanded.add(squadName);
    }
    setExpandedSquads(newExpanded);
  };

  const toggleUser = (userKey: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userKey)) {
      newExpanded.delete(userKey);
    } else {
      newExpanded.add(userKey);
    }
    setExpandedUsers(newExpanded);
  };

  const columns: SpTableColumn<TableRow>[] = [
    {
      key: "first_name",
      label: "Hierarchy",
      width: "40%",
      render: (_, row) => {
        const indent = row.level === "user" ? 24 : row.level === "role" ? 48 : 0;
        const Icon = row.level === "squad" ? Users : row.level === "user" ? User : Target;
        const iconColor =
          row.level === "squad"
            ? theme === "dark"
              ? "text-blue-400"
              : "text-blue-600"
            : row.level === "user"
              ? theme === "dark"
                ? "text-green-400"
                : "text-green-600"
              : theme === "dark"
                ? "text-orange-400"
                : "text-orange-600";

        return (
          <div className="flex items-center gap-2 py-3" style={{ paddingLeft: `${indent}px` }}>
            {(row.level === "squad" || row.level === "user") &&
              (row.isExpanded ? (
                <ChevronDown className={`w-4 h-4 ${row.level === "squad" ? "text-blue-500" : "text-green-500"}`} />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ))}
            <Icon className={`w-4 h-4 ${iconColor}`} />
            <span className={`${row.level === "squad" ? "font-semibold text-base" : "font-medium"} text-xs sm:text-sm`}>
              {row.level === "squad" ? row.first_name : row.level === "user" ? `${row.first_name} ${row.last_name}` : row.role_or_weapon}
            </span>
            {row.childCount !== undefined && row.childCount > 0 && (
              <span
                className={`text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                  row.level === "squad"
                    ? theme === "dark"
                      ? "bg-blue-900/50 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                    : theme === "dark"
                      ? "bg-green-900/50 text-green-300"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {row.childCount}
                <span className="hidden sm:inline">
                  {" "}
                  {row.level === "squad" ? "user" : "role"}
                  {row.childCount !== 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "hit_percentage",
      label: "Hit %",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(value) }} />
          <span className="font-semibold text-xs sm:text-sm">{value !== null ? `${value.toFixed(1)}%` : "0.0%"}</span>
        </div>
      ),
    },
    {
      key: "shots",
      label: "Shots",
      render: (value) => <span className="font-medium text-xs sm:text-sm">{value}</span>,
    },
    {
      key: "hits",
      label: "Hits",
      hideOnMobile: true,
      render: (value) => <span className="font-medium text-xs sm:text-sm">{value}</span>,
    },
    {
      key: "sessions",
      label: "Sessions",
      hideOnMobile: true,
      render: (value) => <span className="font-medium text-xs sm:text-sm">{value}</span>,
    },
    {
      key: "role_or_weapon",
      label: "Type",
      render: (value, row) => {
        const colors = {
          squad: theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700",
          user: theme === "dark" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700",
          role: theme === "dark" ? "bg-orange-900/50 text-orange-300" : "bg-orange-100 text-orange-700",
        };
        return (
          <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${colors[row.level]}`}>{row.level === "role" ? "Role" : value}</span>
        );
      },
    },
  ];

  const getColor = (pct: number | null) => {
    if (pct === null) return "#999999";
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  // Transform hierarchical data into flat structure for SpTable
  const tableData = useMemo(() => {
    if (!commanderUserRoleBreakdown || commanderUserRoleBreakdown.length === 0) return [];

    const rows: TableRow[] = [];
    const squadMap = new Map<string, Map<string, MergedUserData>>();

    // Group data by squad and user
    commanderUserRoleBreakdown.forEach((entry) => {
      if (!squadMap.has(entry.squad_name)) {
        squadMap.set(entry.squad_name, new Map<string, MergedUserData>());
      }

      const userMap = squadMap.get(entry.squad_name)!;
      const userKey = `${entry.first_name} ${entry.last_name}`;

      if (!userMap.has(userKey)) {
        userMap.set(userKey, {
          name: userKey,
          roles: [],
          totalShots: 0,
          totalHits: 0,
          totalSessions: 0,
          averageHitPercentage: 0,
        });
      }

      const userData = userMap.get(userKey)!;
      userData.roles.push(entry);
      userData.totalShots += entry.shots;
      userData.totalHits += entry.hits;
      userData.totalSessions += entry.sessions;
    });

    // Create flat structure
    squadMap.forEach((userMap, squadName) => {
      const users = Array.from(userMap.values());
      users.forEach((user) => {
        user.averageHitPercentage = user.totalShots > 0 ? (user.totalHits / user.totalShots) * 100 : 0;
      });

      const squadTotals = users.reduce(
        (acc, user) => ({
          shots: acc.shots + user.totalShots,
          hits: acc.hits + user.totalHits,
          sessions: acc.sessions + user.totalSessions,
        }),
        { shots: 0, hits: 0, sessions: 0 },
      );

      const squadHitPct = squadTotals.shots > 0 ? (squadTotals.hits / squadTotals.shots) * 100 : 0;

      // Add squad row
      const squadId = `squad-${squadName}`;
      rows.push({
        id: squadId,
        squad_name: squadName,
        first_name: squadName,
        last_name: "",
        role_or_weapon: "Squad",
        hit_percentage: squadHitPct,
        shots: squadTotals.shots,
        hits: squadTotals.hits,
        sessions: squadTotals.sessions,
        level: "squad",
        isExpanded: expandedSquads.has(squadName),
        childCount: users.length,
      });

      // Add user rows if squad is expanded
      if (expandedSquads.has(squadName)) {
        users.forEach((user) => {
          const userId = `${squadId}-${user.name}`;
          const [firstName, ...lastNameParts] = user.name.split(" ");
          const lastName = lastNameParts.join(" ");

          rows.push({
            id: userId,
            squad_name: squadName,
            first_name: firstName,
            last_name: lastName,
            role_or_weapon: "User",
            hit_percentage: user.averageHitPercentage,
            shots: user.totalShots,
            hits: user.totalHits,
            sessions: user.totalSessions,
            level: "user",
            parentId: squadId,
            isExpanded: expandedUsers.has(userId),
            childCount: user.roles.length,
          });

          // Add role rows if user is expanded
          if (expandedUsers.has(userId)) {
            user.roles.forEach((role) => {
              rows.push({
                id: `${userId}-${role.role_or_weapon}`,
                squad_name: squadName,
                first_name: role.first_name,
                last_name: role.last_name,
                role_or_weapon: role.role_or_weapon,
                hit_percentage: role.hit_percentage,
                shots: role.shots,
                hits: role.hits,
                sessions: role.sessions,
                level: "role",
                parentId: userId,
              });
            });
          }
        });
      }
    });

    return rows;
  }, [commanderUserRoleBreakdown, expandedSquads, expandedUsers]);

  return (
    <BaseDashboardCard
      tooltipContent="Hierarchical tree view: Team → Squads → Users → Roles. Click to expand/collapse levels."
      withFilter={[
        { label: "Role", value: "role", type: "select", options: [{ label: "All Roles", value: "" }], onChange: () => {} },
        { label: "Weapon", value: "weapon", type: "select", options: [{ label: "All Weapons", value: "" }], onChange: () => {} },
      ]}
      onClearFilters={() => {
        setExpandedSquads(new Set());
        setExpandedUsers(new Set());
      }}
      currentFilterValues={{ role: "" }}
    >
      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">Loading user role breakdown...</div>
      ) : !commanderUserRoleBreakdown || commanderUserRoleBreakdown.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <SpTable<TableRow>
          data={tableData}
          columns={columns}
          emptyState={<NoDataDisplay />}
          actions={{
            onRowClick: (row) => {
              if (row.level === "squad") {
                toggleSquad(row.squad_name);
              } else if (row.level === "user") {
                toggleUser(row.id);
              }
            },
          }}
          highlightRow={(row) => {
            if (row.level === "squad" && expandedSquads.has(row.squad_name)) return true;
            if (row.level === "user" && expandedUsers.has(row.id)) return true;
            return false;
          }}
          isDisplayActions={false}
        />
      )}
    </BaseDashboardCard>
  );
};

export default UserRoleAccuracyTable;
