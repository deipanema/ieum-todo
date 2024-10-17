"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getInfinityScrollGoals } from "@/api/goalAPI";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingScreen from "@/components/LoadingScreen";
import { getAllTodos } from "@/api/todoAPI";
import TodoCard from "./components/TodoCard";
import Todos from "./components/Todos";
import ProgressTracker from "./components/ProgressTracker";
import { useGoalStore } from "@/store/goalStore";

export type TodosResponse = {
  totalCount: number;
  nextCursor: number;
  todos: TodoType[];
};

export type TodoType = {
  noteId?: number | null; // noteId를 선택적으로 정의
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

export default function Dashboard() {
  const { goals, refreshGoals } = useGoalStore();
  const { ref, inView } = useInView();
  const [recentTodos, setRecentTodos] = useState<TodoType[]>([]);
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [ratio, setRatio] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  /** 있어야되나....? 흠 */
  // 페이지 로드 시 목표 목록을 새로고침
  useEffect(() => {
    refreshGoals(); 
  }, [refreshGoals]);

  const fetchRecentTodos = async () => {
    try {
      const todos = await getAllTodos();

      const total = todos.totalCount;
      const dones = todos.todos.filter((todo: TodoType) => todo.done === true);
      setRatio(Math.round((dones.length / total) * 100));

      // 생성일 기준 내림차순으로 정렬 후 최근 4개의 할 일만 가져오기
      const sortedTodos = todos.todos.sort(
        (a: TodoType, b: TodoType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setRecentTodos(sortedTodos.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setIsTodosLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTodos();
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isGoalsLoading,
  } = useInfiniteQuery({
    queryKey: ["goals"],
    queryFn: async ({ pageParam }) => {
      const response = await getInfinityScrollGoals({ cursor: pageParam, size: 3, sortOrder: "oldest" });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isGoalsLoading || isTodosLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative">
      <div className="mt-[51px] min-h-[calc(100vh-51px)] w-full select-none bg-slate-100 lg:mt-0">
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
              {recentTodos.length === 0 ? (
                <p className="flex items-center justify-center">최근에 등록한 할 일이 없어요</p>
              ) : (
                recentTodos.map((todo) => <Todos key={todo.id} todo={todo} isGoal={!!todo.goal.id} />)
              )}
            </div>
            <ProgressTracker ratio={ratio} progressValue={progressValue} setProgressValue={setProgressValue} />
          </div>

          <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
            {data?.pages.flatMap((page) => page.goals).length === 0 ? (
              <p className="text-center">등록한 할 일이 없습니다.</p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
                    <Image src="/dashboard-flag.svg" width={24} height={24} alt="goal-task-icon" />
                  </div>
                  <h2 className="text-lg font-semibold">목표 별 할 일</h2>
                </div>
                <div className="flex max-h-[465px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid">
                    {goals.map((goal) => (
                      <div key={goal.id} className="col-span-2">
                        {/* 각 목표의 할 일들을 나열하기 위해 TodoCard 컴포넌트 사용 */}
                        <TodoCard goal={goal} />
                      </div>
                    ))}
                    <div ref={ref}>
                      {goals.length > 0 ? <LoadingSpinner /> : null}
                    </div>
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
