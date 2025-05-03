import { create } from "zustand";

interface LoaderStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const loaderStore = create<LoaderStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
