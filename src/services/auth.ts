import { axiosInstance as axios } from "./requestService";

async function registerCommander(user: {}) {
  const res = await axios.post(`auth/signup/commander`, user);
  return res.data;
}
async function registerSoldier(user: {}) {
  const res = await axios.post(`auth/signup/commander`, user);
  return res.data;
}

async function login(user: {}) {
  const res = await axios.post(`auth/login`, user);
  return res.data;
}

export const authService = {
  registerCommander,
  registerSoldier,
  login,
};
