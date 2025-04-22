import { create } from "zustand";
import { User } from "../types/user";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const userStore = create<UserStore>((set) => ({
  user: JSON.parse(localStorage.getItem("user_sniper") || "null"),

  setUser: (user) => {
    localStorage.setItem("user_sniper", JSON.stringify(user));
    set({ user });
  },

  clearUser: () => {
    localStorage.removeItem("user_sniper");
    set({ user: null });
  },
}));
