"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteGoal, getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";

import Todos from "../../components/Todos";
import AddTodo from "../../components/AddTodo";

type GoalPageProps = {
  params: { id: string };
};

export type TodoType = {
  done: boolean;
  fileUrl: string;
  goal: GoalType;
  id: number;
  linkUrl: string;
  noteId: number; // noteId를 number로 변경
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

export default function GoalPage({ params }: GoalPageProps) {
  const { id } = params;
  const router = useRouter();

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [goals, setGoals] = useState<GoalType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 목표 및 할 일 데이터 가져오기
  const fetchInitialData = async () => {
    try {
      const goalResponse = await getGoal(Number(id));
      setGoals(goalResponse);

      if (goalResponse) {
        const todoResponse = await getTodos(goalResponse?.id);
        console.log("🪐");
        //console.log();
        setTodos(todoResponse.todos ?? []);
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  console.log(todos);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    // console.log(goal);
    try {
      const response = await deleteGoal(goals?.id as number);
      if (response) {
        router.push("/");
      }
    } catch (error) {
      console.error("목표 삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <main className="mt-[51px] h-auto min-h-[calc(100vh)] w-full select-none bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <h2 className="mb-3 text-[18px] font-semibold">목표</h2>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-white px-6 py-4 sm:w-auto">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 justify-center rounded-2xl bg-slate-800">
                <Image src="/goal-flag.svg" width={24} height={24} alt="goal-icon" />
              </div>
              <h3 className="ml-2 text-left text-lg font-semibold">{goals?.title}</h3>
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
              <div ref={dropdownRef} className="absolute right-3 top-9 z-10 rounded-lg border bg-white shadow-xl">
                <p className="cursor-pointer p-3 hover:bg-slate-200">수정하기</p>
                <p onClick={handleDelete} className="cursor-pointer p-3 hover:bg-slate-200">
                  삭제하기
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-2 pl-[7px]">Progress</h4>
            {/* 추후 진행률 관련 컴포넌트 추가 가능 */}
          </div>
        </div>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-blue-100 px-6 py-4 sm:w-auto">
          <div className="flex items-center gap-2">
            <Image src="/note.svg" className="h-auto w-6" width={0} height={0} alt="note-icon" />
            <h2 className="cursor-pointer text-[18px] font-semibold">노트 모아보기</h2>
          </div>
        </div>
        <div className="flex select-none flex-col items-start gap-6 sm:flex-row 2xl:flex-row">
          {/* To do Section */}
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] font-semibold">To do</h2>
              <AddTodo />
            </div>
            <ul>
              {todos
                .filter((todo) => !todo.done)
                .map((todo) => (
                  <Todos key={todo.id} todo={todo} isGoal={false} />
                ))}
            </ul>
            {todos.filter((todo) => !todo.done).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">해야할 일이 아직 없어요.</div>
            )}
          </div>
          {/* Done Section */}
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-slate-200 px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">Done</h2>
            </div>
            <ul>
              {todos
                .filter((todo) => todo.done)
                .map((todo) => (
                  <Todos key={todo.id} todo={todo} isGoal={false} />
                ))}
            </ul>
            {todos.filter((todo) => todo.done).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">다 한 일이 아직 없어요.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
