import { useEffect, useState } from "react";

export default function ProgressBar({ progress }: { progress?: number }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(progress || 0);
  }, [progress]);

  return (
    <div className="flex h-auto w-full items-center gap-[8px] rounded-[13px] bg-white px-[9px]">
      <div className="relative h-[4px] w-full rounded-[6px] bg-[#F1F5F9]">
        <div
          style={{
            width: `${animatedProgress}%`,
            transition: "width 1s ease",
          }}
          className="absolute h-[4px] rounded-[6px] bg-[#000]"
        ></div>
      </div>
      <span className="text-[1.2rem] font-semibold">{progress ? Math.round(progress) : 0}%</span>
    </div>
  );
}