import { useEffect, useState } from "react";
import { StatsFilters } from "@/types/stats";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";

export const useStatsFilters = () => {
  const { user } = useStore(userStore);
  const [filters, setFilters] = useState<StatsFilters>({
    teamId: user?.team_id ?? null,
    squadId: null,
    userId: user?.id ?? null,
    isSquad: true, // default to squad view to avoid empty scope
    startDate: null,
    endDate: null,
    dayNight: null,
    positions: null,
    minShots: null,
  });

  useEffect(() => {
    setFilters({
      teamId: user?.team_id ?? null,
      squadId: user?.squad_id ?? null,
      userId: user?.id ?? null,
      isSquad: true,
      startDate: null,
      endDate: null,
      dayNight: null,
      positions: null,
      minShots: null,
    });
  }, [user]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filter: keyof StatsFilters, value: string | string[] | number | boolean | null) => {
    setFilters((prev) => ({ ...prev, [filter]: value as any }));
  };

  return { filters, setFilters, isLoading, setIsLoading, handleFilterChange };
};
