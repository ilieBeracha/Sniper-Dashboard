import { create } from "zustand";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { updateUser } from "@/services/userService";

interface UserStore {
  user: User | null;
  clearUser: () => void;
  setUser: (user: User) => void;
  setUserFromAuth: (authUser: SupabaseAuthUser) => void;
  updateUser: (user_data: Partial<User>) => Promise<User | null>;
}

export const userStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: (user: User) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },

  setUserFromAuth: (authUser: SupabaseAuthUser) => {
    if (!authUser) return;
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

    set({ user: mappedUser });
  },

  updateUser: async (user_data: Partial<User>) => {
    const id = get().user?.id;

    if (!id) return null;
    const updatedUser = await updateUser(id, user_data);
    set({ user: updatedUser as unknown as User });
    return updatedUser;
  },
}));
