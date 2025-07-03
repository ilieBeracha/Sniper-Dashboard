import { createEquipment, getEquipmentsByTeamId } from "@/services/equipmentService";
import { createStore } from "zustand";
import { Equipment } from "@/types/equipment";

interface EquipmentStore {
  equipments: Equipment[];
  getEqipmentsByTeamId: (teamId: string) => Promise<void>;
  createEquipment: (equipment: Equipment) => Promise<void>;
}

export const equipmentStore = createStore<EquipmentStore>((set) => ({
  equipments: [],

  getEqipmentsByTeamId: async (teamId: string) => {
    const equipment = await getEquipmentsByTeamId(teamId);
    set({ equipments: equipment as Equipment[] });
  },

  createEquipment: async (equipment: Equipment) => {
    const newEquipment = await createEquipment(equipment);
    set({ equipments: [...equipmentStore.getState().equipments, newEquipment as Equipment] });
  },
}));
