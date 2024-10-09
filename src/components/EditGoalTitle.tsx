"use client";

import { useState } from "react";

import { PostGoal } from "@/api/goalAPI";

export type EditGoalTitleProps = {
  closeEditTitle: () => void;
};

export default function EditGoalTitle({ closeEditTitle }: EditGoalTitleProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await PostGoal(title);
    closeEditTitle();
  };

  return (
    <form className="flex select-none flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="mb-3 font-[600]">제목</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#F8FAFC] px-6 py-3 focus:outline-none"
          placeholder="목표의 새 타이틀"
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
