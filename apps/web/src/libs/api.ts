import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { router } from "../router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      router.navigate({ to: "/login", replace: true }).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
