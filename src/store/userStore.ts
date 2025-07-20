import { create } from "zustand";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { updateUser, getUserById } from "@/services/userService";

interface UserStore {
  user: User | null;
  clearUser: () => void;
  setUser: (user: User) => void;
  setUserFromAuth: (authUser: SupabaseAuthUser) => void;
  updateUser: (user_data: Partial<User>) => Promise<User | null>;
  fetchUserFromDB: () => Promise<User | null>;
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
    const user_metadata = authUser.user_metadata || {};

    const mappedUser = {
      id: authUser.id,
      email: authUser.email ?? "",
      first_name: user_metadata.first_name ?? "",
      last_name: user_metadata.last_name ?? "",
      user_role: user_metadata.user_role ?? "",
      team_id: user_metadata.team_id ?? "",
      squad_id: user_metadata.squad_id ?? "",
      team_name: user_metadata.team_name ?? "",
      user_default_duty: user_metadata.user_default_duty ?? "",
      user_default_weapon: user_metadata.user_default_weapon ?? "",
      user_default_equipment: user_metadata.user_default_equipment ?? "",
      squad_name: user_metadata.squad_name ?? "",
      created_at: authUser.created_at ?? "",
      user_default_duty: meta.user_default_duty ?? null,
      user_default_weapon: meta.user_default_weapon ?? null,
      user_default_equipment: meta.user_default_equipment ?? null,
    };

    set({ user: mappedUser });
  },

  updateUser: async (user_data: Partial<User>) => {
    const currentUser = get().user;
    const id = currentUser?.id;

    if (!id) return null;
    const updatedUser = await updateUser(id, user_data);
    
    // Merge the updated data with the existing user data
    const mergedUser = { ...currentUser, ...updatedUser };
    set({ user: mergedUser });
    return mergedUser;
  },

  fetchUserFromDB: async () => {
    const currentUser = get().user;
    const id = currentUser?.id;

    if (!id) return null;
    
    try {
      const freshUser = await getUserById(id);
      set({ user: freshUser });
      return freshUser;
    } catch (error) {
      console.error("Error fetching user from DB:", error);
      return null;
    }
  },
}));

