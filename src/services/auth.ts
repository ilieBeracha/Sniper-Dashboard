import { LoginUserData, RegisterUserData } from "@/types/auth";
import { toastService } from "./toastService";
import { axiosInstance } from "./requestService";
import { supabase } from "./supabaseClient";

async function registerCommander(user: RegisterUserData) {
  user.user_role = "commander";
  try {
    const res = await axiosInstance.post(`auth/signup/commander`, user);
    return res.data;
  } catch (error: any) {
    console.error("Error registering commander:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to register commander");
  }
}
async function registerSquadCommander(user: RegisterUserData) {
  user.user_role = "squad-commander";
  try {
    const res = await axiosInstance.post(`auth/signup/squad-commander`, user);
    return res.data;
  } catch (error: any) {
    console.error("Error registering squad commander:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to register squad commander");
  }
}
async function registerSoldier(user: RegisterUserData) {
  user.user_role = "soldier";
  try {
    const res = await axiosInstance.post(`auth/signup/soldier`, user);
    return res.data;
  } catch (error: any) {
    console.error("Error registering soldier:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to register soldier");
  }
}

async function login(user: LoginUserData) {
  if (user.email && !user.password) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: user.email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: "https://www.scope-stats.com",
      },
    });
    if (error) {
      console.error("Error signing in with email:", error.message);
      toastService.error(error.message);
      throw new Error("Failed to sign in with email");
    }
    return data;
  }

  try {
    const res = await axiosInstance.post(`auth/login`, user);
    return res.data;
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to login");
  }
}

async function handleSignInWithGoogle(response: any) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
  });
  if (error) {
    console.error("Error signing in with Google:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to sign in with Google");
  }
  return data;
}

async function sendPhoneOTP(phoneNumber: string) {
  try {
    // Supabase expects phone numbers with + prefix
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    console.log("Sending OTP to phone:", formattedPhone);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        shouldCreateUser: true, // Changed to true to allow new users
      },
    });
    
    if (error) {
      console.error("Error sending OTP:", error.message, error);
      toastService.error(error.message);
      throw new Error(error.message || "Failed to send verification code");
    }
    
    console.log("OTP sent successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error sending OTP:", error.message);
    toastService.error(error.message);
    throw error;
  }
}

async function verifyPhoneOTP(phoneNumber: string, otp: string) {
  try {
    // Supabase expects phone numbers with + prefix
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms',
    });
    
    if (error) {
      console.error("Error verifying OTP:", error.message);
      toastService.error(error.message);
      throw new Error("Invalid verification code");
    }
    
    return data;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.message);
    toastService.error(error.message);
    throw error;
  }
}

export const authService = {
  registerCommander,
  registerSoldier,
  registerSquadCommander,
  login,
  handleSignInWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
};
