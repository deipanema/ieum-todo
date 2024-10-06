"use client";

import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="relative">
      <div className="mt-[51px] min-h-[calc(100vh-51px)] w-full select-none bg-slate-100 lg:mt-0">
        {
          <div className="mx-auto w-[343px] p-6 sm:w-full 2xl:w-[1200px]">
            <h2 className="mb-3 text-lg font-semibold">대시보드</h2>
            <div className="flex flex-col gap-6 sm:flex-row 2xl:flex-row">
              <div className="flex h-auto w-full flex-col gap-4 rounded-xl bg-white px-6 py-4 2xl:w-[588px]">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-blue-500">
                    <Image src="/dashboard-recent.svg" width={16} height={16} alt="recent-task-icon" />
                  </div>
                  <h2 className="text-lg font-semibold">최근 등록한 할 일</h2>
                  <Link href="/dashboard/#" className="grow text-right">
                    <p className="min-w-[74px] cursor-pointer text-sm text-slate-600">{"모두 보기 >"}</p>
                  </Link>
                </div>
                <ul className=""></ul>
              </div>
              {/* progress circle*/}
              <div className="relative flex h-[280px] w-full flex-col gap-4 rounded-xl bg-blue-500 px-6 py-4 text-white 2xl:w-[588px]">
                <Image src="/dashboard-progress.webp" width={40} height={40} alt="progress-task-icon" />
                <div>
                  <h2>내 진행 상황</h2>
                  <h2>
                    <span className="text-3xl font-semibold">0</span> %
                  </h2>
                </div>
                <div className="absolute left-[40%] top-11 flex 2xl:left-[50%]">
                  <Image src="/dashboard-progress-circle.svg" width={166} height={166} alt="progress-circle-icon" />
                </div>
              </div>
            </div>
            <div className="rounded-3 mt-6 flex h-auto w-[306px] flex-col gap-4 bg-white px-6 py-4 sm:w-auto">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[#F97316]">
                  <Image src="/dashboard-flag.svg" width={24} height={24} alt="recent-task-icon" />
                </div>
                <h2 className="text-lg font-semibold">목표 별 할 일</h2>
              </div>
              <div className="flex max-h-[675px] grid-cols-2 flex-col gap-4 overflow-y-auto p-2 sm:grid"></div>
            </div>
          </div>
        }
      </div>
    </main>
  );
}
