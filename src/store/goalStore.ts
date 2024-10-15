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
  addGoal: (little: string) => Promise<void>;
  updateGoal: (id: number, title: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
};

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  addGoal: async (title: string) => {
    await PostGoal(title);
    set((state) => ({
      ...state,
      goals: [
        ...state.goals,
        {
          id: Date.now(),
          title,
          teamId: "",
          userId: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },
  updateGoal: async (id: number, title: string) => {
    await PatchGoal(id, title);
    set((state) => ({
      goals: state.goals.map((goal) => (goal.id === id ? { ...goal, title } : goal)),
    }));
  },
  refreshGoals: async () => {
    const goalList = await getGoals();
    set({ goals: goalList?.goals || [] });
  },
}));
