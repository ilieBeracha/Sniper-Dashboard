import DashboardProfileCard from "./DashboardProfileCard";
import CyCharts from "./CyCharts";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import DashboardCalendar from "./DashboardCalendar";

export default function DashboardOverview({ loading }: { loading: boolean }) {
  const { user } = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadsWithUsersByTeamId } = useStore(squadStore);
  const isMobile = useIsMobile();
  useEffect(() => {
    const loadTeamData = async () => {
      if (user?.team_id) {
        try {
          await Promise.all([fetchMembers(user.team_id), getSquadsWithUsersByTeamId(user.team_id)]);
        } catch (error) {
          console.error("Error loading team data:", error);
        }
      }
    };
    loadTeamData();
  }, [user?.team_id, user?.user_role]);

  return (
    <>
      <DashboardProfileCard />
      {isMobile && (
        <div className="w-full row-span-1 grid col-span-1 xl:col-span-2 sm:col-span-10">
          <DashboardCalendar />
        </div>
      )}
      <div className="w-full row-span-1 grid col-span-1 xl:col-span-2 sm:col-span-10 rounded-lg">
        <CyCharts loading={loading} />
      </div>
    </>
  );
}
