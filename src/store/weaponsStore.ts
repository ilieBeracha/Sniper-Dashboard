import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWeapon, deleteWeapon, getWeapons, updateWeapon } from "@/services/weaponsService";
import { Weapon } from "@/types/weapon";

export const weaponsStore = create(
  persist<{
    weapons: Weapon[];
    getWeapons: (teamId: string) => Promise<void>;
    createWeapon: (weapon: Weapon) => Promise<void>;
    updateWeapon: (id: string, weapon: Partial<Weapon>) => Promise<void>;
    deleteWeapon: (id: string) => Promise<void>;
  }>(
    (set, get) => ({
      weapons: [],

      getWeapons: async (teamId: string) => {
        const weapons = await getWeapons(teamId);
        set({ weapons });
      },

      createWeapon: async (weapon: Weapon) => {
        const newWeapon = await createWeapon(weapon);
        set({ weapons: [...get().weapons, newWeapon] });
      },

      updateWeapon: async (id: string, weapon: Partial<Weapon>) => {
        const updatedWeapon = await updateWeapon(id, weapon);
        if (updatedWeapon) {
          set({
            weapons: get().weapons.map((w) => (w.id === id ? { ...w, ...updatedWeapon } : w)),
          });
        }
      },

      deleteWeapon: async (id: string) => {
        try {
          const deletedWeapon = (await deleteWeapon(id)) as Weapon;
          set({ weapons: get().weapons.filter((w) => w.id !== deletedWeapon.id) });
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
    {
      name: "weapons-storage",
    },
  ),
);
