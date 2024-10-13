import axios from "axios";

import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // 여기에 실제 API 기본 URL을 설정하세요
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post("/auth/tokens", { refreshToken });
          document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600`;
          localStorage.setItem("refreshToken", data.refreshToken);
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().setIsAuthenticated(false);
          useAuthStore.getState().setUser(null);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
