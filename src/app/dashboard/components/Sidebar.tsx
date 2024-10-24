"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/utils/authUtils";
import useModal from "@/hook/useModal";
import AnimatedText from "@/utils/AnimatedText";
import { useGoalStore } from "@/store/goalStore";
import { useAuthStore } from "@/store/authStore";
import CreateNewTodo from "@/components/CreateNewTodo";
import { GoalType } from "@/type";

interface GoalsPage {
  goals: GoalType[];
}

interface GoalsData {
  pages: GoalsPage[];
}

export default function SideBar() {
  const { goals, addGoal, refreshGoals } = useGoalStore();
  const { Modal, openModal, closeModal } = useModal();
  const [inputVisible, setInputVisible] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const success = await logout();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    success ? router.push("/") : toast.error("로그아웃에 실패했습니다.");
  };

  // 새 목표 추가
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!goalInput.trim()) {
      toast.warn("목표를 입력해 주세요.");
      return setInputVisible(false);
    }

    if (goalInput.length > 20) {
      toast.warn("목표는 20자 이내로 입력해 주세요.");
      return;
    }

    try {
      const newGoal: GoalType = await addGoal(goalInput);
      setGoalInput("");
      setInputVisible(false);

      // 새로운 목표 추가 후 쿼리 데이터 업데이트
      queryClient.setQueryData<GoalsData>(["goals"], (oldData) => {
        if (!oldData) return { pages: [{ goals: [newGoal], nextCursor: null }], pageParams: [undefined] };

        const newPages = oldData.pages.map((page, index) =>
          index === 0 ? { ...page, goals: [newGoal, ...page.goals] } : page,
        );

        return { ...oldData, pages: newPages };
      });

      queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch (error) {
      console.error(error);
      toast.error("새로운 목표가 추가되지 않았습니다.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    refreshGoals().finally(() => setIsLoading(false));
  }, [refreshGoals]);

  useEffect(() => {
    if (inputVisible && inputRef.current) inputRef.current.focus();
  }, [inputVisible]);

  // 스켈레톤 UI 컴포넌트
  const SkeletonGoalList = () => (
    <ul className="flex flex-col gap-4">
      {Array(5)
        .fill("")
        .map((_, index) => (
          <li key={index} className="h-6 w-[231px] animate-pulse rounded bg-slate-200"></li>
        ))}
    </ul>
  );

  return (
    <>
      <aside className={`transition-all duration-500 ease-in-out ${isOpen ? "w-0" : "w-[280px]"}`}>
        {/* 모바일 햄버거 메뉴 */}
        <div className="fixed top-0 z-20 flex w-screen gap-4 border border-b bg-white px-4 py-3 lg:hidden">
          <div
            className="flex h-6 w-6 cursor-pointer items-center justify-center px-[6px] py-2"
            onClick={() => router.push("/")}
          >
            <Image src="/hamburger.svg" width={0} height={0} alt="hamburger-button" className="h-auto w-auto" />
          </div>
        </div>

        {/* 사이드바 메인 영역 */}
        <div
          className={`sticky top-0 float-left hidden h-screen w-[280px] transform border-r bg-white py-3 transition-transform duration-500 ease-in-out ${
            isOpen ? "-translate-x-full" : "translate-x-0"
          } lg:block`}
        >
          <div className="mb-[13px] flex items-center justify-between px-[21px]">
            <Link href="/">
              <Image src="/brand.webp" width={106} height={0} className="h-auto w-auto" alt="brand" priority />
            </Link>
            <button
              className="rounded-lg border-2 p-2"
              data-testid="main-sidebar-button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <Image src="/sidebar-hide.svg" width={0} height={0} className="h-auto w-2" alt="main-sidebar-button" />
            </button>
          </div>

          <div className="mb-6 flex gap-3 px-6">
            <Image src="/avatar.jpg" width={100} height={24} className="h-auto w-16 rounded-lg" alt="profile-sidebar" />
            <div>
              <h2>{user?.name}</h2>
              <h2>{user?.email}</h2>
              <AnimatedText text="로그아웃" onClick={handleLogout} />
            </div>
          </div>

          <h2 className="border-b border-b-slate-200 px-6 pb-6">
            <button
              onClick={() => openModal("CREATE_NEW_TODO")}
              className="w-full rounded-lg bg-blue-500 py-3 text-white outline-none"
            >
              + 새 할 일
            </button>
          </h2>
          <div className="flex gap-2 border-b border-b-slate-200 px-6 py-4">
            <Image src="/sidebar-home.svg" width={0} height={0} className="ml-1.5 h-auto w-[13px]" alt="sidebar-home" />
            <Link href="/">
              <h2>대시보드</h2>
            </Link>
          </div>

          <div className="px-6 py-4">
            <div className="flex gap-2">
              <Image src="/sidebar-flag.svg" width={24} height={24} alt="sidebar-flag" />
              <h2 data-testid="sidebar-goal-heading">목표</h2>
            </div>
            <div className="mb-6 max-h-[350px] overflow-y-auto pt-4">
              {isLoading ? (
                <SkeletonGoalList />
              ) : (
                <ul className="flex flex-col gap-4">
                  {goals.map((goal) => (
                    <li key={goal.id} className="max-w-[231px] truncate">
                      <Link href={`/dashboard/goal/${goal.id}`}>・{goal.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
              {inputVisible && (
                <form onSubmit={handleSubmit}>
                  <label className="sr-only">새목표</label>
                  <input
                    type="text"
                    ref={inputRef}
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </form>
              )}
            </div>
            <h2>
              <button
                onClick={() => setInputVisible((prev) => !prev)}
                className="w-full rounded-lg border border-blue-500 bg-white py-3 text-blue-500 outline-none"
              >
                + 새 목표
              </button>
            </h2>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="float-left hidden h-screen w-fit flex-col items-center gap-4 border-r bg-white px-[14px] py-4 lg:flex">
          <Link href="/">
            <Image src="/sidebar-logo.png" width={21} height={20} alt="sidebar-brand-hide" />
          </Link>
          <button
            className="rounded-lg border-2 p-2"
            data-testid="slim-sidebar-button"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <Image src="/sidebar-hide-R.svg" width={8} height={8} alt="slim-sidebar-button" />
          </button>
        </div>
      )}

      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} />
      </Modal>
    </>
  );
}
