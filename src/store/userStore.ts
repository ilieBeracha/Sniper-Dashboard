import { create } from "zustand";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { User } from "@/types/user";
import { updateUser, getUserProfileById } from "@/services/userService";
import { getTeamMembers } from "@/services/teamService";

interface UserStore {
  user: User | null;
  teamMembers: User[] | null;
  clearUser: () => void;
  setUser: (user: User) => void;
  setUserFromAuth: (authUser: SupabaseAuthUser) => void;
  updateUser: (user_data: Partial<User>) => Promise<User | null>;
  fetchUserFromDB: () => Promise<User | null>;
  getTeamMembers: (teamId: string) => Promise<void>;
}

export const userStore = create<UserStore>((set, get) => ({
  user: null,
  teamMembers: null,

  setUser: (user: User) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },

  setUserFromAuth: (authUser: SupabaseAuthUser) => {
    if (!authUser) return;
    const app_metadata = authUser.app_metadata || {};

    const mappedUser = {
      id: authUser.id,
      email: authUser.email ?? "",
      first_name: app_metadata.first_name ?? "",
      last_name: app_metadata.last_name ?? "",
      user_role: app_metadata.user_role ?? "",
      team_id: app_metadata.team_id ?? "",
      squad_id: app_metadata.squad_id ?? "",
      team_name: app_metadata.team_name ?? "",
      user_default_duty: app_metadata.user_default_duty ?? "",
      user_default_weapon: app_metadata.user_default_weapon ?? "",
      user_default_equipment: app_metadata.user_default_equipment ?? "",
      squad_name: app_metadata.squad_name ?? "",
      created_at: authUser.created_at ?? "",
    };

    set({ user: mappedUser });
  },

  updateUser: async (user_data: Partial<User>) => {
    const user = get().user;
    const updatedUser = await updateUser(user?.id || "", user_data);
    const mergedUser = { ...user, ...updatedUser };
    set({ user: mergedUser });
    return mergedUser;
  },

  fetchUserFromDB: async () => {
    const currentUser = get().user;
    const id = currentUser?.id;

    if (!id) return null;

    try {
      const freshUser = await getUserProfileById(id);
      set({ user: freshUser });
      return freshUser;
    } catch (error) {
      console.error("Error fetching user from DB:", error);
      return null;
    }
  },
  
  getTeamMembers: async (teamId: string) => {
    try {
      const members = await getTeamMembers(teamId);
      set({ teamMembers: members });
    } catch (error) {
      console.error("Error fetching team members:", error);
      set({ teamMembers: null });
    }
  },
}));
