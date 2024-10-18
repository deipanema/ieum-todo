"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";
import CreateNewTodo from "@/components/CreateNewTodo";
import useModal from "@/hook/useModal";

import Todos from "./Todos";
import ProgressBar from "./ProgressBar";

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

export default function TodoCard({ id }: TodoCardProps) {
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const [progress, setProgress] = useState(0);
  const [goal, setGoal] = useState<GoalType | null>(null);

  // 목표 데이터 가져오기
  const { data: goalData, error: goalError } = useQuery({
    queryKey: ["goal", id], // 쿼리 키
    queryFn: () => getGoal(id), // 쿼리 함수
  });

  // 할 일 목록 가져오기
  const { data: todosData, error: todosError } = useQuery({
    queryKey: ["todos", goalData?.id], // 쿼리 키
    queryFn: () => getTodos(goalData.id), // 쿼리 함수
    enabled: !!goalData?.id, // 목표가 존재할 때만 쿼리 실행
  });

  // 목표 데이터가 변경될 때마다 setGoal 호출
  useEffect(() => {
    if (goalData) {
      setGoal(goalData);
    }
  }, [goalData]);

  console.log(todosData); // todosData 로그 출력

  // todosData에서 todos 배열 가져오기
  const activeTodos = Array.isArray(todosData?.todos) ? todosData.todos.filter((todo: TodoType) => !todo.done) : [];
  const completedTodos = Array.isArray(todosData?.todos) ? todosData.todos.filter((todo: TodoType) => todo.done) : [];
  const showMore = activeTodos.length > 5 || completedTodos.length > 5;

  // const handleTodoUpdate = async (updatedTodo: TodoType) => {
  //   onTodoUpdate(updatedTodo);
  //   setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo)));
  // };

  useEffect(() => {
    // completedTodos.length가 0일 경우를 고려하여 0으로 나누는 것을 방지
    const totalTodos = todosData?.todos.length || 1; // todosData가 없거나 todos 배열이 없을 때 1로 설정
    setProgress(Math.round((completedTodos.length / totalTodos) * 100));
  }, [completedTodos.length, todosData?.todos.length]); // todosData의 todos 길이로 의존성 추가

  if (goalError || todosError) {
    return <div>데이터를 가져오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="h-auto min-h-[231px] w-full select-none rounded-2xl bg-blue-50 p-6">
      <div className="flex justify-between">
        <h2
          className="mb-2 cursor-pointer text-2xl font-bold hover:underline"
          onClick={() => router.push(`/dashboard/goal/${goal?.id}`)}
        >
          {goal?.title}
        </h2>
        <button className="cursor-pointer text-blue-500" onClick={() => openModal("CREATE_NEW_TODO")}>
          <span className="text-sm">+ 할일 추가</span>
        </button>
      </div>

      <div className="mb-4">
        <ProgressBar progress={progress} />{" "}
      </div>

      <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-0">
        <div className="w-full">
          <h3 className="mb-3 text-lg font-semibold">To do</h3>
          <ul>
            {activeTodos.slice(0, 5).map((todo: TodoType) => (
              <Todos key={todo.id} todo={todo} isGoal={false} />
            ))}
          </ul>
          {activeTodos.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-slate-500">해야할 일이 아직 없어요.</div>
            </div>
          )}
        </div>
        <div className="w-full">
          <h3 className="mb-3 text-lg font-semibold">Done</h3>
          <ul>
            {completedTodos.slice(0, 5).map((todo: TodoType) => (
              <Todos key={todo.id} todo={todo} isGoal={false} />
            ))}
          </ul>
          {completedTodos.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-slate-500">다 한 일이 아직 없어요.</div>
            </div>
          )}
        </div>
      </div>

      {showMore && (
        <div className="mt-4 flex justify-center">
          <button
            className="flex w-[120px] cursor-pointer items-center justify-center rounded-2xl bg-white py-[6px]"
            onClick={() => router.push(`/dashboard/goal/${goal?.id}`)}
          >
            <span>더보기</span>
            <Image src="/modal-arrowdown.svg" width={24} height={24} alt="button-arrow-icon" />
          </button>
        </div>
      )}

      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} goalId={id} />
      </Modal>
    </div>
  );
}
