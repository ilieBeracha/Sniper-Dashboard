import { User } from "@/types/user";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const updateUser = async (id: string, user_data: Partial<User>) => {
  try {
    const { data, error } = await supabase.from("users").update(user_data).eq("id", id).select().single();
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error updating user:", error);
    toastService.error(error.message);
    throw new Error("User not found");
  }
};

export async function getUserProfileById(userId: string) {
  try {
    const { data, error } = await supabase.schema("public").from("users").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    toastService.error(error.message);
    throw new Error("User profile not found");
  }
}
