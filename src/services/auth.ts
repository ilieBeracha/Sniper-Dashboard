import { LoginUserData, RegisterUserData } from "@/types/auth";
import { axiosInstance as axios } from "./requestService";

async function registerCommander(user: RegisterUserData) {
  user.user_role = "commander";
  const res = await axios.post(`auth/signup/commander`, user);
  return res.data;
}
async function registerSquadCommander(user: RegisterUserData) {
  user.user_role = "squad-commander";
  const res = await axios.post(`auth/signup/squad-commander`, user);
  return res.data;
}
async function registerSoldier(user: RegisterUserData) {
  user.user_role = "soldier";
  const res = await axios.post(`auth/signup/soldier`, user);
  return res.data;
}

async function login(user: LoginUserData) {
  console.log("login", user);
  const res = await axios.post(`auth/login`, user);
  return res.data;
}

export const authService = {
  registerCommander,
  registerSoldier,
  registerSquadCommander,
  login,
};
