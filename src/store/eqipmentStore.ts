import { getEquipmentsByTeamId } from "@/services/equipmentService";
import { createStore } from "zustand";
import { Eqipment } from "@/types/eqipment";

interface EqipmentStore {
    eqipments: Eqipment[];
    getEqipmentsByTeamId: (teamId: string) => Promise<void>;
}

export const eqipmentStore = createStore<EqipmentStore>((set) => ({
    eqipments: [],
    
    getEqipmentsByTeamId: async (teamId: string) => {
        const eqipment = await getEquipmentsByTeamId(teamId);
        set({ eqipments: eqipment as Eqipment[] });
    },
    
}))

