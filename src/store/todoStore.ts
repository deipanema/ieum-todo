import { create } from "zustand";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import api from "@/lib/api";

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

type ErrorType = {
  message: string;
};

type TodoStore = {
  todos: TodoType[];
  updateTodo: (todoId: number, updates: Partial<TodoType>) => Promise<void>;
  setTodos: (todos: TodoType[]) => void;
};

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  updateTodo: async (todoId, updates) => {
    try {
      const response = await api.patch<TodoType>(`/todos/${todoId}`, updates);
      const updatedTodo = response.data;

      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      }));

      //  toast.success("할일을 수정했습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorType>;
      toast.error(axiosError.response?.data.message || "할 일 수정을 실패했습니다.");
      throw error;
    }
  },

  setTodos: (todos) => set({ todos }),
}));

export default useTodoStore;
