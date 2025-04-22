import LineChartTwo from "@/components/LineChart";
import BaseStat from "@/components/Stat";
import BasicTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

const stats = [
  { name: "Users", value: "1,200", unit: "", icon: "👥" },
  { name: "Active Squads", value: "14", unit: "", icon: "🔥" },
  { name: "Conversion", value: "5.4", unit: "%", icon: "📈", trend: "up" },
  { name: "Revenue", value: "$12.3K", unit: "", icon: "💰", trend: "up" },
  { name: "Retention", value: "92", unit: "%", icon: "🔄", trend: "stable" },
  { name: "Growth", value: "+8.3", unit: "%", icon: "📊", trend: "up" },
];

export default function Dashboard() {
  const { user } = useStore(userStore);
  const { fetchMembers, members } = useStore(teamStore);
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
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-200">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all duration-200">
            New Project
          </button>
        </div>
      </div>

      {/* Full-width user profile */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-12 border border-gray-700 shadow-lg">
        <UserProfile user={user as User} />
      </div>

      {/* Stats as individual cards in a grid */}
      <h2 className="text-lg font-semibold mb-6 text-gray-300">
        Performance Metrics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-750 transition-all duration-300 p-6 shadow-lg hover:shadow-xl flex items-start justify-between min-h-[160px]"
          >
            <div className="flex flex-col justify-between h-full w-full">
              <div className="flex justify-between items-start w-full mb-4">
                <h3 className="text-lg font-medium text-gray-300">
                  {stat.name}
                </h3>
                <span className="text-2xl text-blue-400">{stat.icon}</span>
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
                        ? "bg-green-900/40 text-green-400"
                        : stat.trend === "down"
                        ? "bg-red-900/40 text-red-400"
                        : "bg-blue-900/40 text-blue-400"
                    }`}
                  >
                    {stat.trend === "up"
                      ? "↑"
                      : stat.trend === "down"
                      ? "↓"
                      : "→"}
                    {stat.trend === "up"
                      ? "Increasing"
                      : stat.trend === "down"
                      ? "Decreasing"
                      : "Stable"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Summary side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">
            Team Performance
          </h2>
          <LineChartTwo />
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">
            AI Insights
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-base font-medium text-white">
                  Growth Opportunity
                </p>
              </div>
              <p className="mt-2 text-gray-300">
                Team conversion rate up 12% from last month. Consider scaling
                marketing efforts.
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <p className="text-base font-medium text-white">
                  Action Required
                </p>
              </div>
              <p className="mt-2 text-gray-300">
                3 team members have pending tasks that are past due.
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-base font-medium text-white">
                  Trending Topic
                </p>
              </div>
              <p className="mt-2 text-gray-300">
                User engagement with your mobile app increased 24% this week.
              </p>
            </div>

            <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all duration-200 text-white">
              View All Insights
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-300">Team Members</h3>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-all duration-200">
            Add Member +
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading team members...</p>
          </div>
        ) : (
          <BasicTable />
        )}
      </div>
    </div>
  );
}
