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
//import { useGoalStore } from "@/store/goalStore";

import TodoCard from "./components/TodoCard";
import Todos from "./components/Todos";
import ProgressTracker from "./components/ProgressTracker";

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
  const [recentTodos, setRecentTodos] = useState<TodoType[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [todos, setTodos] = useState<TodoType[]>([]);
  //const { goals } = useGoalStore();

  // 데이터를 가져오는 함수
  const fetchTodos = useCallback(async () => {
    try {
      const todosResponse = await getAllTodos();
      console.log("🪐🪐🪐🪐");
      console.log(todosResponse);
      return todosResponse?.data.todos || []; // todos가 없을 경우 빈 배열 반환
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }, []);

  // React Query를 사용하여 할 일 데이터를 가져옴
  const { data: todosData, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // 정렬 및 최근 할 일 설정
  useEffect(() => {
    if (Array.isArray(todosData)) {
      // todosData가 배열인지 확인
      const sortedTodos = [...todosData].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setRecentTodos(sortedTodos.slice(0, 4));

      const total = todosData.length;
      const dones = todosData.filter((todo: TodoType) => todo.done);
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
      const response = await getInfinityScrollGoals({ cursor: pageParam, size: 3, sortOrder: "oldest" });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();

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

  // 최근 등록한 할 일 목록 렌더링
  const renderRecentTodos = () => (
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
  );

  // 목표 별 할 일 목록 렌더링
  const renderGoalTodos = () => {
    // 모든 페이지에서 goals 배열을 합친 후 길이를 계산
    const allGoals = data?.pages.flatMap((page) => page.goals) || [];

    // goals 배열이 비어 있을 경우 메시지 출력
    if (allGoals.length === 0) {
      return (
        <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
          <p className="text-center">등록한 할 일이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
            <Image src="/dashboard-flag.svg" width={24} height={24} alt="goal-task-icon" />
          </div>
          <h2 className="text-lg font-semibold">목표 별 할 일</h2>
        </div>
        <div className="flex max-h-[465px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid">
          {data?.pages.map((page) =>
            page.goals.map((goal: GoalType) => (
              <div key={goal.id} className="col-span-2">
                <TodoCard todos={todos} setTodos={setTodos} id={goal.id} />
              </div>
            )),
          )}
          <div ref={ref}>{isFetchingNextPage ? <LoadingSpinner /> : null}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="mt-[51px] min-h-[calc(100vh-51px)] w-full select-none bg-slate-100 lg:mt-0">
        <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
          <h2 className="mb-3 text-lg font-semibold">대시보드</h2>
          <div className="flex flex-col gap-6 sm:flex-row 2xl:flex-row">
            {renderRecentTodos()}
            <ProgressTracker ratio={ratio} progressValue={progressValue} setProgressValue={setProgressValue} />
          </div>
          {renderGoalTodos()}
        </div>
      </div>
    </div>
  );
}
