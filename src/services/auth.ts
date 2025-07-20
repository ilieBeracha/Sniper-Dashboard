import { v4 as uuidv4 } from "uuid";
import { LoginUserData, RegisterUserData } from "@/types/auth";
import { supabase } from "./supabaseClient";
import { APP_CONFIG } from "@/config/constants";
import {
  createSupabaseUser,
  signInUser,
  getUserProfileById,
  soldierRegisterFlowWithInviteSQL,
  squadCommanderRegisterFlowWithInviteSQL,
} from "./userService";
import { createTeamInvite, validateInvite } from "./invitationService";

const UserRole = {
  Commander: "commander",
  SquadCommander: "squad_commander",
  Soldier: "soldier",
} as const;

async function registerCommander(user: RegisterUserData) {
  try {
    // 1. Sign up user in Supabase Auth
    const userData = await createSupabaseUser(user.email, user.password);
    if (!userData.user) {
      throw new Error("Failed to create user");
    }
    const userId = userData.user.id;

    const { data, error } = await supabase.rpc("commander_register_flow", {
      user_id: userId,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    if (error) {
      console.error("commander_register_flow failed:", error.message);
      throw new Error("Commander SQL flow failed");
    }

    const team_id = data?.[0]?.team_id;
    const invite_code = uuidv4();

    const invite_token = await createTeamInvite(userId, team_id, user.email, invite_code);

    const tokenData = await signInUser(user.email, user.password);

    // 5. Return response
    return {
      registered: true,
      user: {
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_role: "commander",
      },
      access_token: tokenData.session?.access_token,
      refresh_token: tokenData.session?.refresh_token,
      team_invite_code: invite_token,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Commander signup failed: " + message);
  }
}

async function registerSquadCommander(user: RegisterUserData) {
  try {
    const invite_code = user.invite_code || "";
    await validateInvite(invite_code, UserRole.SquadCommander);

    const userData = await createSupabaseUser(user.email, user.password);
    if (!userData.user) {
      throw new Error("Failed to create user");
    }
    const user_id = userData.user.id;

    const data = await squadCommanderRegisterFlowWithInviteSQL(user_id, user.email, user.first_name, user.last_name, invite_code);
    const tokenData = await signInUser(user.email, user.password);
    const userProfile = await getUserProfileById(user_id);

    return {
      registered: true,
      user: userProfile,
      squad_id: data?.[0]?.squad_id,
      team_id: data?.[0]?.team_id,
      squad_invite_code: data?.[0]?.squad_invite_code,
      access_token: tokenData.session?.access_token,
      refresh_token: tokenData.session?.refresh_token,
    };
  } catch (err: any) {
    console.error("Squad commander signup failed:", err);
    throw new Error("Squad commander signup failed: " + err.message);
  }
}

async function registerSoldier(user: RegisterUserData) {
  try {
    const invite_code = user.invite_code || "";
    await validateInvite(invite_code, UserRole.Soldier);

    const userData = await createSupabaseUser(user.email, user.password);
    if (!userData.user) {
      throw new Error("Failed to create user");
    }
    const user_id = userData.user.id;

    const data = await soldierRegisterFlowWithInviteSQL(user_id, user.email, user.first_name, user.last_name, invite_code);
    const tokenData = await signInUser(user.email, user.password);
    const userProfile = await getUserProfileById(user_id);

    return {
      user: userProfile,
      squad_id: data?.[0]?.squad_id,
      team_id: data?.[0]?.team_id,
      access_token: tokenData.session?.access_token,
      refresh_token: tokenData.session?.refresh_token,
    };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Soldier signup failed: " + message);
  }
}

async function login(user: LoginUserData) {
  try {
    const tokenData = await signInUser(user.email, user.password);
    const userProfile = await getUserProfileById(tokenData.user.id);

    return {
      user: userProfile,
      access_token: tokenData.session?.access_token,
      refresh_token: tokenData.session?.refresh_token,
    };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Login failed: " + message);
  }
}

async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: APP_CONFIG.AUTH.EMAIL_REDIRECT_URL,
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

export const authService = {
  signInWithEmail,
  registerCommander,
  registerSoldier,
  registerSquadCommander,
  login,
};
