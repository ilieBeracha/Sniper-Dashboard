import React, { useState } from "react";
import { CommanderUserRoleBreakdown } from "@/types/performance";
import BaseDashboardCard from "./base/BaseDashboardCard";
import NoDataDisplay from "./base/BaseNoData";
import { ChevronDown, ChevronRight, Users, User, Target } from "lucide-react";

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

  const getColor = (pct: number) => {
    if (pct >= 75) return "#2CB67D";
    if (pct >= 50) return "#FF8906";
    return "#F25F4C";
  };

  // Group and merge user data
  const processedData = commanderUserRoleBreakdown ? 
    Array.from(
      commanderUserRoleBreakdown.reduce((squadMap, entry) => {
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
        
        return squadMap;
      }, new Map<string, Map<string, MergedUserData>>())
    ).map(([squadName, userMap]) => {
      const users = Array.from(userMap.values()).map(user => ({
        ...user,
        averageHitPercentage: user.totalShots > 0 ? (user.totalHits / user.totalShots) * 100 : 0,
      }));
      return [squadName, users] as [string, MergedUserData[]];
    }) : [];

  return (
    <BaseDashboardCard
      header="User Accuracy by Role - Hierarchical View"
      tooltipContent="Hierarchical tree view: Team → Squads → Users → Roles. Click to expand/collapse levels."
    >
      {loading || !commanderUserRoleBreakdown ? (
        <div className="py-10 text-center text-sm text-gray-500">Loading user role breakdown...</div>
      ) : commanderUserRoleBreakdown.length === 0 ? (
        <NoDataDisplay />
      ) : (
        <div className={`rounded-xl border transition-colors duration-200 ${
          theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white shadow-sm"
        }`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <thead>
                <tr className={`text-xs uppercase border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800 bg-zinc-800/50" : "border-gray-200 bg-gray-50"}`}>
                  <th className="text-left p-4 font-medium w-2/5">Hierarchy</th>
                  <th className="text-left p-4 font-medium">Hit %</th>
                  <th className="text-left p-4 font-medium">Shots</th>
                  <th className="text-left p-4 font-medium">Hits</th>
                  <th className="text-left p-4 font-medium">Sessions</th>
                  <th className="text-left p-4 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map(([squadName, users]) => (
                  <React.Fragment key={squadName}>
                    {/* Squad Row */}
                    <tr
                      onClick={() => toggleSquad(squadName)}
                      className={`cursor-pointer transition-colors duration-200 border-t ${
                        theme === "dark" 
                          ? "border-zinc-800/50 hover:bg-zinc-800/30" 
                          : "border-gray-100 hover:bg-blue-50/50"
                      } ${expandedSquads.has(squadName) ? (theme === "dark" ? "bg-zinc-800/20" : "bg-blue-50/30") : ""}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {expandedSquads.has(squadName) ? (
                              <ChevronDown className="w-5 h-5 text-blue-500" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                            <span className="font-semibold text-base">{squadName}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
                            }`}>
                              {users.length} user{users.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getColor(
                              users.reduce((sum, user) => sum + user.averageHitPercentage, 0) / users.length
                            ) }}
                          />
                          <span className="font-semibold">
                            {(users.reduce((sum, user) => sum + user.averageHitPercentage, 0) / users.length).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {users.reduce((sum, user) => sum + user.totalShots, 0)}
                      </td>
                      <td className="p-4 font-medium">
                        {users.reduce((sum, user) => sum + user.totalHits, 0)}
                      </td>
                      <td className="p-4 font-medium">
                        {users.reduce((sum, user) => sum + user.totalSessions, 0)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
                        }`}>
                          Squad
                        </span>
                      </td>
                    </tr>

                    {/* Squad Users */}
                    {expandedSquads.has(squadName) && users.map((user, userIdx) => {
                      const userKey = `${squadName}-${user.name}`;
                      const isExpanded = expandedUsers.has(userKey);
                      const isLastUser = userIdx === users.length - 1;
                      
                      return (
                        <React.Fragment key={userKey}>
                          {/* User Row */}
                          <tr
                            onClick={() => toggleUser(userKey)}
                            className={`cursor-pointer transition-colors duration-200 ${
                              theme === "dark" 
                                ? "hover:bg-zinc-800/40" 
                                : "hover:bg-gray-50"
                            } ${isExpanded ? (theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50/50") : ""}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center relative">
                                  {/* Tree lines */}
                                  <div className={`absolute -left-2 w-6 h-full border-l-2 ${
                                    theme === "dark" ? "border-zinc-700" : "border-gray-300"
                                  }`} style={{ left: '10px' }} />
                                  <div className={`absolute w-4 border-t-2 ${
                                    theme === "dark" ? "border-zinc-700" : "border-gray-300"
                                  }`} style={{ 
                                    left: '10px', 
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                  }} />
                                  {!isLastUser && (
                                    <div className={`absolute w-6 border-l-2 ${
                                      theme === "dark" ? "border-zinc-700" : "border-gray-300"
                                    }`} style={{ 
                                      left: '10px', 
                                      top: '50%',
                                      bottom: '-100%'
                                    }} />
                                  )}
                                  
                                  <div className="ml-8 flex items-center">
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                                  <span className="font-medium">{user.name}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    theme === "dark" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                                  }`}>
                                    {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getColor(user.averageHitPercentage) }}
                                />
                                <span className="font-semibold">
                                  {user.averageHitPercentage.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">{user.totalShots}</td>
                            <td className="p-4 font-medium">{user.totalHits}</td>
                            <td className="p-4 font-medium">{user.totalSessions}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === "dark" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                              }`}>
                                User
                              </span>
                            </td>
                          </tr>

                          {/* User Roles */}
                          {isExpanded && user.roles.map((role, roleIdx) => {
                            const isLastRole = roleIdx === user.roles.length - 1;
                            
                            return (
                              <tr
                                key={`${userKey}-${roleIdx}`}
                                className={theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50/70"}
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center relative">
                                      {/* Extended tree lines */}
                                      <div className={`absolute w-6 h-full border-l-2 ${
                                        theme === "dark" ? "border-zinc-700" : "border-gray-300"
                                      }`} style={{ left: '10px' }} />
                                      {!isLastUser && (
                                        <div className={`absolute w-6 border-l-2 ${
                                          theme === "dark" ? "border-zinc-700" : "border-gray-300"
                                        }`} style={{ 
                                          left: '10px', 
                                          top: '100%',
                                          height: '200%'
                                        }} />
                                      )}
                                      
                                      <div className={`absolute w-6 h-full border-l-2 ${
                                        theme === "dark" ? "border-zinc-600" : "border-gray-400"
                                      }`} style={{ left: '30px' }} />
                                      <div className={`absolute w-4 border-t-2 ${
                                        theme === "dark" ? "border-zinc-600" : "border-gray-400"
                                      }`} style={{ 
                                        left: '30px', 
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                      }} />
                                      {!isLastRole && (
                                        <div className={`absolute w-6 border-l-2 ${
                                          theme === "dark" ? "border-zinc-600" : "border-gray-400"
                                        }`} style={{ 
                                          left: '30px', 
                                          top: '50%',
                                          bottom: '-100%'
                                        }} />
                                      )}
                                      
                                      <div className="ml-12 flex items-center gap-2">
                                        <Target className={`w-4 h-4 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                                        <span className="font-medium capitalize">{role.role_or_weapon}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: getColor(role.hit_percentage || 0) }}
                                    />
                                    <span className="font-semibold">
                                      {role.hit_percentage?.toFixed(1) || '0.0'}%
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 font-medium">{role.shots}</td>
                                <td className="p-4 font-medium">{role.hits}</td>
                                <td className="p-4 font-medium">{role.sessions}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    theme === "dark" ? "bg-orange-900/50 text-orange-300" : "bg-orange-100 text-orange-700"
                                  }`}>
                                    Role
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </BaseDashboardCard>
  );
};

export default UserRoleAccuracyTable;