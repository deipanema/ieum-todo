"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { logout } from "@/utils/authUtils";
import { useAuthStore } from "@/store/AuthStore";
import { getGoals, PostGoal } from "@/api/goalAPI";
import { useModalStore } from "@/store/modalStore";
import CreateNewTodo from "@/components/CreateNewTodo";

export interface GoalType {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function SideBar() {
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { openParentModal } = useModalStore();

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

  const handleAddGoalClick = () => {
    setInputVisible((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalInput(e.target.value);
  };

  const fetchAndSetGoals = async () => {
    const goalList = await getGoals();
    setGoals(goalList?.data.goals);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && goalInput.trim()) {
      console.log(goalInput);
      await PostGoal(goalInput);
      await fetchAndSetGoals();
      setGoalInput("");
      setInputVisible(false);
    }
  };

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    fetchAndSetGoals();
  }, []);

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
            <Image src="/sidebar-profile.svg" width={0} height={0} className="h-auto w-16" alt="profile-sidebar" />
            <div>
              <h2>{user?.name}</h2>
              <h2>{user?.email}</h2>
              <button className="text-3 text-slate-400" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
          <div className="border-b border-b-slate-200 px-6 pb-6">
            <button onClick={openParentModal} className="w-full rounded-lg bg-blue-500 py-3 text-white outline-none">
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
            <div className="mb-6 max-h-[400px] overflow-y-auto pt-4">
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
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
            <div>
              <button
                onClick={handleAddGoalClick}
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
      <CreateNewTodo />
    </>
  );
}
