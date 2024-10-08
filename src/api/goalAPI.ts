import { AxiosError } from "axios";

import api from "@/lib/api";

// 목표 목록 가져오기 (GET)
export const getGoals = async (size: number = 500) => {
  try {
    const response = await api.get(`/goals?size=${size}`);
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
    console.log("🚀");
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 추가 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const deleteGoal = async (id: number) => {
  console.log(id);
  try {
    const response = await api.delete(`/goals/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 삭제 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

// export const getMyGoal = async (id: number) => {
//   try {
//     const response = await api.get(`goals/${id}`);
//     return response;
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     console.error("목표 삭제 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
//   }
// };
