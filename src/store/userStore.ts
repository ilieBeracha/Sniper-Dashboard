import { create } from "zustand";

interface props {
  user: any;
  setUser: (user: any) => void;
}

export const userStore = create<props>((set) => ({
  user: {} as {},

  setUser: (user: any) => {
    set({ user });
  },
}));
