"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getInfinityScrollGoals } from "@/api/goalAPI";
import { getAllData, patchTodo } from "@/api/todoAPI";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  const fetchData = useCallback(async () => {
    try {
      const todosResponse = await getAllData();

      const sortedTodos = todosResponse?.data.todos.sort((a: TodoType, b: TodoType) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setRecentTodos(sortedTodos.slice(0, 4));

      const total = todosResponse?.data.totalCount;
      const dones = todosResponse?.data.todos.filter((todo: TodoType) => todo.done === true);
      setRatio(Math.round((dones.length / total) * 100));
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  }, []);

  const handleTodoUpdate = useCallback(async (updatedTodo: TodoType) => {
    try {
      const response = await patchTodo(
        updatedTodo.title,
        updatedTodo.goal.id,
        updatedTodo.done,
        updatedTodo.id,
        updatedTodo.fileUrl || "",
        updatedTodo.linkUrl || "",
      );
      if (response) {
        setRecentTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo)),
        );
        // 전체 todos 업데이트를 위해 데이터를 다시 불러옵니다.
        fetchData();
      }
    } catch (error) {
      console.error("할 일 업데이트 중 오류 발생:", error);
    }
  }, []);

  // const handleTodoUpdate = (updatedTodo: TodoType) => {
  //   setRecentTodos((prevTodos) => prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  // };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["goals"],
    queryFn: async ({ pageParam }) => {
      const response = await getInfinityScrollGoals({ cursor: pageParam, size: 3, sortOrder: "oldest" });
      return response;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosResponse = await getAllData();

        const sortedTodos = todosResponse?.data.todos.sort((a: TodoType, b: TodoType) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        setRecentTodos(sortedTodos.slice(0, 4));

        const total = todosResponse?.data.totalCount;
        const dones = todosResponse?.data.todos.filter((todo: TodoType) => todo.done === true);
        setRatio(Math.round((dones.length / total) * 100));
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const content = data?.pages.map((page) => {
    return page.goals.map((goal: GoalType, i: number) => {
      if (page.goals.length === i + 1) {
        return (
          <div key={goal.id} className="col-span-2">
            <TodoCard id={goal.id} onTodoUpdate={handleTodoUpdate} />
          </div>
        );
      }
      return (
        <div key={goal.id} className="col-span-2">
          <TodoCard id={goal.id} onTodoUpdate={handleTodoUpdate} />
        </div>
      );
    });
  });

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
                Array.isArray(recentTodos) &&
                recentTodos.map((todo: TodoType) => (
                  <Todos key={todo.id} todo={todo} onTodoUpdate={handleTodoUpdate} isGoal={true} />
                ))
              )}
            </div>
            <ProgressTracker ratio={ratio} progressValue={progressValue} setProgressValue={setProgressValue} />
          </div>
          <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
                <Image src="/dashboard-flag.svg" width={24} height={24} alt="recent-task-icon" />
              </div>
              <h2 className="text-lg font-semibold">목표 별 할 일</h2>
            </div>
            <div className="flex max-h-[465px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid">
              {content}
              <div ref={ref}>
                <LoadingSpinner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
