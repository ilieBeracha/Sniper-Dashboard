import { create } from "zustand";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { User, UserRole } from "@/types/user";

interface UserStore {
  user: User | null;
  userRole: UserRole;
  setUser: (user: User) => void;
  clearUser: () => void;
  setUserFromAuth: (authUser: SupabaseAuthUser) => void;
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  userRole: "" as UserRole,

  setUser: (user) => {
    set({ user, userRole: user.user_role });
  },

  clearUser: () => {
    set({ user: null });
  },

  setUserFromAuth: (authUser: SupabaseAuthUser) => {
    if (!authUser) return;
    console.log("authUser", authUser);
    const meta = authUser.app_metadata || {};

    const mappedUser = {
      id: authUser.id,
      email: authUser.email ?? "",
      first_name: meta.first_name ?? "",
      last_name: meta.last_name ?? "",
      user_role: meta.user_role ?? "",
      team_id: meta.team_id ?? "",
      squad_id: meta.squad_id ?? "",
      team_name: meta.team_name ?? "",
      squad_name: meta.squad_name ?? "",
      created_at: authUser.created_at ?? "",
    };

    set({ user: mappedUser, userRole: mappedUser.user_role });
  },
}));
