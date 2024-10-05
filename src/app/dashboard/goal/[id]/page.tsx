"use client";

import Image from "next/image";
import { useState } from "react";

import TodoItem from "../../components/TodoItem";

type GoalPage = {
  params: { id: string };
};

export default function Goalpage({ params }: GoalPage) {
  const { id } = params;
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<string[]>([]);
  console.log(id, setTodos);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <main className="mt-[51px] h-auto min-h-[calc(100vh)] w-full select-none bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <h2 className="mb-3 text-[18px] font-semibold">목표</h2>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-white px-6 py-4 sm:w-auto">
          <div className="flex justify-between">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800">
              <Image src="/goal-flag.svg" width={24} height={24} alt="goal-icon" />
            </div>
            <h2 className="text-[18px] font-semibold"></h2>
            <Image
              className="h-6 w-6 cursor-pointer"
              src="/goal-kebab.svg"
              width={0}
              height={0}
              alt="kebab-icon"
              onClick={handleToggleDropdown}
            />
            {isOpen && (
              <div className="absolute right-14 top-[120px] z-10 rounded-lg border bg-white">
                <h6 className="cursor-pointer p-3 hover:bg-gray-200">수정하기</h6>
                <h6 className="cursor-pointer p-3 hover:bg-gray-200">삭제하기</h6>
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 pl-[7px]">Progress</h3>
          </div>
        </div>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-blue-100 px-6 py-4 sm:w-auto">
          <div className="flex items-center gap-2">
            <Image src="/note.svg" className="h-auto w-6" width={0} height={0} alt="note-icon" />
            <h2 className="cursor-pointer text-[18px] font-semibold">노트 모아보기</h2>
          </div>
        </div>
        <div className="flex select-none flex-col items-start gap-6 sm:flex-row 2xl:flex-row">
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">To do</h2>
              <p className="z-10 min-w-[74px] grow cursor-pointer text-right text-[14px] text-blue-500">+ 할일 추가</p>
            </div>
            <ul>
              {todos.map((todo, index) => (
                <TodoItem key={index} />
              ))}
            </ul>
            {!todos.length && (
              <div className="absolute -mx-6 -my-4 flex h-full w-full items-center justify-center text-sm text-slate-500">
                해야할 일이 아직 없어요.
              </div>
            )}
          </div>
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-slate-200 px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">Done</h2>
            </div>
            <ul>
              {todos.map((todo, index) => (
                <TodoItem key={index} />
              ))}
            </ul>
            {!todos.length && (
              <div className="absolute -mx-6 -my-4 flex h-full w-full items-center justify-center text-sm text-slate-500">
                다 한 일이 아직 없어요.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
