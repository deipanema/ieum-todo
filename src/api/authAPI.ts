import api from "@/lib/api";

export type SignupData = {
  email: string;
  nickname: string;
  password: string;
};

export const postUser = async (data: SignupData) => {
  const response = await api.post(`/user`, {
    email: data.email,
    name: data.nickname,
    password: data.password,
  });

  return response.data;
};
