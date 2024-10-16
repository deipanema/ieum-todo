"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import CreateNewTodo from "@/components/CreateNewTodo";
import useModal from "@/hook/useModal";
import { getAllTodos } from "@/api/todoAPI";

import Todos from "../components/Todos";

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

type StatusType = "All" | "Todo" | "Done";

const statuses: StatusType[] = ["All", "Todo", "Done"];

export default function TodoboardPage() {
  //const [todos, setTodos] = useState<TodoType[]>([]);
  const [status, setStatus] = useState<StatusType>("All");
  const { Modal, openModal, closeModal } = useModal();

  // useQuery를 사용하여 할 일 데이터를 가져옴
  const { data: todosData, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await getAllTodos(); // API 호출
      if (response && response.data) {
        return response.data; // 데이터 구조가 TodosResponse와 일치해야 합니다.
      }
      throw new Error("데이터를 불러오는 데 실패했습니다."); // 데이터가 없으면 에러 던지기
    },
    select: (data) => data.todos, // 최종 데이터에서 todos만 선택
  });

  console.log(todosData);

  // const handleTodoUpdate = useCallback(async (updatedTodo: TodoType) => {
  //   try {
  //     const response = await patchTodo(
  //       updatedTodo.title,
  //       updatedTodo.goal.id,
  //       updatedTodo.done,
  //       updatedTodo?.id,
  //       updatedTodo.fileUrl || "",
  //       updatedTodo.linkUrl || "",
  //     );
  //     if (response) {
  //       //  setTodos((prevTodos) =>
  //       //    prevTodos.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo))
  //       //  );
  //     }
  //   } catch (error) {
  //     console.error("할 일 업데이트 중 오류 발생:", error);
  //   }
  // }, []);

  const renderTodos = () => {
    switch (status) {
      case "Todo":
        return todosData.filter((todo: TodoType) => !todo.done);
      case "Done":
        return todosData.filter((todo: TodoType) => todo.done);
      default:
        return todosData;
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`데이터 로딩 중 오류 발생: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="mt-[51px] h-[calc(100vh-51px)] w-full bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto h-[calc(100vh-40px)] w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <div className="flex justify-between">
          <h2 className="mb-3 text-lg font-semibold">모든 할 일 {`(${todosData?.length})`}</h2>
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
                renderTodos().map((todo: TodoType) => <Todos key={todo.id} todo={todo} />)}
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
