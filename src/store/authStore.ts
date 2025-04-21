import { create } from "zustand";
import { authService } from "../services/auth";
import { userStore } from "./userStore";
import { User } from "../types/user";
import { LoginUserData, RegisterUserData } from "../types/auth";

interface props {
  token: string | null;
  registerCommander: (userData: RegisterUserData) => Promise<string | Error>;
  login: (userData: LoginUserData) => Promise<string | Error | any>;
  logout: () => void;
  checkAuth: () => void;
  setTokenInLocalStorage: (token: string) => void;
  registerSquadCommander: (user: RegisterUserData) => Promise<string | Error>;

  justRegisteredCommander: boolean;
  resetJustRegistered: () => void;

  error: string;
  resetError: () => void;
}

export const authStore = create<props>((set) => ({
  token: localStorage.getItem("access_token_sniper") || null,
  justRegisteredCommander: false,
  error: "",

  checkAuth: async () => {
    const token = localStorage.getItem("access_token_sniper");
    if (token) {
      set({ token });
    }
  },

  setTokenInLocalStorage: (token: string) => {
    localStorage.setItem("access_token_sniper", token);
  },

  registerCommander: async (user: RegisterUserData) => {
    try {
      authStore.getState().resetError();

      const res = await authService.registerCommander(user);
      set({ token: res.access_token, justRegisteredCommander: true });

      userStore.getState().setUser(res.user);
      authStore.getState().setTokenInLocalStorage(res.access_token);

      return res;
    } catch (error: any) {
      set({ error: error.response.data.error });
      console.log(error);
    }
  },

  registerSquadCommander: async (user: RegisterUserData) => {
    try {
      const res = await authService.registerSquadCommander(user);
      set({ token: res.access_token });

      userStore.getState().setUser(res.user);
      authStore.getState().setTokenInLocalStorage(res.access_token);

      return res;
    } catch (error: any) {
      set({ error: error.response.data.error });
      console.log(error);
    }
  },

  login: async (user: LoginUserData) => {
    try {
      authStore.getState().resetError();
      const res = await authService.login(user);
      set({ token: res.access_token });

      authStore.getState().setTokenInLocalStorage(res.access_token);
      userStore.getState().setUser(res.user);

      return res;
    } catch (error: any) {
      set({ error: error.response.data.error });
      console.log(error);
    }
  },

  logout: () => {
    localStorage.removeItem("access_token_sniper");
    set({ token: null });
    authStore.getState().resetError();
    userStore.getState().setUser({} as User);
    location.href = "/";
  },

  resetJustRegistered: () => set({ justRegisteredCommander: false }),

  resetError: () => set({ error: "" }),
}));
