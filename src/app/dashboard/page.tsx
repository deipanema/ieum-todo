"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingScreen from "@/components/LoadingScreen";
import { getInfinityScrollGoals } from "@/api/goalAPI";
import { getAllTodos } from "@/api/todoAPI";

import TodoCard from "./components/TodoCard";
import Todos from "./components/Todos";
import ProgressTracker from "./components/ProgressTracker";

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

export default function Dashboard() {
  const [recentTodos, setRecentTodos] = useState<TodoType[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [ratio, setRatio] = useState(0);
  const { ref, inView } = useInView();

  // 최근 할 일 데이터 가져오기
  const { data: todosData, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
    //staleTime: 60000,
  });

  // 정렬 및 최근 할 일 설정
  useEffect(() => {
    if (todosData && Array.isArray(todosData.todos)) {
      const sortedTodos = [...todosData.todos].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setRecentTodos(sortedTodos.slice(0, 4));

      const total = todosData.totalCount; // 총 개수는 totalCount에서 가져옴
      const dones = todosData.todos.filter((todo: TodoType) => todo.done);
      setRatio(Math.round((dones.length / total) * 100));
    }
  }, [todosData]);

  // 목표 데이터 무한 스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isGoalsLoading,
  } = useInfiniteQuery({
    queryKey: ["goals"],
    queryFn: async ({ pageParam }) => {
      const response = await getInfinityScrollGoals({ cursor: pageParam, size: 3, sortOrder: "newest" });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const getAllGoals = () => {
    if (!data) return [];
    return data.pages.reduce((acc, page) => {
      return [...acc, ...page.goals];
    }, []);
  };

  const allGoals = getAllGoals();

  // 목표 데이터가 화면에 보일 때 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 로딩 상태 처리
  if (isGoalsLoading || isTodosLoading) {
    return <LoadingScreen />;
  }

  //const allGoals = data?.pages.flatMap((page) => page.goals) || [];

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
                recentTodos.map((todo) => <Todos key={todo.id} todo={todo} isGoal={true} />)
              )}
            </div>

            {/* 진행 상황 트래커 */}
            <ProgressTracker ratio={ratio} progressValue={progressValue} setProgressValue={setProgressValue} />
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
