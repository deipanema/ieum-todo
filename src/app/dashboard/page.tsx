"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingScreen from "@/components/LoadingScreen";
import { getInfinityScrollGoals } from "@/api/goalAPI";
import { getAllTodos } from "@/api/todoAPI";

import { GoalType, TodoType } from "../types/todoGoalType";

import TodoCard from "./components/TodoCard";
import ProgressTracker from "./components/ProgressTracker";
import TodoItem from "./components/TodoItem";
import { useTodoStore } from "@/store/todoStore";

export default function DashboardPage() {
  const { isUpdated } = useTodoStore();
  const [recentTodos, setRecentTodos] = useState<TodoType[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [completionRatio, setCompletionRatio] = useState(0);
  const { ref, inView } = useInView();

  // 목표 데이터 무한 스크롤
  const {
    data: infiniteGoalPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isGoalsLoading,
  } = useInfiniteQuery({
    queryKey: ["infiniteGoals"],
    queryFn: async ({ pageParam }) => {
      const response = await getInfinityScrollGoals({ cursor: pageParam, size: 3, sortOrder: "oldest" });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allGoals = infiniteGoalPages
    ? infiniteGoalPages.pages.reduce((acc, page) => {
        return acc.concat(page.goals);
      }, [])
    : [];

  // 목표 데이터가 화면에 보일 때 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 정렬 및 최근 할 일 설정
  const loadDashboardData = async () => {
    const todosResponse = await getAllTodos();

    if (todosResponse) {
      const todoTotalCount = todosResponse.totalCount;
      const doneTodos = todosResponse.todos.filter((todo: TodoType) => todo.done === true);
      setCompletionRatio(Math.round((doneTodos.length / todoTotalCount) * 100));
      const sortedTodos = [...todosResponse.todos].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setRecentTodos(sortedTodos.slice(0, 4));
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  // 로딩 상태 처리
  if (isGoalsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative">
      <div className="mt-[51px] min-h-[calc(100vh-51px)] w-full select-none bg-slate-100 lg:mt-0">
        <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
          <h2 className="mb-3 text-lg font-semibold">대시보드</h2>

          {/* 대시보드 섹션 */}
          <div className="flex flex-col gap-6 sm:flex-row 2xl:flex-row">
            {/* 최근 등록한 할 일 */}
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
                recentTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
              )}
            </div>

            {/* 진행 상황 트래커 */}
            <ProgressTracker
              completionRatio={completionRatio}
              progressPercentage={progressPercentage}
              setProgressPercentage={setProgressPercentage}
            />
          </div>

          {/* 목표 별 할 일 */}
          <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
                <Image src="/dashboard-flag.svg" width={24} height={24} alt="goal-task-icon" />
              </div>
              <h2 className="text-lg font-semibold">목표 별 할 일</h2>
            </div>
            <div className="flex max-h-[465px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid">
              {allGoals.length === 0 ? (
                <p className="text-center">등록한 할 일이 없습니다.</p>
              ) : (
                allGoals.map((goal: GoalType) => (
                  <div key={goal.id} className="col-span-2">
                    <TodoCard id={goal.id} />
                  </div>
                ))
              )}
              <div ref={ref}>{isFetchingNextPage ? <LoadingSpinner /> : null}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
