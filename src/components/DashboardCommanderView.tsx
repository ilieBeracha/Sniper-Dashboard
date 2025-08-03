import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import UserRoleAccuracyTable from "./UserRoleAccuracyTable";
import { getSquads } from "@/services/squadService";
import CommanderTeamDispersionTable from "./CommanderTeamDispersionTable";

const CommanderView = () => {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { commanderUserRoleBreakdown, fetchCommanderUserRoleBreakdown, commanderTeamDispersion } = useStore(performanceStore);

  const [loading, setLoading] = useState(true);
  const [weaponType, setWeaponType] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [dayPeriod, setDayPeriod] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Set default date range to last month
  useEffect(() => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    setStartDate(lastMonth);
    setEndDate(now);
  }, []);

  useEffect(() => {
    if (!user?.team_id) return;

    const formattedStart = startDate?.toISOString().split("T")[0] ?? null;
    const formattedEnd = endDate?.toISOString().split("T")[0] ?? null;

    performanceStore.getState().fetchCommanderTeamDispersion(user.team_id, {
      startDate: formattedStart ?? undefined,
      endDate: formattedEnd ?? undefined,
      weaponType: weaponType ?? undefined,
      position: position ?? undefined,
      dayPeriod: dayPeriod ?? undefined,
    });
  }, [user?.team_id, startDate, endDate, weaponType, position, dayPeriod]);

  useEffect(() => {
    (async () => {
      if (!user?.team_id) return;
      await fetchCommanderUserRoleBreakdown(user.team_id);
      await getSquads(user.team_id);
      setLoading(false);
    })();
  }, [user?.team_id, fetchCommanderUserRoleBreakdown]);

  return (
    <div className="flex flex-col gap-6">
      <CommanderTeamDispersionTable 
        theme={theme} 
        data={commanderTeamDispersion}
        selectedWeapon={weaponType || ""}
        selectedPosition={position || ""}
        selectedDayPeriod={dayPeriod || ""}
        onWeaponChange={setWeaponType}
        onPositionChange={setPosition}
        onDayPeriodChange={setDayPeriod}
      />
      <UserRoleAccuracyTable loading={loading} commanderUserRoleBreakdown={commanderUserRoleBreakdown} theme={theme} />
    </div>
  );
};

export default CommanderView;
