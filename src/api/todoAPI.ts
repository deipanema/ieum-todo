import { AxiosError } from "axios";
import { toast } from "react-toastify";

import api from "@/lib/api";

import { ErrorType } from "./goalAPI";

export type TodoType = {
  noteId: number | null;
  done: boolean;
  linkUrl?: string | null;
  fileUrl?: string | null;
  title: string;
  id: number;
  goal: GoalType;
  userId: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
};

export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export const getAllTodos = async () => {
  try {
    const response = await api.get(`/todos`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
    throw error;
  }
};

export const getTodos = async (id: number, done?: boolean, size?: number) => {
  try {
    const response = await api.get(
      `/todos?goalId=${id}&${done ? `done=${done}&` : done === false ? "done=false&" : ""}${size ? `size=${size}` : "size=27"}`,
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const postFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(`/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
  }
};

export const createTodo = async (
  title?: string,
  goalId?: number,
  fileUrl?: string | null,
  linkUrl?: string | null,
): Promise<TodoType> => {
  try {
    const payload = { title, goalId, fileUrl, linkUrl };
    console.log(title, goalId);
    console.log("😲");
    const response = await api.post<TodoType>(`/todos`, payload);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.response?.data.message);
    throw error;
  }
};

export const updateTodo = async (todoId: number, updates: Partial<TodoType>): Promise<TodoType> => {
  try {
    const response = await api.patch<TodoType>(`/todos/${todoId}`, updates);
    console.log();
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
    throw error;
  }
};

// 할 일 상태 토글 함수
export const toggleTodo = async (todoId: number, updatedTodo: Partial<TodoType>) => {
  try {
    const response = await api.patch(`/todos/${todoId}`, updatedTodo);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    toast.error(axiosError.message);
    throw error;
  }
};
