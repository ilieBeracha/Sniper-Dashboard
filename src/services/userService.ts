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

  // Also update auth metadata if it's the current user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (currentUser && currentUser.id === id) {
    await supabase.auth.updateUser({
      data: user_data,
    });
  }

  return data;
};

export async function createSupabaseUser(email: string, password: string) {
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (userError) {
    throw new Error("Failed to create user: " + userError.message);
  }

  return userData;
}

export async function signInUser(email: string, password: string) {
  const { data: tokenData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    throw new Error("Login failed: " + loginError.message);
  }

  return tokenData;
}

export async function getUserProfileById(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

  if (error || !data) {
    console.error("User profile not found:", error?.message);
    throw new Error("User profile not found");
  }

  return data;
}

export async function squadCommanderRegisterFlowWithInviteSQL(
  user_id: string,
  email: string,
  first_name: string,
  last_name: string,
  invite_code: string,
) {
  const { data, error } = await supabase.rpc("squad_commander_register_flow", {
    user_id,
    email,
    first_name,
    last_name,
    invite_code,
  });

  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete squad commander signup");
  }

  return data;
}

export async function soldierRegisterFlowWithInviteSQL(user_id: string, email: string, first_name: string, last_name: string, invite_code: string) {
  const { data, error } = await supabase.rpc("soldier_register_with_invite", {
    user_id,
    email,
    first_name,
    last_name,
    invite_code,
  });

  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete soldier signup");
  }

  return data;
}

export async function updateUserMetadata(
  id: string,
  email: string,
  first_name: string,
  last_name: string,
  user_role: string,
  team_id: string,
  squad_id: string,
  user_default_duty: string,
  user_default_weapon: string,
  user_default_equipment: string,
) {
  try {
    // Update user profile in the database
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .update({
        email,
        first_name,
        last_name,
        user_role,
        team_id,
        squad_id,
        user_default_duty,
        user_default_weapon,
        user_default_equipment,
      })
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating user profile:", profileError.message);
      throw new Error("Failed to update user profile");
    }

    // Update auth metadata for the current user
    // Note: Users can only update their own metadata, not other users'
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (currentUser && currentUser.id === id) {
      // Update the current user's metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          first_name,
          last_name,
          user_role,
          team_id,
          squad_id,
          user_default_duty,
          user_default_weapon,
          user_default_equipment,
        },
      });
      console.log("authData", authData);

      if (authError) {
        console.error("Error updating auth metadata:", authError.message);
        // Don't throw here, as the profile update was successful
        // Auth metadata is supplementary
      }
    }
    console.log("profileData", profileData);
    return profileData;
  } catch (error) {
    console.error("Error in updateUserMetadata:", error);
    throw error;
  }
}
