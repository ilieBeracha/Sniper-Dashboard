import { create } from "zustand";
import { User, UserRole } from "../types/user";

interface UserStore {
  user: User | null;
  userRole: UserRole | null;
  setUser: (user: User) => void;

  clearUser: () => void;
}

export const userStore = create<UserStore>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user_sniper") || "null")
      : null,
  userRole: null,

  setUser: (user) => {
    localStorage.setItem("user_sniper", JSON.stringify(user));
    set({ user, userRole: user.user_role });
  },

  clearUser: () => {
    localStorage.removeItem("user_sniper");
    set({ user: null });
  },
}));
