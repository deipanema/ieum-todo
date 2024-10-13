import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600`;
    localStorage.setItem("refreshToken", data.refreshToken);
    useAuthStore.getState().setUser(data.user);
    useAuthStore.getState().setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logout = async () => {
  try {
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("refreshToken");
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setIsAuthenticated(false);
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

export const checkAuth = async () => {
  try {
    const { data } = await api.get("/user");
    useAuthStore.getState().setUser(data);
    useAuthStore.getState().setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};
