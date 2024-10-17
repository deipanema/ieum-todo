import { create } from "zustand";

import { getGoals, PatchGoal, PostGoal } from "@/api/goalAPI";

export type GoalType = {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type GoalState = {
  goals: GoalType[];
  addGoal: (little: string) => Promise<GoalType>;
  updateGoal: (id: number, title: string) => Promise<GoalType>;
  refreshGoals: () => Promise<void>;
};

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],

  addGoal: async (title: string): Promise<GoalType> => {
    const response = await PostGoal(title);
    const newGoal: GoalType = response?.data;

    set((state) => ({
      goals: [
        ...state.goals,
        newGoal, // 새 목표를 배열의 끝에 추가
      ],
    }));
    return newGoal;
  },

  updateGoal: async (id: number, title: string): Promise<GoalType> => {
    const response = await PatchGoal(id, title); // PatchGoal 호출
    const updatedGoal: GoalType = response?.data; // 응답의 data에서 GoalType 추출

    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, title } : goal)),
    }));

    return updatedGoal;
  },

  refreshGoals: async () => {
    const goalList = await getGoals();
    set({ goals: goalList?.goals || [] });
  },
}));
