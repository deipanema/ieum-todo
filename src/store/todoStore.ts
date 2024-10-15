import { create } from "zustand";

import { getAllData, postTodos, patchTodo, deleteTodos } from "@/api/todoAPI";

export type TodoType = {
  noteId?: number | null;
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

type TodoStore = {
  todos: TodoType[];
  todosByGoal: { [goalId: number]: TodoType[] }; // goalId별로 할 일 저장
  isLoading: boolean;
  error: string | null;
  setTodos: (todos: TodoType[]) => void; // 추가된 부분
  fetchTodos: (goalId: number) => Promise<void>;
  createTodo: (title: string, fileUrl: string | null, linkUrl: string | null, goalId: number) => Promise<void>;
  updateTodo: (updatedTodo: TodoType) => Promise<void>;
  deleteTodo: (id: number, goalId: number) => Promise<void>;
};

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  todosByGoal: {},
  isLoading: false,
  error: null,

   // setTodos 함수 정의
   setTodos: (todos: TodoType[]) => set({ todos }),

  fetchTodos: async (goalId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllData();
      const todos: TodoType[] = response?.data.todos.filter((todo: TodoType) => todo.goal.id === goalId) || [];

      set((state) => ({
        todosByGoal: { ...state.todosByGoal, [goalId]: todos },
        isLoading: false,
      }));
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch todos", isLoading: false });
    }
  },

  createTodo: async (title, fileUrl, linkUrl, goalId) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await postTodos(title, fileUrl, linkUrl, goalId);
      if (newTodo) {
        set((state) => ({
          todosByGoal: {
            ...state.todosByGoal,
            [goalId]: [...(state.todosByGoal[goalId] || []), newTodo],
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error(error);
      set({ error: "Failed to create todo", isLoading: false });
    }
  },

  updateTodo: async (updatedTodo) => {
    set({ isLoading: true, error: null });
    try {
      const result = await patchTodo(
        updatedTodo.title,
        updatedTodo.goal.id,
        updatedTodo.done,
        updatedTodo.id,
        updatedTodo.fileUrl,
        updatedTodo.linkUrl,
      );
      if (result) {
        set((state) => ({
          todosByGoal: {
            ...state.todosByGoal,
            [updatedTodo.goal.id]: state.todosByGoal[updatedTodo.goal.id].map((todo) =>
              todo.id === result.id ? result : todo,
            ),
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error(error);
      set({ error: "Failed to update todo", isLoading: false });
    }
  },

  deleteTodo: async (id, goalId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTodos(id);
      set((state) => ({
        todosByGoal: {
          ...state.todosByGoal,
          [goalId]: state.todosByGoal[goalId].filter((todo) => todo.id !== id),
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error(error);
      set({ error: "Failed to delete todo", isLoading: false });
    }
  },
}));

export default useTodoStore;
