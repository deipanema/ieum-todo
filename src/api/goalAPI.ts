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

// 모든 목표를 가져오는 함수
export const getGoals = async () => {
  try {
    const response = await api.get(`/goals`);
    return response.data;
  } catch (error) {
    console.error("Goals fetch error:", error);
  }
};

export const postGoal = async (title: string) => {
  try {
    return await api.post(`/goals`, {
      title,
    });
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

// 특정 ID로 목표를 가져오는 함수
export const getGoal = async (id: number) => {
  try {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  } catch (error) {
    console.error("Goal fetch error:", error);
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

export const patchGoal = async (id: number, title: string) => {
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
  sortOrder = "newest",
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
