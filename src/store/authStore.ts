import { create } from "zustand";
import { authService } from "../services/auth";
import { userStore } from "./userStore";

interface props {
  token: string | null;
  isLoggedIn: boolean;
  register: (userData: any) => Promise<string | Error>;
  login: (userData: any) => Promise<string | Error>;
  checkAuth: () => void;

  setTokenInLocalStorage: (token: string) => void;
}

export const authStore = create<props>((set, get) => ({
  token: localStorage.getItem("access_token_sniper") || null,
  isLoggedIn: false,

  checkAuth: async () => {
    const token = localStorage.getItem("access_token_sniper");
    if (token) {
      set({ token, isLoggedIn: true });
    }
  },

  setTokenInLocalStorage: (token: string) => {
    localStorage.setItem("access_token_sniper", token);
  },

  register: async (user: {}) => {
    try {
      const res = await authService.register(user);
      set({ token: res.access_token });

      userStore.getState().setUser(res.user);
      authStore.getState().setTokenInLocalStorage(res.access_token);

      return res;
    } catch (error) {
      console.log(error);
    }
  },

  login: async (user: {}) => {
    try {
      const res = await authService.login(user);
      authStore
        .getState()
        .setTokenInLocalStorage(res.user.session.access_token);
      userStore.getState().setUser(res.user.session.access_token);
      set({ isLoggedIn: true });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
}));
