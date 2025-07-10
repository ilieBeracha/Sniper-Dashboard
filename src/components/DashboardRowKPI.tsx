import BaseDashboardCard from "./BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import DashboardSquadStats from "./DashboardSquadStats";
import UserGroupingSummary from "./DashboardUserGroupingSummary";
import { isCommander } from "@/utils/permissions";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { UserRole } from "@/types/user";

export default function DashboardRowKPI() {
  const { user } = useStore(userStore);
  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 w-full">
        <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
          <BaseDashboardCard
            header="User Group Score"
            tooltipContent="Group size shows how close 4+ shots landed at 100m — smaller means better precision."
          >
            <UserGroupingSummary />
          </BaseDashboardCard>
        </div>

        <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
          <BaseDashboardCard header="Individual Hit Percentage" tooltipContent="Accuracy from scores where you were the only sniper">
            <UserHitPercentage />
          </BaseDashboardCard>
        </div>
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-6">{isCommander(user?.user_role as UserRole) ? <DashboardSquadStats /> : <></>}</div>
      </div>
    </>
  );
}
