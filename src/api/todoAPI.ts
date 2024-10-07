import { AxiosError } from "axios";

import api from "@/lib/api";
import { TodoType } from "@/components/CreateNewTodo";

export const PostFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(`/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("파일 업로드 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const PostTodos = async (todoData: TodoType) => {
  try {
    // fileUrl이 없으면 todoData에서 제거
    const { fileUrl, ...rest } = todoData;
    const dataToSend = fileUrl ? { ...rest, fileUrl } : rest;

    const response = await api.post(`/todos`, dataToSend);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const getTodos = async (id: number) => {
  try {
    const response = await api.post(`/todos?goalId=${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const patchTodo = async (
  title: string,
  goalId: number,
  fileUrl: string,
  linkUrl: string,
  done: boolean,
  todoId: number,
) => {
  try {
    const response = await api.patch(`todos/${todoId}`, {
      title,
      fileUrl,
      linkUrl,
      goalId,
      done,
      todoId,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("할 일 수정 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};
