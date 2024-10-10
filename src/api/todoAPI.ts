import { AxiosError } from "axios";

import api from "@/lib/api";
import { TodoType } from "@/components/CreateNewTodo";

export const getAllData = async () => {
  try {
    const response = await api.get(`/todos`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const postFile = async (file: File) => {
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

export const PostTodos = async ({ title, fileUrl, linkUrl, goalId }: TodoType) => {
  try {
    const payload: {
      title: string;
      goalId: number;
      fileUrl?: string;
      linkUrl?: string;
    } = {
      title,
      goalId,
    };

    if (fileUrl) {
      payload.fileUrl = fileUrl;
    }

    if (linkUrl) {
      payload.linkUrl = linkUrl;
    }

    const response = await api.post(`/todos`, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

export const getTodos = async (id: number) => {
  try {
    const response = await api.get(`/todos?goalId=${id}`);
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

export const editTodo = async (
  title: string,
  goalId: number,
  fileUrl?: string | null,
  linkUrl?: string | null,
  todoId?: number,
) => {
  try {
    const payload: {
      title: string;
      goalId: number;
      fileUrl?: string | null;
      linkUrl?: string | null;
    } = {
      title,
      goalId,
      fileUrl: fileUrl || null, // fileUrl이 undefined일 경우 null로 처리
      linkUrl: linkUrl || null, // linkUrl이 undefined일 경우 null로 처리
    };

    if (!todoId) {
      throw new Error("todoId가 필요합니다."); // todoId가 없을 경우 예외 처리
    }

    const response = await api.patch(`todos/${todoId}`, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("할 일 수정 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
    throw axiosError;
  }
};

export const deleteTodos = async (id: number) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("목표 삭제 중 에러 발생:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};
