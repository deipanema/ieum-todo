"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/utils/authUtils";
import { useAuthStore } from "@/store/AuthStore";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

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

  return (
    <>
      {/* 사이드바 전체가 열렸을 때 */}
      <aside
        className={`transition-all duration-500 ease-in-out lg:fixed ${!isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* 모바일 사이드바 */}
        <div className="flex w-full gap-4 border-b bg-white px-4 py-3 lg:hidden">
          <button className="flex h-6 w-6 cursor-pointer items-center justify-center px-[6px] py-2">
            <Image alt="kebab-button" width={12} height={8} src="/sidebar-kebab.svg" />
          </button>
          <h2 className="cursor-pointer text-lg font-semibold">대시보드</h2>
        </div>

        {/* PC 사이드바 */}
        <div className="sticky top-0 float-left hidden h-screen w-[280px] translate-x-0 transform border-r bg-white py-3 transition-transform duration-500 ease-in-out lg:block">
          <div className="mb-[13px] flex items-center justify-between px-[21px]">
            <Link href="/">
              <Image alt="logo-sidebar" width={106} height={35} src="/brand.webp" priority />
            </Link>
            <button className="rounded-lg border-2 p-2" onClick={toggleSidebar}>
              <Image alt="sidebar-button" width={8} height={8} src="/sidebar-hide.svg" />
            </button>
          </div>

          {/* 프로필 및 할 일 버튼 */}
          <div className="mb-6 flex gap-3 px-6">
            <Image alt="profile-sidebar" width={64} height={64} src="/sidebar-profile.svg" />
            <div>
              <h2>{user?.name}</h2>
              <h2>{user?.email}</h2>
              <button className="text-xs text-gray-400" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
          <div className="border-b border-b-slate-200 px-6 pb-6">
            <button className="w-full rounded-lg bg-blue-500 py-3 text-white">+ 새 할 일</button>
          </div>

          {/* 메뉴 항목 */}
          <div className="flex gap-2.5 border-b border-b-slate-200 px-7 py-4">
            <Image alt="sidebar-home" width={13} height={13} src="/sidebar-home.svg" />
            <Link href="/">
              <span>대시보드</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <div className="flex gap-2">
              <Image alt="sidebar-flag" width={24} height={24} src="/sidebar-flag.svg" />
              <span>목표</span>
            </div>
            <div className="mb-6 max-h-[400px] overflow-y-auto pt-4">
              <div className="flex flex-col gap-4">
                <Link
                  href="/dashboard/goal/891"
                  className="max-w-[231px] overflow-hidden text-ellipsis whitespace-nowrap"
                ></Link>
              </div>
            </div>
            <button className="w-full rounded-lg border border-blue-500 bg-white py-3 text-blue-500">+ 새 목표</button>
          </div>
        </div>
      </aside>

      {/* 쪼꼬미 사이드바 - 사이드바가 닫혔을 때 */}
      <div
        className={`float-left hidden h-screen w-fit flex-col items-center gap-4 border-r bg-white px-[14px] py-4 transition-all duration-500 ease-in-out lg:flex ${
          !isOpen ? "translate-x-[-50px] opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <Link href="/">
          <Image alt="sidebar-logo-hide" width={24} height={24} src="/sidebar-logo.png" />
        </Link>
        <button className="rounded-lg border-2 p-2" onClick={toggleSidebar}>
          <Image alt="sidebar-button" width={8} height={8} src="/sidebar-hide-R.svg" />
        </button>
      </div>
    </>
  );
}
