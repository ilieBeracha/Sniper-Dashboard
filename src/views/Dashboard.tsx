import LineChartTwo from "@/components/LineChart";
import BasicTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useStore } from "zustand";

export default function Dashboard() {
  const useUserStore = useStore(userStore);

  return (
    <div className="bg-[#EBEBF1] min-h-screen w-full overflow-y-auto py-10 px-6 md:px-16">
      <div className="grid grid-cols-12 gap-4 auto-rows-min">
        <div className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow-md">
          <UserProfile user={useUserStore.user as User} />
        </div>

        <div className="col-span-12 md:col-span-5 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center text-gray-500 text-center">
          Calendar / Upcoming Events / Quick Stats
        </div>

        <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-md p-6 flex items-center justify-center text-indigo-700 font-medium text-sm">
          AI Summary / Notification / Productivity Card
        </div>

        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-4 h-44 flex items-center justify-center text-gray-400"
            >
              Small Chart {i}
            </div>
          ))}
        </div>

        <div className="col-span-12 md:col-span-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Team Performance</h2>
          <LineChartTwo />
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center text-gray-400">
          Timeline / Activity Log
        </div>

        {/* Team Table */}
        <div className="col-span-12 bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Team Members</h3>
          <BasicTable />
        </div>

        {/* Small charts area */}
      </div>
    </div>
  );
}
