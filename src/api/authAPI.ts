import api from "@/lib/api";

export const signup = async (data: { email: string; nickname: string; password: string }) => {
  const response = await api.post("/user", {
    email: data.email,
    name: data.nickname,
    password: data.password,
  });
  return response.data;
};
