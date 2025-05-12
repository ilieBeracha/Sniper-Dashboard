import { create } from "zustand";
import { userStore } from "./userStore";

import { supabase } from "@/services/supabaseClient";
import { LoginUserData, RegisterUserData } from "@/types/auth";
import { authService } from "@/services/auth";
import { User } from "@/types/user";

interface props {
  token: string | null;
  registerCommander: (userData: RegisterUserData) => Promise<string | Error>;
  login: (userData: LoginUserData) => Promise<string | Error | any>;
  logout: () => void;
  checkAuth: () => void;
  registerSoldier: (user: RegisterUserData) => Promise<string | Error>;
  registerSquadCommander: (user: RegisterUserData) => Promise<string | Error>;
  supabaseLogin: (session: { access_token: string; refresh_token: string }) => void;
  error: string;
  resetError: () => void;

  isLoadingAuth: boolean;
}

export const authStore = create<props>((set, get) => ({
  token: null,
  error: "",
  isLoadingAuth: true,

  checkAuth: async () => {
    set({ isLoadingAuth: true });
    try {
      await supabase.auth.refreshSession();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Session refresh error:", error?.message);
        set({ token: null });
        userStore.getState().clearUser();
      } else {
        set({ token: session.access_token });

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          userStore.getState().setUserFromAuth(user);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      set({ isLoadingAuth: false });
    }
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
      userStore.getState().setUser(res.user);

      set({ token: res.access_token });

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

  supabaseLogin: async (session: { access_token: string; refresh_token: string }) => {
    const { data, error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      console.error("Error setting session:", error);
    }

    if (data?.user) {
      userStore.getState().setUserFromAuth(data.user);
    } else {
      console.error("No user found in session");
    }
  },

  resetError: () => set({ error: "" }),
}));
