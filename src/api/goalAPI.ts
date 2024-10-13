import { AxiosError } from "axios";
import { toast } from "react-toastify";

import api from "@/lib/api";

export interface ErrorType {
  message?: string;
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}

// 목표 목록 가져오기 (GET)
export const getGoals = async () => {
  try {
    const response = await api.get(`/goals`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const PostGoal = async (title: string) => {
  try {
    return await api.post(`/goals`, {
      title,
    });
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const getGoal = async (id: number) => {
  try {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const deleteGoal = async (id: number) => {
  try {
    return await api.delete(`/goals/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const PatchGoal = async (id: number, title: string) => {
  try {
    const response = await api.patch(`/goals/${id}`, { title });
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

// 무한 스크롤 데이터 페칭 함수
export const getInfinityScrollGoals = async ({
  cursor,
  size = 3,
  sortOrder = "oldest",
}: {
  cursor: number | undefined;
  size: number;
  sortOrder: "oldest" | "newest";
}) => {
  try {
    const response = await api.get(`/goals`, {
      params: {
        cursor,
        size,
        sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};
