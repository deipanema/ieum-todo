import { create } from "zustand";

import { createTodo, getAllTodos, getTodos, updateTodo } from "@/api/todoAPI";

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

// Todo 상태 정의
export type TodoState = {
  todos: TodoType[];
  fetchTodos: () => Promise<void>; // 모든 할 일을 가져오는 메서드
  fetchTodosByGoal: (goalId: number) => Promise<void>; // 특정 목표의 할 일을 가져오는 메서드
  setTodos: (todos: TodoType[]) => void; // setTodos 추가
  addTodo: (title: string, goalId: number, fileUrl?: string | null, linkUrl?: string | null) => Promise<TodoType>;
  updateTodo: (todoId: number, updates: Partial<TodoType>) => Promise<TodoType>;
  refreshTodos: () => Promise<void>;
  toggleTodo: (id: number) => void; // id를 받아서 toggle하도록 수정
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  fetchTodos: async () => {
    try {
      const response = await getAllTodos();
      const todos = response.todos; // todos 속성에서 배열을 가져옴
      console.log(todos);
      if (Array.isArray(todos)) {
        set({ todos });
      } else {
        console.error("fetchTodos에서 반환된 값이 배열이 아닙니다.", todos);
      }
    } catch (error) {
      console.error("모든 할 일 가져오는 중 오류 발생:", error);
    }
  },
  fetchTodosByGoal: async (goalId: number) => {
    try {
      const todos = await getTodos(goalId); // 목표에 해당하는 할 일 가져오기
      if (Array.isArray(todos)) {
        set({ todos });
      } else {
        console.error(`fetchTodosByGoal에서 반환된 값이 배열이 아닙니다.`, todos);
      }
    } catch (error) {
      console.error(`목표 ID ${goalId}의 할 일 가져오는 중 오류 발생:`, error);
    }
  },
  setTodos: (todos: TodoType[]) => {
    if (Array.isArray(todos)) {
      set({ todos }); // todos가 배열이면 상태 업데이트
    } else {
      console.error("setTodos에 전달된 값이 배열이 아닙니다.", todos);
    }
  },
  addTodo: async (
    title: string,
    goalId: number,
    fileUrl?: string | null,
    linkUrl?: string | null,
  ): Promise<TodoType> => {
    const response = await createTodo(title, goalId, fileUrl, linkUrl);
    const newTodo: TodoType = response;

    set((state) => ({
      todos: [...state.todos, newTodo], // 새 할 일을 배열의 끝에 추가
    }));
    return newTodo;
  },

  updateTodo: async (todoId: number, updates: Partial<TodoType>): Promise<TodoType> => {
    const response = await updateTodo(todoId, updates); // PatchGoal 호출
    const updatedTodo: TodoType = response; // 응답의 data에서 GoalType 추출

    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === todoId ? { ...todo, ...updatedTodo } : todo)),
    }));

    return updatedTodo;
  },

  refreshTodos: async () => {
    const todoListResponse = await getAllTodos();
    const todoList = todoListResponse?.todos || []; // 할 일 목록을 가져옴
    set({ todos: todoList }); // 상태 업데이트
  },

  toggleTodo: (id: number) => {
    set((state) => ({
      todos: state.todos.map(
        (t) => (t.id === id ? { ...t, done: !t.done } : t), // 현재 todo의 done 상태를 반전
      ),
    }));
  },
}));
