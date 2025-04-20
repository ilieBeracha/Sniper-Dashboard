import { axiosInstance as axios } from "./requestService";

async function register(user: {}) {
  const res = await axios.post(`auth/signup`, user);
  return res.data;
}

async function login(user: {}) {
  const res = await axios.post(`auth/login`, user);
  return res.data;
}

export const authService = {
  register,
  login,
};
