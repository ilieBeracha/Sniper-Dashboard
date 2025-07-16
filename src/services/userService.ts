import { User } from "@/types/user";
import { supabase } from "./supabaseClient";

export const updateUser = async (id: string, user_data: Partial<User>) => {
  const { data, error } = await supabase.schema("public").from("users").update(user_data).eq("id", id);

  if (error) throw new Error(error.message);
  return data;
};
