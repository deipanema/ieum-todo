"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { useGoalStore } from "@/store/goalStore";
import { deleteGoal, ErrorType } from "@/api/goalAPI";
import { getTodos } from "@/api/todoAPI";
import useModal from "@/hook/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";
import EditGoalTitleModal from "@/components/EditGoalTitleModal";
import LoadingScreen from "@/components/LoadingScreen";
import useTodoStore, { TodoType } from "@/store/todoStore";

import Todos from "../../components/Todos";
import ProgressBar from "../../components/ProgressBar";

type GoalPageProps = {
  params: { goalId: string };
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
  const { goalId } = params;
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const { goals, refreshGoals } = useGoalStore();
  const { todos, setTodos } = useTodoStore();
  const [goal, setGoal] = useState<GoalType | null>(null);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 목표 찾기
  useEffect(() => {
    setGoal(goals.find((goal) => goal.id === Number(goalId)) || null);
  }, [goals, goalId]);

  // 할 일 데이터 가져오기
  const fetchTodos = async (goalId: number) => {
    const todoResponse = await getTodos(goalId);
    return Array.isArray(todoResponse?.todos) ? todoResponse.todos : [];
  };

  // React Query를 사용하여 할 일 데이터를 가져옴
  const { data: todosData, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos", goalId],
    queryFn: () => fetchTodos(goal ? goal.id : 0), // goal이 있을 때만 호출
    enabled: !!goal, // goal이 있을 때만 쿼리 실행
  });

  // 할 일 업데이트 및 진행률 계산
  useEffect(() => {
    if (todosData) {
      setTodos(todosData);
      updateProgress(todosData);
    }
  }, [setTodos, todosData]);

  const updateProgress = (todosArray: TodoType[]) => {
    if (todosArray.length > 0) {
      const completedTodos = todosArray.filter((todo: TodoType) => todo.done === true).length;
      const ratio = (completedTodos / todosArray.length) * 100;
      setProgress(ratio);
    } else {
      setProgress(0);
    }
  };

  // 목표 삭제 처리
  const handleDelete = async () => {
    if (goal) {
      try {
        const response = await deleteGoal(goal.id);
        if (response) {
          toast.success("목표가 삭제되었습니다.");
          await refreshGoals(); // 사이드바의 목표 상태를 업데이트
          router.push("/");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorType>;
        toast.error(axiosError.message);
      }
    }
  };

  // 목표 제목 수정 모달 열기
  const handleEditGoal = () => {
    if (goal) {
      openModal("EDIT_GOAL_TITLE");
    }
    setIsOpen(false);
  };

  // 이거 있어야 될 것 같은데?
  // useEffect(() => {
  //   updateProgress(todos);
  // }, [todos]);

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

  if (isTodosLoading) {
    return <LoadingScreen />;
  }

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
                todos.filter((todo) => !todo.done).map((todo) => <Todos key={todo.id} todo={todo} isGoal={false} />)}
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
                todos.filter((todo) => todo.done).map((todo) => <Todos key={todo.id} todo={todo} isGoal={false} />)}
            </ul>
            {Array.isArray(todos) && todos.filter((todo) => todo.done).length === 0 && (
              <div className="mx-auto my-auto text-sm text-slate-500">다 한 일이 아직 없어요.</div>
            )}
          </div>
        </div>
      </div>
      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} goalId={goal?.id} />
      </Modal>
      <Modal name="EDIT_GOAL_TITLE" title="목표 수정">
        <EditGoalTitleModal closeEditTitle={closeModal} goals={goal as GoalType} />
      </Modal>
    </div>
  );
}
