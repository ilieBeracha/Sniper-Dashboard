import DashboardTrainingEffectiveness from "@/components/AnalyticsTrainingEffectiveness";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";

export default function Analytics() {
  const { trainingEffectiveness, getTrainingEffectiveness } = useStore(performanceStore);
  const { user } = useStore(userStore);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await getTrainingEffectiveness(user.team_id);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen w-screen from-[#1E1E20] text-gray-100 px-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {/* <div className="col-span-2"> */}
        <DashboardTrainingEffectiveness trainingData={trainingEffectiveness} />
        {/* </div> */}
        {/* <div className="col-span-2">
          <DashboardDayNightPerformance dayNightPerformance={dayNightPerformance} />
        </div>

        <div className="col-span-2">
          <BaseDashboardCard header="Weapon Performance" tooltipContent="Detailed weapon performance metrics across different squads">
            <DashboardSquadWeaponPerformance />
          </BaseDashboardCard>
        </div> */}
      </div>
    </div>
  );
}
