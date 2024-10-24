import { create } from "zustand";

type TodoState = {
  isUpdated: boolean;
  updateTodos: () => void;
};

// Zustand 스토어 생성
export const useTodoStore = create<TodoState>((set) => ({
  isUpdated: false, // 초기값
  updateTodos: () =>
    set((state) => ({
      isUpdated: !state.isUpdated, // 상태 업데이트
    })),
}));
