// Components
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/StatsUserKPI";
import SquadImpactStats from "@/components/SquadImpactStats";
import Header from "@/Headers/Header";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import { BarChart2 } from "lucide-react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useEffect } from "react";

// Stores
import { performanceStore } from "@/store/performance";
import WeeklyActivityBars from "@/components/WeeklyActivityBars";

export default function Stats() {
  const { user } = useStore(userStore);
  const { getFirstShotMatrix, getUserWeeklyKpisForUser } = useStore(performanceStore);

  // Function to refresh all data
  const refreshData = () => {
    if (user?.team_id) {
      console.log("Refreshing stats page data...");
      getFirstShotMatrix(user.team_id, 7);
      getUserWeeklyKpisForUser(user.id, 7);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.team_id]);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.team_id) {
        console.log("Page became visible, refreshing data...");
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      if (user?.team_id) {
        console.log("Window gained focus, refreshing data...");
        refreshData();
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.team_id]);

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Stats", link: "/stats" }]} />
      <SpPageHeader title="Stats" subtitle="KPIs, impact and trends" icon={BarChart2} />
      <SpPageBody>
        <div className="space-y-3">
          {/* User Performance KPIs - Full width */}
          <WeeklyKPIs />
          
          {/* Activity and Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Weekly Activity */}
            <WeeklyActivityBars />
            
            {/* Squad Impact Stats */}
            <SquadImpactStats />
          </div>
          
          {/* First Shot Matrix - Full width */}
          <ChartMatrix />
        </div>
      </SpPageBody>
    </SpPage>
  );
}
