"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [goals, setGoals] = useState<GoalType | null>(null);
  const [todos, setTodos] = useState<TodoType[]>([]);

  const activeTodos = Array.isArray(todos) ? todos.filter((todo) => !todo.done) : [];
  const completedTodos = Array.isArray(todos) ? todos.filter((todo) => todo.done) : [];
  const showMore = activeTodos.length > 5 || completedTodos.length > 5;

  useEffect(() => {
    setProgress(Math.round((completedTodos.length / todos.length) * 100));
  }, [completedTodos.length, todos.length]);

  useEffect(() => {
    async function fetchData() {
      try {
        const goalResponse = await getGoal(id);
        setGoals(goalResponse);

        if (goalResponse?.id) {
          const todoResponse = await getTodos(goalResponse.id);
          const fetchedTodos = Array.isArray(todoResponse?.todos) ? todoResponse.todos : [];
          setTodos(fetchedTodos);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div className="h-auto min-h-[231px] w-full select-none rounded-2xl bg-blue-50 p-6">
      <div className="flex justify-between">
        <h2
          className="mb-2 cursor-pointer text-2xl font-bold hover:underline"
          onClick={() => router.push(`/dashboard/goal/${goals?.id}`)}
        >
          {goals?.title}
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
            {activeTodos.slice(0, 5).map((todo) => (
              <Todos key={todo.id} todo={todo} setTodos={setTodos} isGoal={false} />
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
            {completedTodos.slice(0, 5).map((todo) => (
              <Todos key={todo.id} todo={todo} setTodos={setTodos} isGoal={false} />
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
            onClick={() => router.push(`/dashboard/goal/${goals?.id}`)}
          >
            <span>더보기</span>
            <Image src="/modal-arrowdown.svg" width={24} height={24} alt="button-arrow-icon" />
          </button>
        </div>
      )}

      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} />
      </Modal>
    </div>
  );
}
