"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";
import CreateNewTodo from "@/components/CreateNewTodo";
import useModal from "@/hook/useModal";
import Todos from "./Todos";
import ProgressBar from "./ProgressBar";

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

type TodoCardProps = {
  goal: GoalType;
  onTodoCreated: (newTodo: TodoType) => void; // 여기 추가
};

export default function TodoCard({ goal, onTodoCreated }: TodoCardProps) {
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [progress, setProgress] = useState(0);

  const activeTodos = todos.filter((todo) => !todo.done); // 완료되지 않은 할 일들
  const completedTodos = todos.filter((todo) => todo.done); // 완료된 할 일들
  const showMore = activeTodos.length > 5 || completedTodos.length > 5;

  // const handleNewTodoCreated = (newTodo: TodoType) => {
  //   setTodos((prevTodos) => [...prevTodos, newTodo]); // 새로운 할 일을 기존 목록에 추가
  // };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todoResponse = await getTodos(goal.id); // 목표 ID로 할 일 목록 가져오기
        if (Array.isArray(todoResponse?.todos)) {
          setTodos(todoResponse.todos); // 할 일 목록 상태 업데이트
        }
      } catch (error) {
        console.error("할 일 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchTodos();
  }, [goal.id]);

  useEffect(() => {
    setProgress(Math.round((completedTodos.length / todos.length) * 100)); // 진행률 계산
  }, [completedTodos.length, todos.length]);

  return (
    <div className="h-auto min-h-[231px] w-full select-none rounded-2xl bg-blue-50 p-6">
      <div className="flex justify-between">
        <h2
          className="mb-2 cursor-pointer text-2xl font-bold hover:underline"
          onClick={() => router.push(`/dashboard/goal/${goal.id}`)}
        >
          {goal.title} {/* 목표 제목 표시 */}
        </h2>
        <button className="cursor-pointer text-blue-500" onClick={() => openModal("CREATE_NEW_TODO")}>
          <span className="text-sm">+ 할일 추가</span>
        </button>
      </div>

      <div className="mb-4">
        <ProgressBar progress={progress} /> {/* 진행률 표시 */}
      </div>

      <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-0">
        <div className="w-full">
          <h3 className="mb-3 text-lg font-semibold">To do</h3>
          <ul>
            {/* 완료되지 않은 할 일 목록 나열 */}
            {activeTodos.slice(0, 5).map((todo) => (
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
            {/* 완료된 할 일 목록 나열 */}
            {completedTodos.slice(0, 5).map((todo) => (
              <Todos key={todo.id} todo={todo} isGoal={false} onTodoCreated={onTodoCreated} />
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
            onClick={() => router.push(`/dashboard/goal/${goal.id}`)}
          >
            <span>더보기</span>
          </button>
        </div>
      )}

      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} goal={goal} onTodoCreated={onTodoCreated} />{" "}
        {/* 할 일 추가 모달 */}
      </Modal>
    </div>
  );
}
