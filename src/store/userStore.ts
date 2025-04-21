import { create } from "zustand";
import { User } from "../types/user";

interface props {
  user: User | {user: null};
  setUser: (user: User) => void;
}

export const userStore = create<props>((set) => ({
  user: {} as User,

  setUser: (user: any) => {
    set({ user });
  },
}));
