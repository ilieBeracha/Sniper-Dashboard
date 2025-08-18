import { useEffect, useState } from "react";
import { StatsFilters, PositionEnum } from "@/types/stats";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { DayNight } from "@/types/equipment";

export const useStatsFilters = () => {
  const { user } = useStore(userStore);

  const [filters, setFilters] = useState<StatsFilters>({
    squadIds: null, // set to ['<squad-uuid>', ...] for squad mode
    startDate: null,
    endDate: null,
    dayNight: null as DayNight[] | null,
    positions: null as PositionEnum[] | null,
  });

  useEffect(() => {
    if (user?.id) {
      setFilters((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user?.id]);

  const clearFilters = () => {
    setFilters({
      squadIds: null,
      startDate: null,
      endDate: null,
      dayNight: null,
      positions: null,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (key: keyof StatsFilters, value: string | string[] | number | boolean | null) =>
    setFilters((prev) => ({ ...prev, [key]: value as any }));

  return { filters, setFilters, isLoading, setIsLoading, handleFilterChange, clearFilters };
};
