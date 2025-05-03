import { getWeapons } from "@/services/weaponsService";
import { createStore } from "zustand";
import { Weapon } from "@/types/weapon";

export const weaponsStore = createStore<{ weapons: Weapon[], getWeapons: (teamId: string) => Promise<void> }>((set) => ({
    weapons: [] as Weapon[],

    getWeapons: async (teamId: string) => {
        const weapons = await getWeapons(teamId);
        set({ weapons: weapons as Weapon[] });
    }
}))