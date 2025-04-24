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
  registerSoldier: (user: RegisterUserData) => Promise<string | Error>;

  supabaseLogin: (session: {
    access_token: string;
    refresh_token: string;
  }) => void;
  error: string;
  resetError: () => void;

  isLoadingAuth: boolean;
}

export const authStore = create<props>((set, get) => ({
  token: null,
  registered: false,
  error: "",
  isLoadingAuth: true,

  checkAuth: async () => {
    set({ isLoadingAuth: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);
    if (session?.access_token) {
      set({ token: session.access_token });
    }
    set({ isLoadingAuth: false });
  },

  registerCommander: async (user: RegisterUserData) => {
    try {
      authStore.getState().resetError();

      const res = await authService.registerCommander(user);
      set({ token: res.access_token });
      get().supabaseLogin(res);
      userStore.getState().setUser(res.user);

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
      get().supabaseLogin(res);

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
      get().supabaseLogin(res);

      userStore.getState().setUser(res.user);

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
      get().supabaseLogin(res);

      set({ token: res.access_token });

      userStore.getState().setUser(res.user);

      return res;
    } catch (error: any) {
      set({ error: error.response.data.error });
      console.log(error);
    }
  },

  logout: async () => {
    set({ token: null });
    await supabase.auth.signOut();

    authStore.getState().resetError();
    userStore.getState().setUser({} as User);
    location.href = "/";
  },

  supabaseLogin: async (session: {
    access_token: string;
    refresh_token: string;
  }) => {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  },

  resetError: () => set({ error: "" }),
}));
