import { createScore, getScoresByTrainingId } from "@/services/scoreService";
import { Score } from "@/types/score";
import { create } from "zustand";

interface ScoreStore {
    scores: Score[];
    createScore: (score: Score) => Promise<void>;
    getScoresByTrainingId: (training_id: string) => Promise<void>;
}

export const scoreStore = create<ScoreStore>((set) => ({
    scores: [],
    
    async createScore(store: Score){
        const res = await createScore(store)
        console.log(res)
    },    

    async getScoresByTrainingId(training_id: string){
        const res = await getScoresByTrainingId(training_id)
        set({ scores: res })
    }
}))

