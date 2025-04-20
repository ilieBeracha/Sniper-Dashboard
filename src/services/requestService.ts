import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import { authStore } from '@/store/authStore';

const VITE_AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${VITE_AUTH_BASE_URL}`,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("codeQuestAccess");

    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config as unknown as InternalAxiosRequestConfig<any>;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (res: AxiosResponse) => res,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       authStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );
