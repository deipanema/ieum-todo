"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteGoal, getGoal } from "@/api/goalAPI";

import TodoItem from "../../components/TodoItem";

type GoalPage = {
  params: { id: string };
};

export type TodosType = {
  done: boolean;
  fileUrl: string;
  goal: { title: string; id: number };
  id: number;
  linkUrl: string;
  noteId: string;
  teamId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export default function Goalpage({ params }: GoalPage) {
  const { id } = params;
  const router = useRouter();

  const [todos, setTodos] = useState<TodosType[]>([]);
  const [goal, setGoal] = useState<GoalType>();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // 드롭다운 참조
  console.log(setTodos);
  const fetchInitialData = async () => {
    const goalResponse = await getGoal(Number(id));
    setGoal(goalResponse?.data);
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    const response = await deleteGoal(goal?.id as number);

    if (response) {
      router.push("/");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 드롭다운이 열려 있고, 클릭된 요소가 드롭다운 또는 케밥 버튼이 아닌 경우
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 이벤트 리스너 추가

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 이벤트 리스너 정리
    };
  }, [isOpen]);

  return (
    <main className="mt-[51px] h-auto min-h-[calc(100vh)] w-full select-none bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <h2 className="mb-3 text-[18px] font-semibold">목표</h2>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-white px-6 py-4 sm:w-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative flex h-10 w-10 justify-center rounded-2xl bg-slate-800">
                <Image src="/goal-flag.svg" width={24} height={24} alt="goal-icon" />
              </div>
              <h3 className="ml-2 text-left text-lg font-semibold">{goal?.title}</h3>
            </div>

            <Image
              className="h-6 w-6 cursor-pointer"
              src="/goal-kebab.svg"
              width={0}
              height={0}
              alt="kebab-icon"
              onClick={handleToggleDropdown}
            />

            {isOpen && (
              <div ref={dropdownRef} className="absolute right-28 top-32 z-10 rounded-lg border bg-white shadow-xl">
                <p className="cursor-pointer p-3 hover:bg-slate-200">수정하기</p>
                <p onClick={handleDelete} className="cursor-pointer p-3 hover:bg-slate-200">
                  삭제하기
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-2 pl-[7px]">Progress</h4>
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
              {todos
                .filter((todo) => todo.done === false)
                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} goal={false} />
                ))}
            </ul>
            {todos.filter((done) => done.done === false).length === 0 && (
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
              {todos
                .filter((done) => done.done === true)

                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} goal={false} />
                ))}
            </ul>
            {todos.filter((done) => done.done === true).length === 0 && (
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
