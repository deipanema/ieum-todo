import { AxiosError } from "axios";

import api from "@/lib/api";

import { ErrorType } from "./goalAPI";

// 노트 리스트 가져오기 (GET)
export const getNotes = async (goalId: number) => {
  try {
    const response = await api.get(`/notes/${goalId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    console.error(axiosError.message);
  }
};

// 단일 노트 조회
export async function getNote(noteId: number) {
  try {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    console.error(axiosError.message);
  }
}

export async function postNotes(todoId: number, title: string, content: string, linkUrl?: string | null) {
  try {
    const payload: {
      todoId: number;
      title: string;
      content: string;
      linkUrl?: string | null;
    } = {
      todoId,
      title,
      content,
    };

    if (linkUrl) {
      payload.linkUrl = linkUrl;
    }

    const response = await api.post(`/notes`, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    console.error(axiosError.message);
  }
}

export async function patchNotes(noteId: number, title: string, content: string, linkUrl?: string | null) {
  try {
    const payload: {
      noteId: number;
      title: string;
      content: string;
      linkUrl?: string | null;
    } = {
      noteId,
      title,
      content,
    };

    if (linkUrl) {
      payload.linkUrl = linkUrl;
    } else if (linkUrl === null) {
      payload.linkUrl = null;
    }

    const response = await api.patch(`notes/${noteId}`, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    console.error(axiosError.message);
  }
}

export default async function deleteNote(noteId: number) {
  try {
    const response = await api.delete(`notes/${noteId}`);
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (e) {
    const error = e as ErrorType;
    console.log(error);
  }
}
