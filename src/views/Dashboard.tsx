import BasicTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import MonthlyOpsAreaChart from "@/components/MonthlyOpsAreaChart";
import TeamBarChart from "@/components/TeamBarChart";
import Stat from "@/components/Stat";

const stats = [
  { name: "Operatives", value: "158", unit: "" },
  { name: "Active Teams", value: "14", unit: "" },
  { name: "Accuracy Rate", value: "94.7", unit: "%", trend: "up" },
  { name: "Successful Ops", value: "238", unit: "", trend: "up" },
  {
    name: "Target Acquisition",
    value: "92",
    unit: "%",
    trend: "stable",
  },
  {
    name: "Recon Efficiency",
    value: "+12.3",
    unit: "%",
    trend: "up",
  },
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
          <TeamBarChart />
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold mb-6 text-white">
        Tactical Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat: any) => (
          <Stat
            stat={{ name: stat.name, value: stat.value, trend: stat.trend, unit: stat.unit }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-white">
            Monthly Operation Success Rate
          </h2>
          <MonthlyOpsAreaChart />
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
