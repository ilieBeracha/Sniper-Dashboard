import { supabase } from "./supabaseClient";

export const fetchCurrentUserProfile = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not logged in");

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();

  if (error) throw new Error(error.message);
  return data;
};

export const get_user_score_profile = async (user_id: string) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not logged in");

  const { data, error } = await supabase.rpc("get_user_score_profile", {
    p_user_id: user_id,
  });

  if (error) throw new Error(error.message);
  return data;
};
