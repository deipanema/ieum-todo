import { AxiosError } from "axios";

import api from "@/lib/api";

// 목표 목록 가져오기 (GET)
export const getGoals = async () => {
  try {
    const response = await api.get(`/goals`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 목록 가져오기 실패:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const PostGoal = async (title: string) => {
  try {
    const response = await api.post(`/goals`, {
      title,
    });
    console.log(response);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 추가 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const getGoal = async (id: number) => {
  try {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 추가 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const deleteGoal = async (id: number) => {
  try {
    const response = await api.delete(`/goals/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 삭제 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const PatchGoal = async (id: number, title: string) => {
  try {
    const response = await api.patch(`/goals/${id}`, { title });
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 제목 수정 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
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
    console.error("목표 리스트를 가져오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};
