"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/utils/authUtils";
import CreateNewTodo from "@/components/CreateNewTodo";
import useModal from "@/hook/useModal";
import AnimatedText from "@/utils/AnimatedText";
import { useGoalStore } from "@/store/goalStore";
import { useAuthStore } from "@/store/authStore";

export interface GoalType {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function SideBar() {
  const { goals, addGoal, refreshGoals } = useGoalStore();
  //const [goal, setGoal] = useState<GoalType[]>([]);
  const { Modal, openModal, closeModal } = useModal();
  const [inputVisible, setInputVisible] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      router.push("/");
    } else {
      console.error("로그아웃에 실패했습니다.");
    }
  };

  // const fetchAndSetGoals = async () => {
  //   const goalList = await getGoals();
  //   setGoals(goalList?.goals);
  // };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && goalInput.trim()) {
      await addGoal(goalInput);
      //await fetchAndSetGoals();
      setGoalInput("");
      setInputVisible(false);
    }
  };

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  // useEffect(() => {
  //   fetchAndSetGoals();

  //   // 커스텀 이벤트 리스너 추가
  //   const handleGoalUpdate = () => {
  //     fetchAndSetGoals();
  //   };

  //   window.addEventListener("goalUpdated", handleGoalUpdate);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //   return () => {
  //     window.removeEventListener("goalUpdated", handleGoalUpdate);
  //   };
  // }, []);

  return (
    <>
      <aside className={`transition-all duration-500 ease-in-out ${isOpen ? "w-0" : "w-[280px]"}`}>
        <div className="fixed top-0 z-20 flex w-screen gap-4 border border-b bg-white px-4 py-3 lg:hidden">
          <div
            className="flex h-6 w-6 cursor-pointer items-center justify-center px-[6px] py-2"
            onClick={() => router.push("/")}
          >
            <Image src="/hamburger.svg" width={0} height={0} alt="hamburger-button" className="h-auto w-auto" />
          </div>
          <h2 className="cursor-pointer text-[18px] font-semibold">대시보드</h2>
        </div>
        <div
          className={`sticky top-0 float-left hidden h-screen w-[280px] transform border-r bg-white py-3 transition-transform duration-500 ease-in-out ${
            isOpen ? "-translate-x-full" : "translate-x-0"
          } lg:block`}
        >
          <div className="mb-[13px] flex items-center justify-between px-[21px]">
            <Link href="/">
              <Image src="/brand.webp" width={106} height={0} className="h-auto w-auto" alt="brand" priority />
            </Link>
            <button className="rounded-lg border-2 p-2" onClick={toggleSidebar}>
              <Image src="/sidebar-hide.svg" width={0} height={0} className="h-auto w-2" alt="sidebar-button" />
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
          <div className="border-b border-b-slate-200 px-6 pb-6">
            <button
              onClick={() => openModal("CREATE_NEW_TODO")}
              className="w-full rounded-lg bg-blue-500 py-3 text-white outline-none"
            >
              + 새 할 일
            </button>
          </div>
          <div className="flex gap-2 border-b border-b-slate-200 px-6 py-4">
            <Image src="/sidebar-home.svg" width={0} height={0} className="ml-1.5 h-auto w-[13px]" alt="sidebar-home" />
            <Link href="/">
              <span>대시보드</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <div className="flex gap-2">
              <Image src="/sidebar-flag.svg" width={24} height={24} alt="sidebar-flag" />
              <span>목표</span>
            </div>
            <div className="mb-6 max-h-[350px] overflow-y-auto pt-4">
              <ul className="flex flex-col gap-4">
                {goals.map((goal) => (
                  <li key={goal.id} className="max-w-[231px] overflow-hidden text-ellipsis whitespace-nowrap">
                    <Link href={`/dashboard/goal/${goal.id}`}>・{goal.title}</Link>
                  </li>
                ))}
              </ul>
              {inputVisible && (
                <input
                  type="text"
                  ref={inputRef}
                  value={goalInput}
                  onChange={(e) => {
                    setGoalInput(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  className="block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
            <div>
              <button
                onClick={() => {
                  setInputVisible((prev) => !prev);
                }}
                className="w-full rounded-lg border border-blue-500 bg-white py-3 text-blue-500 outline-none"
              >
                + 새 목표
              </button>
            </div>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div className="float-left hidden h-screen w-fit flex-col items-center gap-4 border-r bg-white px-[14px] py-4 lg:flex">
          <Link href="/">
            <Image src="/sidebar-logo.png" width={21} height={20} alt="sidebar-brand-hide" />
          </Link>
          <button className="rounded-lg border-2 p-2" onClick={toggleSidebar}>
            <Image src="/sidebar-hide-R.svg" width={8} height={8} alt="sidebar-button" />
          </button>
        </div>
      )}
      <Modal name="CREATE_NEW_TODO" title="할 일 생성">
        <CreateNewTodo closeCreateNewTodo={closeModal} />
      </Modal>
    </>
  );
}
