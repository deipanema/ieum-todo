"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useGoalStore, GoalType } from "@/store/goalStore";
import { ErrorType } from "@/api/goalAPI";
import { useTodoStore } from "@/store/todoStore";

export type EditGoalTitleModalProps = {
  closeEditTitle: () => void;
  goals: GoalType;
};

export default function EditGoalTitleModal({ closeEditTitle, goals }: EditGoalTitleModalProps) {
  const { updateTodos } = useTodoStore();
  const [title, setTitle] = useState("");
  const { updateGoal } = useGoalStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateGoal(goals.id, title);
      updateTodos();
      closeEditTitle();
      toast.success("목표 제목이 수정되었습니다");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorType>;
      toast.error(axiosError.message);
    }
  };

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
