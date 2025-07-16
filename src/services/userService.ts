import { User } from "@/types/user";
import { supabase } from "./supabaseClient";

export const updateUser = async (id: string, user_data: Partial<User>) => {
  const { data, error } = await supabase.schema("public").from("users").update(user_data).eq("id", id).select().single();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase.schema("public").from("users").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);
  return data;
};
