import { getWeapons } from "@/services/weaponsService";
import { createStore } from "zustand";

export interface Weapon {
    id: string;
    name: string;
    type: string;

}

export const weaponsStore = createStore<{ weapons: Weapon[], getWeapons: () => void }>((set) => ({
    weapons: [],

    getWeapons: () => {
        const weapons = getWeapons();
        set({ weapons: weapons as any });
    }
}))