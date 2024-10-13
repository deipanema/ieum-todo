"use client";

import { useEffect, useState } from "react";

import { useGoalStore, GoalType } from "@/store/goalStore";

export type EditGoalTitleModalProps = {
  closeEditTitle: () => void;
  goals: GoalType;
};

export default function EditGoalTitleModal({ closeEditTitle, goals }: EditGoalTitleModalProps) {
  const [title, setTitle] = useState("");
  const { updateGoal } = useGoalStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateGoal(goals.id, title);
      closeEditTitle();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  //   try {
  //     await PatchGoal(goals.id, title);
  //     closeEditTitle();
  //   } catch (error) {
  //     console.error("Error updating goal:", error);
  //   }
  // };

  useEffect(() => {
    setTitle(goals.title);
  }, [goals]);

  return (
    <form className="flex select-none flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="mb-3 font-semibold">제목</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#F8FAFC] px-6 py-3 focus:outline-none"
          placeholder="목표의 새 타이틀"
          autoFocus
        />
      </div>
      <div>
        <button
          disabled={title.length === 0}
          className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
        >
          확인
        </button>
      </div>
    </form>
  );
}
