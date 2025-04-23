import BasicTable from "@/components/DashboardTeamTable";
import UserProfile from "@/components/UserProfile";
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import MonthlyOpsAreaChart from "@/components/DashboardMonthlyOpsAreaChart";
import TeamBarChart from "@/components/DashboardTeamBarChart";
import Stat from "@/components/Stat";
import Header from "@/components/Header";
import DashboardAiAnalysis from "@/components/DashboardAiAnalysis";

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
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 py-12">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-6 mb-12">
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <UserProfile user={user as User} />
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <DashboardAiAnalysis />
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold mb-6 text-white">
        Tactical Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat: any) => (
          <Stat
            stat={{
              name: stat.name,
              value: stat.value,
              trend: stat.trend,
              unit: stat.unit,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
          <MonthlyOpsAreaChart />
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl py-6 pr-6 border border-white/5 shadow-lg">
          <TeamBarChart />
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5 shadow-lg">
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
