import { LoginUserData, RegisterUserData } from "@/types/auth";
import { toastService } from "./toastService";
import { axiosInstance } from "./requestService";

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
  try {
    const res = await axiosInstance.post(`auth/login`, user);
    return res.data;
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    toastService.error(error.message);
    throw new Error("Failed to login");
  }
}

export const authService = {
  registerCommander,
  registerSoldier,
  registerSquadCommander,
  login,
};
