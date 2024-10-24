"use client";

import { useState } from "react";

import { InitialTodoType } from "@/app/types/todoGoalType";

type LinkUploadProps = {
  closeSecond: () => void;
  todo?: InitialTodoType;
  setTodo: React.Dispatch<React.SetStateAction<InitialTodoType>>;
};

export default function LinkUpload({ closeSecond, todo, setTodo }: LinkUploadProps) {
  const [link, setLink] = useState(todo?.linkUrl || ""); // 링크 초기 값 설정

  const handleConfirm = () => {
    setTodo((prevTodo) => ({ ...prevTodo, linkUrl: link }));
    closeSecond();
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="flex select-none flex-col gap-6">
        <div>
          <h3 className="mb-3 font-semibold">제목</h3>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="영상이나 글, 파일의 링크를 넣어주세요"
          />
        </div>
        <div>
          <button
            onClick={handleConfirm}
            className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
            disabled={!link}
          >
            확인
          </button>
        </div>
      </form>
    </>
  );
}
