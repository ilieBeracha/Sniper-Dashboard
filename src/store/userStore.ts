import { create } from "zustand";
import { User } from "../types/user";

interface props {
  user: User | null;
  setUser: (user: User) => void;
}

export const userStore = create<props>((set) => ({
  user: JSON.parse(localStorage.getItem("user_sniper") as string) as User,

  setUser: (user: any) => {
    set({ user });
    localStorage.setItem("user_sniper", JSON.stringify(user));
  },
}));
