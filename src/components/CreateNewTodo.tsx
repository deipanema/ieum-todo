"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { getGoals } from "@/api/goalAPI";
import { GoalType } from "@/app/dashboard/goal/[id]/page";
import { useModalStore } from "@/store/modalStore";
import { PostFile } from "@/api/todoAPI";

import Modal from "./Modal";
import LinkUpload from "./LinkUpload";

export type TodoType = {
  title: string;
  fileURL?: string;
  linkURL?: string;
  goalId: number;
};

export type FileType = {
  url?: string;
};

export default function CreateNewTodo() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const [todo, setTodo] = useState<TodoType>({ title: "", linkURL: "", goalId: 0 });
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [fileURL, setFileURL] = useState<FileType | undefined>(undefined);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [fileTitle, setFileTitle] = useState("");

  console.log(fileURL);

  const { openModal } = useModalStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, title: e.target.value });
  };

  const fetchGoals = async () => {
    const goalsData = await getGoals();
    if (goalsData) {
      setGoals(goalsData.data.goals);
    }
  };

  //TODO: 셀렉트박스가 모달 밖으로 나오도록 하기
  const handleGoalSelect = (goalId: number) => {
    setTodo({ ...todo, goalId });
    setIsOpenGoals(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB 제한

    const selectedFile = e.target.files?.[0]; // 파일 입력에서 선택한 첫 번째 파일을 가져옵니다.

    // 파일이 선택되지 않았거나, 파일 크기가 최대 크기를 초과하면 처리 중지
    if (!selectedFile) {
      console.error("파일이 선택되지 않았습니다.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      console.error("파일은 3MB 이하만 업로드 가능합니다.");
      setIsFileUpload(false);
      return;
    }

    // 파일이 유효한 경우 PostFile을 호출
    const response = await PostFile(selectedFile); // selectedFile을 직접 전달
    if (response) {
      setFileURL(response.url); // response.url을 통해 URL 업데이트
      setFileTitle(selectedFile.name); // 선택된 파일의 이름을 상태로 저장
      setIsFileUpload(true); // 파일 업로드 성공 상태로 업데이트
    }
  };

  const handleLinkConfirm = (linkValue: string) => {
    setTodo({ ...todo, linkURL: linkValue });
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <Modal type="parent">
        <h1 className="mb-6 text-lg font-semibold">할 일 생성</h1>
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 font-semibold">제목</h2>
            <input
              className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
              placeholder="할 일의 제목을 적어주세요"
              maxLength={30}
              value={todo.title}
              onChange={handleTitleChange}
              autoFocus
            />
          </div>
          <div>
            <h2 className="mb-3 font-semibold">자료</h2>
            <div className="mb-3 flex gap-3">
              <div
                className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                  !isFileUpload ? "bg-slate-100 text-black" : "bg-black text-white"
                }`}
              >
                <Image
                  src={isFileUpload ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                  width={isFileUpload ? 18 : 24}
                  height={isFileUpload ? 18 : 24}
                  alt="checkbox-icon"
                />
                <span>파일 업로드</span>
              </div>
              <div
                className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                  !todo.linkURL ? "bg-slate-100 text-black" : "bg-black text-white"
                }`}
                onClick={() => openModal("child")}
              >
                <Image
                  src={todo.linkURL ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                  width={todo.linkURL ? 18 : 24}
                  height={todo.linkURL ? 18 : 24}
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
                  <div
                    className="hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <p>+</p>
                    <p>파일을 업로드해주세요</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="absolute opacity-0" />
              </div>
            </div>
          </div>
          <div className="relative">
            <h2 className="mb-3 font-semibold">목표</h2>
            <div
              onClick={() => setIsOpenGoals((prev) => !prev)}
              className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3"
            >
              <p className={`${todo.goalId ? "text-black" : "text-slate-400"}`}>
                {todo.goalId ? goals.find((goal) => goal.id === todo.goalId)?.title : "목표를 선택해주세요"}
              </p>
              <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
            </div>

            {isOpenGoals && (
              <div className="absolute z-50 max-h-[200px] w-full select-none overflow-y-scroll rounded-xl bg-white px-[20px] py-3">
                <ul>
                  {goals.map((goal) => (
                    <li
                      key={goal.id}
                      className="cursor-pointer rounded-lg p-3 hover:bg-blue-100"
                      onClick={() => handleGoalSelect(goal.id)}
                    >
                      {goal.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            className="mb-6 mt-4 flex h-[50px] w-full items-center justify-center rounded-xl border bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
            disabled={!todo.title.trim() || !todo.goalId}
          >
            확인
          </button>
        </div>
      </Modal>
      <LinkUpload todo={todo} setTodo={setTodo} onConfirm={handleLinkConfirm} />
    </>
  );
}
