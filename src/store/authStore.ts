import { create } from "zustand";
import { authService } from "../services/auth";
import { userStore } from "./userStore";
import { User } from "../types/user";
import { LoginUserData, RegisterUserData } from "../types/auth";
import { supabase } from "@/services/supabaseClient";

interface props {
  token: string | null;
  registerCommander: (userData: RegisterUserData) => Promise<string | Error>;
  login: (userData: LoginUserData) => Promise<string | Error | any>;
  logout: () => void;
  checkAuth: () => void;
  setTokenInLocalStorage: (token: string) => void;
  registerSoldier: (user: RegisterUserData) => Promise<string | Error>;

  error: string;
  resetError: () => void;
}

export const authStore = create<props>((set) => ({
  token: localStorage.getItem("access_token_sniper") || null,
  registered: false,
  error: "",

  checkAuth: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      set({ token: session.access_token });
      authStore.getState().setTokenInLocalStorage(session.access_token);
      // optionally fetch user here from your users table
    }
  },

  setTokenInLocalStorage: (token: string) => {
    localStorage.setItem("access_token_sniper", token);
  },

  registerCommander: async (user: RegisterUserData) => {
    try {
      authStore.getState().resetError();

      const res = await authService.registerCommander(user);
      set({ token: res.access_token });
      await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
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
      await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
      return res;
    } catch (error: any) {
      set({ error: error.response.data.error });
      console.log(error);
    }
  },

  registerSoldier: async (user: RegisterUserData) => {
    try {
      const res = await authService.registerSoldier(user);
      set({ token: res.access_token });
      await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
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
      await supabase.auth.signOut();

      authStore.getState().resetError();
      const res = await authService.login(user);
      await supabase.auth.setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      });
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

  resetError: () => set({ error: "" }),
}));
