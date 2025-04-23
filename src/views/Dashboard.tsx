// Dashboard.tsx - Main component
import { teamStore } from "@/store/teamStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import Header from "@/components/Header";

import DashboardRowOne from "@/components/DashboardRowOne";
import DashboardRowTwo from "@/components/DashboardRowTwo";
import DashboardRowThree from "@/components/DashboardRowThree";
import DashboardRowFour from "@/components/DashboardRowFour";

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
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <Header />
      <div className="space-y-12">
        <DashboardRowOne user={user} />
        <DashboardRowTwo />
        <DashboardRowThree loading={loading} />
        <DashboardRowFour />
      </div>
    </div>
  );
}
