"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { deleteGoal, ErrorType, getGoal } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";
import useModal from "@/hook/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";
import EditGoalTitleModal from "@/components/EditGoalTitleModal";
import { GoalType, TodoType } from "@/app/Types/TodoGoalType";

import ProgressBar from "../../components/ProgressBar";
import TodoItem from "../../components/TodoItem";

type GoalPageProps = {
  params: { goalId: string; title: string };
};

export default function GoalPage({ params }: GoalPageProps) {
  const { goalId, title } = params;
  console.log(title);
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();

  const [goal, setGoal] = useState<GoalType | null>(null);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoType | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 할 일 데이터 가져오기
  const loadGoalData = async () => {
    const goalResponse = await getGoal(Number(goalId));
    const todoResponse = await getTodos(Number(goalId));

    setGoal(goalResponse);
    setSelectedTodo(todoResponse);
    setTodos(todoResponse.todos);

    const completedTodos = todoResponse.todos.filter((todo: TodoType) => todo.done === true).length;
    const completionRatio = (completedTodos / todoResponse.todos.length) * 100;
    setProgressPercentage(completionRatio);
  };

  // 목표 삭제 처리
  const handleDelete = async () => {
    try {
      const response = await deleteGoal(goal?.id as number);
      if (response) {
        toast.success("목표가 삭제되었습니다.");
        // await refreshGoals(); // 사이드바의 목표 상태를 업데이트
        router.push("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorType>;
      toast.error(axiosError.message);
    }
  };

  // 목표 제목 수정 모달 열기
  const handleEditGoalTitle = () => {
    if (goal) {
      openModal("EDIT_GOAL_TITLE");
    }
    setIsOpen(false);
  };

  const checkIfNotesExist = (todos: TodoType[]) => {
    const noteExists = todos.some((todo) => todo.noteId !== null);
    if (noteExists) {
      router.push(`/dashboard/notes/${goal?.id}`);
    } else {
      toast.warn("해당 목표에 작성된 노트가 없습니다.");
    }
  };

  useEffect(() => {
    loadGoalData();
  }, [progressPercentage]);

  // 외부 클릭 시 드롭다운 닫기
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

  // if (isTodosLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <div className="mt-[51px] h-auto min-h-[calc(100vh)] w-full select-none bg-slate-100 lg:mt-0 lg:h-screen">
      <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
        <h2 className="mb-3 text-[18px] font-semibold">목표</h2>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-white px-6 py-4 sm:w-auto">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 justify-center rounded-2xl bg-slate-800">
                <Image src="/goal-flag.svg" width={24} height={24} alt="goal-icon" />
              </div>
              <h3 className="ml-2 text-left text-lg font-semibold">{goal?.title}</h3>
            </div>

            <Image
              className="h-6 w-6 cursor-pointer"
              src="/goal-kebab.svg"
              width={0}
              height={0}
              alt="kebab-icon"
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            />

            {isOpen && (
              <div ref={dropdownRef} className="absolute right-3 top-9 z-10 rounded-lg border bg-white shadow-xl">
                <p onClick={handleEditGoalTitle} className="cursor-pointer p-3 hover:bg-slate-200">
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
            <ProgressBar progressPercentage={progressPercentage} />
          </div>
        </div>
        <div className="my-6 flex h-full w-[306px] flex-col gap-4 rounded-xl bg-blue-100 px-6 py-4 sm:w-auto">
          <div className="flex items-center gap-2">
            <Image src="/note.svg" className="h-auto w-6" width={0} height={0} alt="note-icon" />
            <h2 onClick={() => checkIfNotesExist(todos)} className="cursor-pointer text-lg font-semibold">
              노트 모아보기
            </h2>
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
              {todos
                .filter((todo) => todo.done === false)
                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} isTodoCardRelated={false} />
                ))}
            </ul>
            {todos.filter((todo) => todo.done === false).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">해야할 일이 아직 없어요.</div>
            )}
          </div>
          {/* Done Section */}
          <div className="relative flex min-h-[250px] w-full flex-col gap-4 rounded-xl bg-slate-200 px-6 py-4 2xl:w-[588px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">Done</h2>
            </div>
            <ul>
              {todos
                .filter((todo) => todo.done === true)
                .map((todo) => (
                  <TodoItem key={todo.id} todo={todo} isTodoCardRelated={false} />
                ))}
            </ul>
            {todos.filter((todo) => todo.done === true).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">다 한 일이 아직 없어요.</div>
            )}
          </div>
        </div>
      </div>
      {goal && (
        <Modal name="CREATE_NEW_TODO" title="할 일 생성">
          <CreateNewTodo closeCreateNewTodo={closeModal} todo={selectedTodo} selectedGoalId={goal.id} />
        </Modal>
      )}
      <Modal name="EDIT_GOAL_TITLE" title="목표 수정">
        <EditGoalTitleModal closeEditTitle={closeModal} goals={goal as GoalType} />
      </Modal>
    </div>
  );
}
