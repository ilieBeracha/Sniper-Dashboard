import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { squadStore } from "@/store/squadStore";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { Card } from "@heroui/react";
import BaseDashboardCard from "./BaseDashboardCard";
import { useTheme } from "@/contexts/ThemeContext";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const {
    metrics,
    squadsWithMembers,
    getSquadMetricsByRole,
    getSquadsWithUsersByTeamId,
  } = useStore(squadStore);
  const { squadStats, getSquadStats } = useStore(performanceStore);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await getSquadMetricsByRole(user.team_id);
      await getSquadsWithUsersByTeamId(user.team_id);
      await getSquadStats(null, null); // load for comparison view
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  return (
    <div className="flex flex-col gap-6">

      {/* Squad Role Metrics */}
      <BaseDashboardCard
        header="Squad Role Metrics"
        tooltipContent="This shows average hit percentage and total sessions for each squad and role."
      >
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading squad data...</div>
        ) : !metrics || metrics.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No squad metrics found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {metrics.map((m, i) => (
              <Card
                key={i}
                className={`rounded-xl p-4 transition-colors duration-200 ${
                  theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
                }`}
              >
                <h3 className="text-md font-semibold mb-1 capitalize">{m.role}</h3>
                <p className="text-xs text-gray-500 mb-1">Avg Hit %</p>
                <div className="text-2xl font-bold text-purple-500 mb-2">{m.avg_hit_ratio?.toFixed(2)}%</div>
                <p className="text-xs text-gray-500">Total Sessions: {m.total_sessions}</p>
              </Card>
            ))}
          </div>
        )}
      </BaseDashboardCard>

      {/* Squad Hit Percentages & Best/Worst Roles */}
      <BaseDashboardCard
        header="Squad Hit Percentages & Best/Worst Roles"
        tooltipContent="Comparison of squad performance including their best and worst functional roles."
      >
        {loading || !squadStats || squadStats.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            {loading ? "Loading squad performance..." : "Not enough squad performance data available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-sm">
            {Object.entries(
              squadStats.reduce((acc, item) => {
                const squad = item.squad_name || "Unknown Squad";
                if (!acc[squad]) acc[squad] = [];
                acc[squad].push(item);
                return acc;
              }, {} as Record<string, typeof squadStats>)
            ).map(([squadName, stats], idx) => {
              const sorted = [...stats].sort((a, b) => b.hit_percentage - a.hit_percentage);
              const best = sorted[0];
              const worst = sorted[sorted.length - 1];

              return (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border ${
                    theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
                  }`}
                >
                  <h4 className="font-semibold text-md mb-2">{squadName}</h4>
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Avg Hit % (by role):</p>
                      <ul className="text-sm mt-1">
                        {stats.map((s, i) => (
                          <li key={i} className="text-sm text-purple-600">
                            {s.role_or_weapon}: {s.hit_percentage?.toFixed(1)}%
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xs text-green-600 font-semibold">Best Form:</p>
                        <span className="text-sm">
                          {best.role_or_weapon} – {best.hit_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-red-500 font-semibold">Worst Form:</p>
                        <span className="text-sm">
                          {worst.role_or_weapon} – {worst.hit_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BaseDashboardCard>

      {/* Squads & Members */}
      <BaseDashboardCard
        header="Squads & Members"
        tooltipContent="List of all squads and their users."
      >
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading squad members...</div>
        ) : !squadsWithMembers || squadsWithMembers.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No squads found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {squadsWithMembers.map((squad, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${
                  theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
                }`}
              >
                <h4 className="font-semibold text-lg mb-2">{squad.squad_name}</h4>
                <ul className="text-sm text-gray-500 flex flex-wrap gap-2">
                  {squad.users?.map((user: any) => (
                    <li key={user.id} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                      {user.first_name} {user.last_name} – {user.user_role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </BaseDashboardCard>
    </div>
  );
};

export default CommanderView;
