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

export const PostTodo = async (todoData: TodoType) => {
  try {
    const response = await api.post(`/todos`, todoData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("파일 업로드 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};