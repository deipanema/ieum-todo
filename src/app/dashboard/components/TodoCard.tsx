"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";

import Todos from "./Todos";

export type TodoCardProps = {
  id: number;
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
  noteId: number;
  done: boolean;
  linkUrl: string;
  fileUrl: string;
  title: string;
  id: number;
  goal: GoalType;
  userId: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
};

export type TodosResponse = {
  totalCount: number;
  nextCursor: number;
  todos: TodoType[];
};

export default function TodoCard({ id }: TodoCardProps) {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalType | null>(null);
  const [todos, setTodos] = useState<TodoType[]>([]); // 모든 할 일 목록 상태

  // 목표와 할 일을 불러오는 useEffect
  useEffect(() => {
    async function fetchData() {
      try {
        const goalResponse = await getGoal(id);
        setGoals(goalResponse);

        //  console.log();

        if (goalResponse?.id) {
          //   console.log(goals?.id);
          //   console.log(goals);
          const todoResponse = await getTodos(goalResponse?.id);
          console.log("🪐");
          //console.log();
          setTodos(todoResponse.todos ?? []);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    }

    fetchData();
  }, [id]);

  // 할 일 목록 필터링 함수
  const filterTodos = (isDone: boolean) => {
    return Array.isArray(todos) ? todos.filter((todo) => todo.done === isDone) : [];
  };

  return (
    <div className="h-auto min-h-[231px] w-full select-none rounded-2xl bg-blue-50 p-6">
      <div className="flex justify-between">
        <h1
          className="mb-2 cursor-pointer text-2xl font-bold hover:underline"
          onClick={() => router.push(`/dashboard/goal/${goals?.id}`)}
        >
          {goals?.title}
        </h1>
        <span className="cursor-pointer text-xl text-blue-500">+ 할일 추가</span>
      </div>

      <div className="mb-4">{/* <ProgressBar progress={progress} /> */}</div>

      <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-0">
        {/* To Do Section */}
        <div className="w-full">
          <h2 className="mb-3 text-lg font-semibold">To do</h2>
          <ul>
            {filterTodos(false).length > 0 ? (
              filterTodos(false).map((todo) => <Todos key={todo.id} todo={todo} isGoal={false} isInGoalSection />)
            ) : (
              <li className="py-[30px] text-center text-sm text-slate-500">아직 해야할 일이 없어요</li>
            )}
          </ul>
        </div>
        {/* Done Section */}
        <div className="w-full">
          <h2 className="mb-3 text-sm font-semibold">Done</h2>
          <ul>
            {filterTodos(true).length > 0 ? (
              filterTodos(true).map((doneTodo) => (
                <Todos key={doneTodo.id} todo={doneTodo} isGoal={false} isInGoalSection />
              ))
            ) : (
              <li className="py-[30px] text-center text-sm text-slate-500">아직 다 한 일이 없어요</li>
            )}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <div
          className="rounded-4 flex w-[120px] cursor-pointer items-center justify-center bg-white py-[6px]"
          onClick={() => router.push(`/dashboard/goal/${goals?.id}`)}
        >
          <span>더보기</span>
          <Image src="/modal-arrowdown.svg" width={24} height={24} alt="button-arrow-icon" />
        </div>
      </div>
    </div>
  );
}
