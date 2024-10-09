"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getGoals } from "@/api/goalAPI";
import { getAllData } from "@/api/todoAPI";

//import { GoalType } from "./goal/[id]/page";
//import TodoCard, { TodoType } from "./components/TodoCard";
import TodoCard from "./components/TodoCard";
import Todos from "./components/Todos";

export type TodosResponse = {
  totalCount: number;
  nextCursor: number;
  todos: TodoType[];
};
export type GoalType = {
  updatedAt: string;
  createdAt: string;
  title: string;
  id: number;
  userId: number;
  teamId: string;
};

export type TodoType = {
  noteId: number | null;
  done: boolean;
  linkUrl: string | null;
  fileUrl: string | null;
  title: string;
  id: number;
  goal: GoalType;
  userId: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
};

export default function Dashboard() {
  const [goals, setGoals] = useState<GoalType[] | undefined>([]);
  const [recentTodos, setRecentTodos] = useState<TodoType[]>([]);

  // 할 일 목록을 가져오는 함수
  const fetchRecentTodos = async () => {
    try {
      const response = await getAllData();
      console.log(response?.data);
      const sortedTodos = response?.data.todos.sort((a: TodoType, b: TodoType) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setRecentTodos(sortedTodos.slice(0, 4)); // 최신 4개의 할 일만 저장
    } catch (error) {
      console.error("할 일 목록을 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  // 목표 데이터를 가져오는 함수
  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response?.goals || []);
    } catch (error) {
      console.error("목표 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchRecentTodos();
    fetchGoals();
  }, []);

  return (
    <main className="relative">
      <div className="mt-[51px] min-h-[calc(100vh-51px)] w-full select-none bg-slate-100 lg:mt-0">
        {
          <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
            <h2 className="mb-3 text-lg font-semibold">대시보드</h2>
            <div className="flex flex-col gap-6 sm:flex-row 2xl:flex-row">
              <div className="flex h-auto w-full flex-col rounded-xl bg-white px-6 py-4 2xl:w-[588px]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-blue-500">
                    <Image src="/dashboard-recent.svg" width={16} height={16} alt="recent-task-icon" />
                  </div>
                  <h2 className="text-lg font-semibold">최근 등록한 할 일</h2>
                  <Link href="/dashboard/todoboard" className="grow text-right">
                    <p className="min-w-[74px] cursor-pointer text-sm text-slate-600">{"모두 보기 >"}</p>
                  </Link>
                </div>
                {Array.isArray(recentTodos) &&
                  recentTodos.map((todo: TodoType) => (
                    <Todos key={todo.id} todo={todo} setTodos={setRecentTodos} isGoal={true} />
                  ))}
              </div>
              {/* progress circle*/}
              <div className="relative flex h-[280px] w-full flex-col gap-4 rounded-xl bg-blue-500 px-6 py-4 text-white 2xl:w-[588px]">
                <Image src="/dashboard-progress.webp" width={40} height={40} alt="progress-task-icon" />
                <div>
                  <h2>내 진행 상황</h2>
                  <h2>
                    <span className="text-3xl font-semibold">0</span> %
                  </h2>
                </div>
                <div className="absolute left-[40%] top-11 flex select-none 2xl:left-[50%]">
                  <Image src="/dashboard-progress-circle.svg" width={166} height={166} alt="progress-circle-icon" />
                </div>
              </div>
            </div>
            <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
                  <Image src="/dashboard-flag.svg" width={24} height={24} alt="recent-task-icon" />
                </div>
                <h2 className="text-lg font-semibold">목표 별 할 일</h2>
              </div>
              <div className="flex max-h-[675px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid">
                {goals?.map((goal) => (
                  <div key={goal.id} className="col-span-2">
                    <TodoCard id={goal.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  );
}
