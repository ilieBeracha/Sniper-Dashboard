import { create } from "zustand";
import { authService } from "../services/auth";
import { userStore } from "./userStore";
import { User } from "../types/user";
import { LoginUserData, RegisterUserData } from "../types/auth";

interface props {
  token: string | null;
  register: (userData: RegisterUserData) => Promise<string | Error>;
  login: (userData: LoginUserData) => Promise<string | Error>;
  logout: () => void;
  checkAuth: () => void;

  setTokenInLocalStorage: (token: string) => void;
}

export const authStore = create<props>((set) => ({
  token: localStorage.getItem("access_token_sniper") || null,

  checkAuth: async () => {
    const token = localStorage.getItem("access_token_sniper");
    if (token) {
      set({ token });
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
      set({ token: res.access_token });

      authStore.getState().setTokenInLocalStorage(res.access_token);
      userStore.getState().setUser(res.user);

      return res;
    } catch (error) {
      console.log(error);
    }
  },

  logout: () => {
    localStorage.removeItem("access_token_sniper");
    set({ token: null });
    userStore.getState().setUser({} as User);
    location.href = "/";
  },
}));
