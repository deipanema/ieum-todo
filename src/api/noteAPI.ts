import { AxiosError } from "axios";

import api from "@/lib/api";

// 노트 목록 가져오기 (GET)
export const getNotes = async (id: number) => {
  try {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("노트 목록 가져오기 실패:", axiosError.response ? axiosError.response.data : axiosError.message);
  }
};

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
  } catch (e) {
    console.error(e);
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
  } catch (e) {
    console.error(e);
  }
}
