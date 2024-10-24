"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getGoal } from "@/api/goalAPI";
import useModal from "@/hook/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";
import { getTodos } from "@/api/todoAPI";
import { GoalType, TodoType } from "@/app/types/todoGoalType";

import ProgressBar from "./ProgressBar";
import TodoItem from "./TodoItem";
import { useTodoStore } from "@/store/todoStore";

export type TodoCardProps = {
  id: number;
};

export default function TodoCard({ id }: TodoCardProps) {
  const router = useRouter();
  const { isUpdated } = useTodoStore();
  const [goal, setGoal] = useState<GoalType | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalType>();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [hasMoreThanFiveTodos, setHasMoreThanFiveTodos] = useState(false);
  const [completedTodos, setCompletedTodos] = useState<TodoType[]>([]);
  const [activeTodos, setAcitveTodos] = useState<TodoType[]>([]);
  const { Modal, openModal, closeModal } = useModal();

  const loadTodoCardData = async () => {
    const goalResponse = await getGoal(id);
    const activeResponse = await getTodos(id, false, 5);
    const completedResponse = await getTodos(id, true, 5);

    if (goalResponse && activeResponse && completedResponse) {
      setGoal(goalResponse);
      setSelectedGoal(goalResponse);
      setAcitveTodos(activeResponse.todos);
      setCompletedTodos(completedResponse.todos);

      const totalTodoCount = activeResponse.totalCount + completedResponse.totalCount;
      setProgressPercentage(Math.round((completedResponse.totalCount / totalTodoCount) * 100));

      if (activeResponse.totalCount >= 5 || completedResponse.totalCount >= 5) setHasMoreThanFiveTodos(true);
      else setHasMoreThanFiveTodos(false);
    }
  };

  useEffect(() => {
    loadTodoCardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

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
        <ProgressBar progressPercentage={progressPercentage} />{" "}
      </div>

      <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-0">
        <div className="w-full">
          <h3 className="mb-3 text-lg font-semibold">To do</h3>
          <ul>
            {activeTodos.length > 0 ? (
              activeTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isTodoCardRelated={false}
                  inTodoCard
                  // toggleTodoStatus={toggleTodoStatus}
                  //deleteTodo={handleDeleteTodo}
                />
              ))
            ) : (
              <li className="text-center text-sm text-slate-500">아직 해야할 일이 없어요</li>
            )}
          </ul>
        </div>
        <div className="w-full">
          <h3 className="mb-3 text-lg font-semibold">Done</h3>
          <ul>
            {completedTodos.length > 0 ? (
              completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isTodoCardRelated={false}
                  inTodoCard
                  //  toggleTodoStatus={toggleTodoStatus}
                  //deleteTodo={handleDeleteTodo}
                />
              ))
            ) : (
              <li className="text-center text-sm text-slate-500">아직 다 한 일이 없어요</li>
            )}
          </ul>
        </div>
      </div>
      {hasMoreThanFiveTodos && (
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

      {goal && (
        <Modal name="CREATE_NEW_TODO" title="할 일 생성">
          <CreateNewTodo closeCreateNewTodo={closeModal} selectedGoalId={selectedGoal?.id} />
        </Modal>
      )}
    </div>
  );
}
