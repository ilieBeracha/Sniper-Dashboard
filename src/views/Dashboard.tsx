import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
} from "recharts";
import BasicTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

const monthlyOperationsData = [
  { month: "Jan", directHits: 32, assistedEliminations: 18, missedTargets: 4 },
  { month: "Feb", directHits: 37, assistedEliminations: 24, missedTargets: 2 },
  { month: "Mar", directHits: 30, assistedEliminations: 28, missedTargets: 5 },
  { month: "Apr", directHits: 41, assistedEliminations: 25, missedTargets: 3 },
  { month: "May", directHits: 35, assistedEliminations: 21, missedTargets: 2 },
  { month: "Jun", directHits: 38, assistedEliminations: 19, missedTargets: 1 },
  { month: "Jul", directHits: 42, assistedEliminations: 23, missedTargets: 2 },
  { month: "Aug", directHits: 44, assistedEliminations: 26, missedTargets: 0 },
  { month: "Sep", directHits: 37, assistedEliminations: 30, missedTargets: 3 },
  { month: "Oct", directHits: 45, assistedEliminations: 27, missedTargets: 1 },
  { month: "Nov", directHits: 43, assistedEliminations: 25, missedTargets: 2 },
  { month: "Dec", directHits: 48, assistedEliminations: 31, missedTargets: 0 },
];

const stats = [
  { name: "Operatives", value: "158", unit: "", icon: "👥" },
  { name: "Active Teams", value: "14", unit: "", icon: "🔥" },
  { name: "Accuracy Rate", value: "94.7", unit: "%", icon: "📈", trend: "up" },
  { name: "Successful Ops", value: "238", unit: "", icon: "🎯", trend: "up" },
  {
    name: "Target Acquisition",
    value: "92",
    unit: "%",
    icon: "🔄",
    trend: "stable",
  },
  {
    name: "Recon Efficiency",
    value: "+12.3",
    unit: "%",
    icon: "📊",
    trend: "up",
  },
];

const barChartData = [
  { name: "Alpha", confirmed: 28, potential: 41 },
  { name: "Bravo", confirmed: 22, potential: 34 },
  { name: "Charlie", confirmed: 31, potential: 45 },
  { name: "Delta", confirmed: 25, potential: 37 },
  { name: "Echo", confirmed: 18, potential: 29 },
];

export default function Dashboard() {
  const { user } = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await fetchMembers(user.team_id);
      }
      setLoading(false);
    };
    load();
  }, [user?.team_id]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 px-6 md:px-16 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-white">
          Tactical Operations Dashboard
        </h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
            Generate Intel Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] hover:opacity-90 rounded-lg text-sm font-medium transition-all text-white">
            New Operation
          </button>
        </div>
      </div>

      {/* Profile and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-white">
            Operative Profile
          </h2>
          <UserProfile user={user as User} />
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl py-6 pr-6 border border-white/5 shadow-lg">
          <h2 className="text-lg pl-6 font-semibold mb-6 text-white">
            Team Performance Metrics
          </h2>
          <ResponsiveContainer
            width="100%"
            height={300}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              style={{}}
            >
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
                itemStyle={{ color: "#A5B4FC" }}
              />
              <Bar
                dataKey="confirmed"
                name="Confirmed Eliminations"
                fill="#7F5AF0"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="potential"
                name="Potential Targets"
                fill="#2CB67D"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold mb-6 text-white">
        Tactical Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => {
          const cardClass =
            "bg-[#1E1E1E] border border-white/5 hover:border-white/10";
          const iconColors = [
            "text-[#7F5AF0]",
            "text-[#2CB67D]",
            "text-[#F25F4C]",
            "text-[#FF8906]",
            "text-[#0FA3B1]",
            "text-[#E53170]",
          ];
          return (
            <div
              key={stat.name}
              className={`rounded-xl ${cardClass} transition-all duration-300 p-6 shadow-lg hover:shadow-2xl flex items-start justify-between min-h-[160px]`}
            >
              <div className="flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-start w-full mb-4">
                  <h3 className="text-lg font-medium text-white">
                    {stat.name}
                  </h3>
                  <span
                    className={`text-2xl ${
                      iconColors[index % iconColors.length]
                    }`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                    <span className="ml-1 text-sm text-gray-400 font-normal">
                      {stat.unit}
                    </span>
                  </div>
                  {stat.trend && (
                    <div
                      className={`mt-2 text-sm px-3 py-1 rounded-full inline-block ${
                        stat.trend === "up"
                          ? "bg-[#2CB67D]/20 text-[#2CB67D]"
                          : stat.trend === "down"
                          ? "bg-[#F25F4C]/20 text-[#F25F4C]"
                          : "bg-gray-600/30 text-gray-400"
                      }`}
                    >
                      {stat.trend === "up"
                        ? "↑ Improving"
                        : stat.trend === "down"
                        ? "↓ Declining"
                        : "→ Stable"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart and AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-white">
            Monthly Operation Success Rate
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={monthlyOperationsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorDirectHits"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="colorAssistedEliminations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2CB67D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2CB67D" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="colorMissedTargets"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F25F4C" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F25F4C" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                }}
                labelStyle={{
                  color: "white",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
                itemStyle={{ padding: "4px 0" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", color: "#F3F4F6" }} />
              <Area
                type="monotone"
                dataKey="directHits"
                name="Direct Hits"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorDirectHits)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="assistedEliminations"
                name="Assisted Eliminations"
                stroke="#2CB67D"
                fillOpacity={1}
                fill="url(#colorAssistedEliminations)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="missedTargets"
                name="Missed Targets"
                stroke="#F25F4C"
                fillOpacity={1}
                fill="url(#colorMissedTargets)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-white">
            Tactical AI Analysis
          </h2>
          <div className="space-y-6">
            {[
              {
                dot: "bg-[#2CB67D]",
                title: "High-Value Target Alert",
                text: "Long-range engagement effectiveness up 14% this quarter. Deploy advanced optics.",
              },
              {
                dot: "bg-[#7F5AF0]",
                title: "Critical Maintenance",
                text: "3 sniper rifles require recalibration. Deviation observed in recent ops.",
              },
              {
                dot: "bg-[#FF8906]",
                title: "Terrain Advantage",
                text: "Urban ops accuracy improved 22% with thermal imaging. Recommend full rollout.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.dot} mr-2`} />
                  <p className="text-base font-medium text-white">
                    {item.title}
                  </p>
                </div>
                <p className="mt-2 text-gray-400">{item.text}</p>
              </div>
            ))}
            <button className="mt-4 w-full py-3 bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] hover:opacity-90 rounded-lg text-sm font-medium text-white">
              View Full Intelligence Report
            </button>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            Active Sniper Units
          </h3>
          <button className="px-4 py-2 bg-[#333] hover:bg-[#444] border border-white/10 rounded-lg text-xs font-medium text-white transition-all">
            Deploy New Unit +
          </button>
        </div>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-[#7F5AF0] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">
              Loading operational units data...
            </p>
          </div>
        ) : (
          <BasicTable />
        )}
      </div>
    </div>
  );
}
