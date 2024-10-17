"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import { createTodo, postFile } from "@/api/todoAPI";
import useModal from "@/hook/useModal";

import LinkUpload from "./LinkUpload";

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

export type NewTodoType = {
  title: string;
  fileUrl?: string;
  linkUrl?: string;
  goalId: number;
};

type CreateNewTodoProps = {
  closeCreateNewTodo: () => void;
  goal?: GoalType;
  goals?: GoalType[]; // 사이드바에서 받아온 목표 리스트
  onTodoCreated?: (newTodo: TodoType) => void; // 추가
};
export default function CreateNewTodo({ closeCreateNewTodo, goal, goals = [], onTodoCreated }: CreateNewTodoProps) {
  const [file, setFile] = useState("");
  const [todo, setTodo] = useState<TodoType>({
    noteId: null,
    done: false,
    title: "",
    linkUrl: null,
    fileUrl: null,
    id: 0,
    goal: { id: 0, title: "", teamId: "", userId: 0, createdAt: "", updatedAt: "" }, // 초기 목표
    userId: 0,
    teamId: "",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  const [fileTitle, setFileTitle] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { Modal, openModal, closeModal } = useModal();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, title: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size <= 3 * 1024 * 1024) {
      // 3MB 이하의 파일만 허용
      const fileData = await postFile(file);
      setTodo({ ...todo, fileUrl: fileData.url });
      setFileTitle(file.name);
      setIsFileUpload(true);
    } else {
      toast.error("파일은 3MB 이하만 업로드 가능합니다.");
    }
  };

  const handleGoalSelect = (goal: GoalType) => {
    setTodo({
      ...todo,
      goal: {
        id: goal.id,
        title: goal.title,
        teamId: goal.teamId, // teamId 추가
        userId: goal.userId, // userId 추가
        createdAt: goal.createdAt, // createdAt 추가
        updatedAt: goal.updatedAt, // updatedAt 추가
      },
    });
    setIsOpenGoals(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo.title || !todo.goal.id) {
      toast.error("제목과 목표를 모두 입력해주세요.");
      return;
    }

    console.log("할 일 데이터:", todo); // 추가된 로그
    try {
      await createTodo(
        todo.title,
        todo.goal.id,
        todo.fileUrl ? todo.fileUrl : undefined,
        todo.linkUrl ? todo.linkUrl : undefined,
      );

      // 안전하게 호출
      if (onTodoCreated) {
        onTodoCreated(todo); // 생성된 할 일을 부모에 알림
      }
      closeCreateNewTodo();
      toast.success("할 일이 생성되었습니다.");
    } catch (error) {
      console.log("에러 발생:", error); // 에러 로그 추가
      toast.error("할 일 생성에 실패했습니다.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h2 className="mb-3 font-semibold">제목</h2>
          <label htmlFor="title" className="sr-only">
            할 일의 제목
          </label>
          <input
            id="title"
            name="title"
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="할 일의 제목을 적어주세요"
            maxLength={30}
            value={todo.title}
            onChange={handleTitleChange}
            autoFocus
            required
          />
        </div>

        <div>
          <h2 className="mb-3 font-semibold">자료</h2>
          <div className="mb-3 flex gap-3">
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                isFileUpload ? "bg-black text-white" : "bg-slate-100 text-black"
              }`}
              style={{ pointerEvents: "none" }}
              onClick={() => setIsFileUpload(!isFileUpload)}
            >
              <Image
                src={isFileUpload ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={18}
                height={18}
                alt="checkbox-icon"
              />
              <span>파일 업로드</span>
            </div>
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                todo.linkUrl ? "bg-black text-white" : "bg-slate-100 text-black"
              }`}
              onClick={() => openModal("LINK_ATTACHMENT")} // 링크 첨부 모달 열기
            >
              <Image
                src={todo.linkUrl ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={18}
                height={18}
                alt="checkbox-icon"
              />
              <span>링크 첨부</span>
            </div>
          </div>

          <div className="flex h-[184px] w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center text-slate-400">
              {fileTitle ? (
                <p>{fileTitle}</p>
              ) : (
                <div className="hover:underline" onClick={() => fileInputRef.current?.click()}>
                  <p>+</p>
                  <p>파일을 업로드해주세요</p>
                </div>
              )}
              <label className="sr-only" htmlFor="file-upload">
                파일을 업로드해주세요
              </label>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="absolute opacity-0"
              />
            </div>
          </div>
        </div>

        {/* 목표 선택 UI */}
        <div className="relative">
          <h2 data-testid="modal-heading" className="mb-3 font-semibold">
            목표
          </h2>
          <div
            onClick={() => setIsOpenGoals((prev) => !prev)}
            className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3"
          >
            <p className={`${todo.goal.id ? "text-black" : "text-slate-400"}`}>
              {todo.goal.id ? todo.goal.title : "목표를 선택해주세요"}
            </p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>

          {isOpenGoals && (
            <div className="absolute z-50 max-h-[200px] w-full select-none overflow-y-scroll rounded-xl bg-white px-[20px] py-3">
              <ul>
                {goals?.length > 0 ? (
                  goals?.map((goal) => (
                    <li
                      key={goal.id}
                      className="cursor-pointer p-3 hover:bg-blue-100"
                      onClick={() => handleGoalSelect(goal)}
                    >
                      {goal.title}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-center text-gray-500">목표가 없습니다.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="mb-6 mt-4 flex h-[50px] w-full items-center justify-center rounded-xl border bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
          disabled={!todo.title || !todo.goal.id}
        >
          확인
        </button>
      </form>

      {/* 링크 첨부 모달 */}
      <Modal name="LINK_ATTACHMENT" title="링크 업로드">
        <LinkUpload closeSecond={closeModal} todo={todo} setTodo={setTodo} />
      </Modal>
    </>
  );
}
