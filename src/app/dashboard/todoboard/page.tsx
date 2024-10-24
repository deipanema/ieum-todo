"use client";

import { useEffect, useState } from "react";

import { useTodoStore } from "@/store/todoStore";
import CreateNewTodo from "@/components/CreateNewTodo";
import useModal from "@/hook/useModal";
import { getAllTodos } from "@/api/todoAPI";
import { TodoType } from "@/app/types/todoGoalType";

import TodoItem from "../components/TodoItem";

type StatusType = "All" | "Todo" | "Done";

const statuses: StatusType[] = ["All", "Todo", "Done"];

export default function TodoboardPage() {
  const { isUpdated } = useTodoStore();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [status, setStatus] = useState<StatusType>("All");
  const { Modal, openModal, closeModal } = useModal();

  const loadTodoboardData = async () => {
    const response = await getAllTodos();
    setTodos(response.todos);
  };

  useEffect(() => {
    loadTodoboardData();
  }, [isUpdated]);

  const renderTodos = () => {
    switch (status) {
      case "Todo":
        return todos.filter((todo: TodoType) => !todo.done);
      case "Done":
        return todos.filter((todo: TodoType) => todo.done);
      default:
        return todos;
    }
  };

  return (
    <div className="mt-[51px] h-[calc(100vh-51px)] w-full bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto h-[calc(100vh-40px)] w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <div className="flex justify-between">
          <h2 className="mb-3 text-lg font-semibold">모든 할 일 {`(${todos?.length})`}</h2>
          <span className="cursor-pointer text-sm text-blue-500" onClick={() => openModal("CREATE_NEW_TODO")}>
            + 할일 추가
          </span>
        </div>
        <div className="flex h-full">
          <div className="flex max-h-full w-full flex-col gap-4 overflow-y-auto rounded-xl bg-white px-6 py-4">
            <div className="flex items-center gap-[8px]">
              <div className="flex items-center gap-2">
                {statuses.map((currentStatus) => (
                  <div
                    key={currentStatus}
                    className={`cursor-pointer rounded-2xl border border-slate-300 px-3 py-[4px] ${
                      status === currentStatus ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => setStatus(currentStatus)}
                  >
                    {currentStatus}
                  </div>
                ))}
              </div>
            </div>
            <ul>
              {Array.isArray(renderTodos()) &&
                renderTodos().map((todo: TodoType) => <TodoItem key={todo.id} todo={todo} />)}
            </ul>
          </div>
        </div>
      </div>
      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} />
      </Modal>
    </div>
  );
}
