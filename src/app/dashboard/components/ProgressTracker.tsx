import { useEffect } from "react";
import Image from "next/image";

import CircleProcess, { setProgress } from "./CircleProgress";

type ProgressTrackerType = {
  ratio: number;
  progressValue: number;
  setProgressValue: React.Dispatch<React.SetStateAction<number>>;
};

export default function ProgressTracker({ ratio, progressValue, setProgressValue }: ProgressTrackerType) {
  useEffect(() => {
    // 숫자 애니메이션 설정
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev < ratio) {
          return prev + 1; // 비율이 증가할 때
        } else if (prev > ratio) {
          return prev - 1; // 비율이 감소할 때
        } else {
          clearInterval(interval); // 비율이 같아지면 인터벌 종료
          return prev;
        }
      });
    }, 10); // 숫자가 증가하는 속도 조절

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [ratio, setProgressValue]);

  setProgress(ratio ? 100 - ratio : 100);
  return (
    <div className="relative flex h-[280px] w-full flex-col gap-4 rounded-xl bg-[#3B82F6] px-6 py-4 text-white 2xl:w-[588px]">
      <Image src="/dashboard-progress.webp" width={40} height={40} alt="pregress-task-icon" />
      <div>
        <h2>내 진행 상황</h2>
        <h2>
          <span className="text-5xl font-semibold">{progressValue}</span>%
        </h2>
      </div>
      <CircleProcess />
    </div>
  );
}
