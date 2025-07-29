import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createEquipment, getEquipmentsByTeamId, updateEquipment, deleteEquipment } from "@/services/equipmentService";
import { Equipment } from "@/types/equipment";

interface EquipmentStore {
  equipments: Equipment[];
  getEquipments: (teamId: string) => Promise<void>;
  createEquipment: (equipment: Equipment) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
}

export const equipmentStore = create(
  persist<EquipmentStore>(
    (set, get) => ({
      equipments: [],

      getEquipments: async (teamId: string) => {
        const equipment = await getEquipmentsByTeamId(teamId);
        set({ equipments: equipment as Equipment[] });
      },

      createEquipment: async (equipment: Equipment) => {
        const newEquipment = await createEquipment(equipment);
        set({ equipments: [...get().equipments, newEquipment as Equipment] });
      },

      updateEquipment: async (id: string, equipment: Partial<Equipment>) => {
        const updatedEquipment = await updateEquipment(id, equipment);
        if (updatedEquipment) {
          set({
            equipments: get().equipments.map((e) => (e.id === id ? { ...e, ...updatedEquipment } : e)),
          });
        }
      },

      deleteEquipment: async (id: string) => {
        await deleteEquipment(id);
        set({ equipments: get().equipments.filter((e) => e.id !== id) });
      },
    }),
    {
      name: "equipments-storage",
    },
  ),
);
