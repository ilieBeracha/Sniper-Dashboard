import { supabase } from "./supabaseClient";

export const fetchCurrentUserProfile = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
