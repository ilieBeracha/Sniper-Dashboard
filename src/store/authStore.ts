import { create } from "zustand";
import { userStore } from "./userStore";

import { supabase } from "@/services/supabaseClient";
import { LoginUserData, RegisterUserData } from "@/types/auth";
import { authService } from "@/services/auth";
import { User } from "@/types/user";

interface props {
  token: string | null;
  registerCommander: (userData: RegisterUserData) => Promise<any>;
  login: (userData: LoginUserData) => Promise<any>;
  logout: () => void;
  signInWithEmail: (email: string) => Promise<any>;
  checkAuth: () => void;
  registerSoldier: (user: RegisterUserData) => Promise<any>;
  registerSquadCommander: (user: RegisterUserData) => Promise<any>;
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

  signInWithEmail: async (email: string) => {
    try {
      const res = await authService.login({ email, password: "" });
      set({ token: res.access_token });
      get().supabaseLogin(res);
      userStore.getState().setUser(res.user as unknown as User);

      return res;
    } catch (error: any) {
      set({ error: error.message });
      console.log(error);
    }
  },
  registerCommander: async (user: RegisterUserData) => {
    try {
      authStore.getState().resetError();

      const res = await authService.registerCommander(user);
      set({ token: res.access_token });
      get().supabaseLogin(res);
      userStore.getState().setUser(res.user as unknown as User);

      return res;
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed";
      set({ error: errorMessage });
      throw error;
    }
  },

  registerSquadCommander: async (user: RegisterUserData) => {
    try {
      const res = await authService.registerSquadCommander(user);
      set({ token: res.access_token });

      userStore.getState().setUser(res.user as unknown as User);
      get().supabaseLogin(res);

      return res;
    } catch (error: any) {
      const errorMessage = error?.message || "Squad commander registration failed";
      set({ error: errorMessage });
      console.log(error);
      throw error;
    }
  },

  registerSoldier: async (user: RegisterUserData) => {
    try {
      const res = await authService.registerSoldier(user);
      set({ token: res.access_token });
      get().supabaseLogin(res);

      userStore.getState().setUser(res.user as unknown as User);

      return res;
    } catch (error: any) {
      const errorMessage = error?.message || "Soldier registration failed";
      set({ error: errorMessage });
      console.log(error);
      throw error;
    }
  },

  login: async (user: LoginUserData) => {
    try {
      console.log("login", user);
      authStore.getState().resetError();
      const res = await authService.login(user);
      get().supabaseLogin(res);
      userStore.getState().setUser(res.user as User);

      set({ token: res.access_token });

      return res;
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed";
      set({ error: errorMessage });
      console.log(error);
      throw error;
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
