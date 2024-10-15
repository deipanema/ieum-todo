// store.ts
import { create } from "zustand";
import { toast } from "react-toastify";

import { editTodo, patchTodo, postTodos } from "@/api/todoAPI";

export type Todo = {
  title: string;
  linkUrl?: string | null;
  fileUrl?: string | null;
  goalId: number;
};

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

export type TodoStore = {
  todos: TodoType[];
  setRecentTodos: (todos: TodoType[]) => void;
  updateTodo: (updatedTodo: TodoType) => Promise<void>;
  createTodo: (todoData: TodoType) => Promise<void>;
};

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  setRecentTodos: (todos: TodoType[]) => set({ todos }),
  updateTodo: async (updatedTodo: TodoType) => {
    try {
      const response = await patchTodo(
        updatedTodo.title,
        updatedTodo.goal.id,
        updatedTodo.done,
        updatedTodo.id,
        updatedTodo.fileUrl || "",
        updatedTodo.linkUrl || "",
      );
      if (response) {
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo)),
        }));
      }
    } catch (error) {
      console.error("할 일 업데이트 중 오류 발생:", error);
    }
  },
  createTodo: async (todoData: TodoType) => {
    const response = await postTodos(
      todoData.title,
      todoData.fileUrl || null,
      todoData.linkUrl || null,
      todoData.goal.id,
    );

    if (response) {
      set((state) => ({
        todos: [...state.todos, response],
      }));
    }
  },
  editTodo: async (updatedTodo: TodoType) => {
    const response = await editTodo(
      updatedTodo.title,
      updatedTodo.goal.id,
      updatedTodo.fileUrl || "",
      updatedTodo.linkUrl || "",
      updatedTodo.id,
    );

    if (response) {
      toast.success("할 일이 성공적으로 수정되었습니다");
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === response.id ? { ...todo, ...response } : todo)),
      }));
    } else {
      toast.error("할 일 수정 실패");
    }
  },
}));

export default useTodoStore;

// import { create } from "zustand";

// import { TodoType } from "@/api/todoAPI";

// type TodoStore = {
//   todos: TodoType[];
//   setTodos: (todos: TodoType[]) => void;
//   createTodo: (todo: TodoType) => void;
//   updateTodo: (updatedTodo: TodoType) => void;
//   deleteTodo: (id: number) => void;
// };

// const useTodoStore = create<TodoStore>((set) => ({
//   todos: [],
//   setTodos: (todos) => set({ todos }),
//   createTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
//   updateTodo: (updatedTodo) =>
//     set((state) => ({
//       todos: state.todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
//     })),
//   deleteTodo: (id) =>
//     set((state) => ({
//       todos: state.todos.filter((todo) => todo.id !== id),
//     })),
// }));

// export default useTodoStore;
