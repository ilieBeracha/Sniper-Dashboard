import LineChartTwo from "@/components/LineChart";
import BaseStat from "@/components/Stat";
import BasicTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useStore } from "zustand";

const stats = [
  { name: "Users", value: "1,200", unit: "" },
  { name: "Conversion Rate", value: "5.4", unit: "%" },
  { name: "Revenue", value: "$12.3K", unit: "" },
];

export default function Dashboard() {
  const useUserStore = useStore(userStore);

  return (
    <div className=" min-h-screen w-full overflow-y-auto py-18 px-6 md:px-16">
      <div className="grid grid-cols-12 gap-12 auto-rows-min">
        <div className="col-span-10 md:col-span-3 bg-[#0e0e0e] rounded-2xl shadow-md">
          <UserProfile user={useUserStore.user as User} />
        </div>

        <div className="col-span-12 md:col-span-5 bg-[#0e0e0e] rounded-2xl shadow-md p-6 flex items-center justify-center text-gray-400 text-center">
          {/* Calendar / Upcoming Events / Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <BaseStat key={stat.name} stat={stat} />
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-md p-6 flex items-center justify-center text-indigo-700 font-medium text-sm">
          AI Summary / Notification / Productivity Card
        </div>

        <div className="col-span-12 md:col-span-8 bg-[#0e0e0e] rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-gray-400 mb-4">Team Performance</h2>
          <LineChartTwo />
        </div>

        <div className="col-span-12 md:col-span-4 bg-[#0e0e0e] rounded-2xl shadow-md p-6 flex items-center justify-center text-gray-400">
          Timeline / Activity Log
        </div>

        {/* Team Table */}
        <div className="col-span-12 bg-[#0e0e0e] rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-gray-400 mb-4">Team Members</h3>
          <BasicTable />
        </div>
      </div>
    </div>
  );
}
