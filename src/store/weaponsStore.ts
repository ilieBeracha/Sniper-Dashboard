import { createWeapon, getWeapons, updateWeapon } from "@/services/weaponsService";
import { createStore } from "zustand";
import { Weapon } from "@/types/weapon";

export const weaponsStore = createStore<{
  weapons: Weapon[];
  getWeapons: (teamId: string) => Promise<void>;
  createWeapon: (weapon: Weapon) => Promise<void>;
  updateWeapon: (id: string, weapon: Partial<Weapon>) => Promise<void>;
}>((set) => ({
  weapons: [] as Weapon[],

  getWeapons: async (teamId: string) => {
    const weapons = await getWeapons(teamId);
    set({ weapons: weapons as Weapon[] });
  },

  createWeapon: async (weapon: Weapon) => {
    const newWeapon = await createWeapon(weapon);
    set({ weapons: [...weaponsStore.getState().weapons, newWeapon as Weapon] });
  },

  updateWeapon: async (id: string, weapon: Partial<Weapon>) => {
    const updatedWeapon = await updateWeapon(id, weapon);
    if (updatedWeapon) {
      set({
        weapons: weaponsStore.getState().weapons.map((w) => (w.id === id ? { ...w, ...updatedWeapon } : w)),
      });
    }
  },
}));
