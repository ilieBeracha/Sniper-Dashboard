import { create } from "zustand";
import { detectGrouping } from "./GroupingDetectorModel";

type GroupingDetectorStore = {
  detectedGrouping: any;
  detectGrouping: (file: File) => Promise<any>;
};

export const useGroupingDetectorStore = create<GroupingDetectorStore>((set) => ({
  detectedGrouping: [],
  detectGrouping: async (file: File) => {
    const response = await detectGrouping(file);
    set({ detectedGrouping: response });
    return response;
  },
  resetDetectedGrouping: () => set({ detectedGrouping: [] }),
}));
