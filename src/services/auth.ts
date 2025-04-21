import { User } from "@/types/user";
import { axiosInstance as axios } from "./requestService";
import { LoginUserData, RegisterUserData } from "@/types/auth";

async function registerCommander(user: RegisterUserData) {
  user.user_role = "Team commander";
  const res = await axios.post(`auth/signup/commander`, user);
  return res.data;
}
async function registerSquadCommander(user: RegisterUserData) {
  user.user_role = "Squad commander";
  const res = await axios.post(`auth/signup/squad-commander`, user);
  return res.data;
}
async function registerSoldier(user: User) {
  const res = await axios.post(`auth/signup/soldier`, user);
  return res.data;
}

async function login(user: LoginUserData) {
  const res = await axios.post(`auth/login`, user);
  return res.data;
}

export const authService = {
  registerCommander,
  registerSoldier,
  registerSquadCommander,
  login,
};
