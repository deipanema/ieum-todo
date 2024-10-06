"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { TodoType } from "./CreateNewTodo";
import Modal from "./Modal";

type LinkUpload = {
  todo?: TodoType;
  setTodo?: Dispatch<SetStateAction<TodoType>>;
  onConfirm: (link: string) => void;
};

export default function LinkUpload({ todo, setTodo, onConfirm }: LinkUpload) {
  const [link, setLink] = useState(""); // input의 값을 관리할 상태

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (setTodo) {
      setTodo({
        ...todo,
        linkURL: link,
        title: todo?.title || "",
        goalId: todo?.goalId ?? 0,
      });
      console.log("할일 생성 모달 제목:", todo);
    } else {
      console.error("setTodo가 정의되지 않았습니다.");
    }
  };

  const handleConfirm = () => {
    if (link) {
      onConfirm(link); // Pass the link back to the parent
    }
  };

  return (
    <>
      <Modal type="child" onConfirm={handleConfirm}>
        <h1 className="mb-6 text-lg font-semibold">링크 업로드</h1>
        <form onSubmit={handleSubmit} className="flex select-none flex-col gap-6">
          <div>
            <h2 className="mb-3 font-semibold">제목</h2>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
              placeholder="영상이나 글, 파일의 링크를 넣어주세요"
            />
          </div>
          <div>
            {/* <button
              className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
              disabled={link !== "" ? false : true}
            >
              확인
            </button> */}
          </div>
        </form>
      </Modal>
    </>
  );
}
