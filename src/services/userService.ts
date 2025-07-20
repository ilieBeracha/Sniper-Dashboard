import { User } from "@/types/user";
import { supabase } from "./supabaseClient";

export const updateUser = async (id: string, user_data: Partial<User>) => {
  const { data, error } = await supabase.from("users").update(user_data).eq("id", id).select().single();

  if (error) throw new Error(error.message);
  return data;
};

export async function getUserProfileById(userId: string) {
  const { data, error } = await supabase.schema("public").from("users").select("*").eq("id", userId).single();

  if (error || !data) {
    console.error("User profile not found:", error?.message);
    throw new Error("User profile not found");
  }

  return data;
}
