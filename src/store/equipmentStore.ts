import { getEquipmentsByTeamId } from "@/services/equipmentService";
import { createStore } from "zustand";
import { Equipment } from "@/types/equipment";

interface EquipmentStore {
  equipments: Equipment[];
  getEqipmentsByTeamId: (teamId: string) => Promise<void>;
}

export const equipmentStore = createStore<EquipmentStore>((set) => ({
  equipments: [],

  getEqipmentsByTeamId: async (teamId: string) => {
    try {
      const equipment = await getEquipmentsByTeamId(teamId);
      set({ equipments: equipment as Equipment[] });
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      set({ equipments: [] });
    }
  },
}));
