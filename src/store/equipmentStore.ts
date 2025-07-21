import { createEquipment, getEquipmentsByTeamId, updateEquipment } from "@/services/equipmentService";
import { createStore } from "zustand";
import { Equipment } from "@/types/equipment";

interface EquipmentStore {
  equipments: Equipment[];
  getEquipments: (teamId: string) => Promise<void>;
  createEquipment: (equipment: Equipment) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
}

export const equipmentStore = createStore<EquipmentStore>((set) => ({
  equipments: [],

  getEquipments: async (teamId: string) => {
    const equipment = await getEquipmentsByTeamId(teamId);
    set({ equipments: equipment as Equipment[] });
  },

  createEquipment: async (equipment: Equipment) => {
    const newEquipment = await createEquipment(equipment);
    set({ equipments: [...equipmentStore.getState().equipments, newEquipment as Equipment] });
  },

  updateEquipment: async (id: string, equipment: Partial<Equipment>) => {
    const updatedEquipment = await updateEquipment(id, equipment);
    if (updatedEquipment) {
      set({
        equipments: equipmentStore.getState().equipments.map(e => 
          e.id === id ? { ...e, ...updatedEquipment } : e
        )
      });
    }
  },
}));
