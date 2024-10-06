"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getGoals } from "@/api/goalAPI";
import { GoalType } from "@/app/dashboard/goal/[id]/page";
import { useModalStore } from "@/store/modalStore";

import Modal from "./Modal";

export type TodoType = {
  title: string;
  fileURL?: string;
  linkURL?: string;
  goalId: number;
};

export default function CreateNewTodo() {
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const [todo, setTodo] = useState<TodoType>({ title: "", linkURL: "", goalId: 0 });
  const [goals, setGoals] = useState<GoalType[]>([]);

  const { openModal } = useModalStore();

  // const handleLinkUploadOpenModal = () => {
  //   openModal(<LinkUpload closeChildModal={() => closeModal} />);
  // };

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

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <Modal type="parent">
      <h1 className="mb-6 text-lg font-semibold">할 일 생성</h1>
      <div className="flex select-none flex-col gap-6">
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
            <div className="flex w-fit gap-[7px] rounded-lg border bg-slate-100 p-2">
              <Image alt="checkbox-icon" width={24} height={24} src="/modal-unchecked.svg" />
              <span>파일 업로드</span>
            </div>
            <div
              className="flex w-fit cursor-pointer gap-[7px] rounded-lg border bg-slate-100 p-2"
              onClick={() => openModal("child")}
            >
              <Image alt="checkbox-icon" width={24} height={24} src="/modal-unchecked.svg" />
              <span>링크 첨부</span>
            </div>
          </div>
          <div className="flex h-[184px] w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center text-slate-400">
              <div className="hover:underline">
                <p>+</p>
                <p>파일을 업로드해주세요</p>
              </div>
              <input className="absolute opacity-0" type="file" />
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
              {todo?.goalId ? goals.find((goal) => goal.id === todo.goalId)?.title : "목표를 선택해주세요"}
            </p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>

          {/* 목표 선택 박스 */}

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
          className={`className="mb-6 mt-4 flex h-[50px] w-full items-center justify-center rounded-xl border bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200`}
          disabled={todo.title === "" || todo.goalId === undefined}
        >
          확인
        </button>
      </div>
    </Modal>
  );
}
