"use client";

import { useState } from "react";

import { PostGoal } from "@/api/goalAPI";

import Modal from "./Modal";

export default function EditGoalTitle() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await PostGoal(title);
  };

  return (
    <Modal type="first">
      <h1 className="mb-6 text-lg font-semibold">목표 수정</h1>
      <form className="flex select-none flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <h2 className="mb-3 font-[600]">제목</h2>
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
    </Modal>
  );
}
