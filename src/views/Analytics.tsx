import DashboardTrainingEffectiveness from "@/components/AnalyticsTrainingEffectiveness";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import DashboardDayNightPerformance from "@/components/DashboardDayNightPerformance";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import DashboardSquadWeaponPerformance from "@/components/DashboardSquadWeaponPerformance";

export default function Analytics() {
  const { trainingEffectiveness, getTrainingEffectiveness, dayNightPerformance } = useStore(performanceStore);
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
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-6">
        <div className="col-span-2">
          <DashboardTrainingEffectiveness trainingData={trainingEffectiveness} />
        </div>
        <div className="col-span-2">
          <DashboardDayNightPerformance dayNightPerformance={dayNightPerformance} />
        </div>

        <div className="col-span-2">
          <BaseDashboardCard title="Weapon Performance" tooltipContent="Detailed weapon performance metrics across different squads">
            <DashboardSquadWeaponPerformance />
          </BaseDashboardCard>
        </div>
      </div>
    </div>
  );
}
