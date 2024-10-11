"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteGoal, getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";
import EditGoalTitle from "@/components/EditGoalTitle";
import useModal from "@/hook/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";

import Todos from "../../components/Todos";
import ProgressBar from "../../components/ProgressBar";

type GoalPageProps = {
  params: { id: string };
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

export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export default function GoalPage({ params }: GoalPageProps) {
  const { id } = params;
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const [progress, setProgress] = useState(0);

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [goals, setGoals] = useState<GoalType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 목표 및 할 일 데이터 가져오기
  const fetchInitialData = async () => {
    try {
      const goalResponse = await getGoal(Number(id));
      setGoals(goalResponse);

      if (goalResponse) {
        const todoResponse = await getTodos(goalResponse?.id);

        // todoResponse와 todoResponse.todos가 존재하는지 확인
        const todosArray = Array.isArray(todoResponse?.todos) ? todoResponse.todos : [];
        setTodos(todosArray);

        // todoResponse와 todosArray의 길이가 0보다 큰지 확인
        if (todoResponse?.totalCount && todosArray.length > 0) {
          const completedTodos = todosArray.filter((todo: TodoType) => todo.done === true).length;
          const ratio = (completedTodos / todoResponse.totalCount) * 100;
          setProgress(ratio);
        } else {
          setProgress(0); // 데이터를 가져오지 못했을 때의 기본값 설정
        }
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteGoal(goals?.id as number);
      if (response) {
        router.push("/");
      }
    } catch (error) {
      console.error("목표 삭제 중 오류 발생:", error);
    }
  };

  const handleEditGoal = () => {
    if (goals) {
      openModal("EDIT_GOAL_TITLE");
    }
    setIsOpen(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <main className="mt-[51px] h-auto min-h-[calc(100vh)] w-full select-none bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <h2 className="mb-3 text-[18px] font-semibold">목표</h2>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-white px-6 py-4 sm:w-auto">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 justify-center rounded-2xl bg-slate-800">
                <Image src="/goal-flag.svg" width={24} height={24} alt="goal-icon" />
              </div>
              <h3 className="ml-2 text-left text-lg font-semibold">{goals?.title}</h3>
            </div>

            <Image
              className="h-6 w-6 cursor-pointer"
              src="/goal-kebab.svg"
              width={0}
              height={0}
              alt="kebab-icon"
              onClick={handleToggleDropdown}
            />

            {isOpen && (
              <div ref={dropdownRef} className="absolute right-3 top-9 z-10 rounded-lg border bg-white shadow-xl">
                <p onClick={handleEditGoal} className="cursor-pointer p-3 hover:bg-slate-200">
                  수정하기
                </p>
                <p onClick={handleDelete} className="cursor-pointer p-3 hover:bg-slate-200">
                  삭제하기
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-2 pl-[7px]">Progress</h4>
            <ProgressBar progress={progress} />
          </div>
        </div>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-blue-100 px-6 py-4 sm:w-auto">
          <div className="flex items-center gap-2">
            <Image src="/note.svg" className="h-auto w-6" width={0} height={0} alt="note-icon" />
            <h2 className="cursor-pointer text-[18px] font-semibold">노트 모아보기</h2>
          </div>
        </div>
        <div className="flex select-none flex-col items-start gap-6 sm:flex-row 2xl:flex-row">
          {/* To do Section */}
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] font-semibold">To do</h2>
              <button className="cursor-pointer text-blue-500" onClick={() => openModal("CREATE_NEW_TODO")}>
                <span className="text-sm">+ 할일 추가</span>
              </button>
            </div>
            <ul>
              {Array.isArray(todos) &&
                todos
                  .filter((todo) => !todo.done)
                  .map((todo) => <Todos key={todo.id} todo={todo} setTodos={setTodos} isGoal={false} />)}
            </ul>
            {Array.isArray(todos) && todos.filter((todo) => !todo.done).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">해야할 일이 아직 없어요.</div>
            )}
          </div>
          {/* Done Section */}
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-slate-200 px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">Done</h2>
            </div>
            <ul>
              {Array.isArray(todos) &&
                todos
                  .filter((todo) => todo.done)
                  .map((todo) => <Todos key={todo.id} todo={todo} setTodos={setTodos} isGoal={false} />)}
            </ul>
            {Array.isArray(todos) && todos.filter((todo) => todo.done).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">다 한 일이 아직 없어요.</div>
            )}
          </div>
        </div>
      </div>
      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} />
      </Modal>
      <Modal name="EDIT_GOAL_TITLE" title="목표 수정">
        <EditGoalTitle closeEditTitle={closeModal} goals={goals as GoalType} />
      </Modal>
    </main>
  );
}
