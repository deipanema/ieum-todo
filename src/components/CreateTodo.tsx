import Image from "next/image";
import { useState } from "react";

import { useModalStore } from "@/store/modalSotre";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const closeModal = useModalStore((state) => state.closeModal);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="relative h-auto w-[650px] rounded-xl bg-white p-6">
      <Image
        alt="모달닫기버튼"
        width={24}
        height={0}
        className="absolute right-6 h-auto w-6 cursor-pointer"
        src="/modal-close.svg"
        onClick={closeModal}
      />
      <h1 className="mb-6 text-lg font-semibold">할 일 생성</h1>
      <div className="flex select-none flex-col gap-6">
        <div>
          <h2 className="mb-3 font-semibold">제목</h2>
          <input
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="할 일의 제목을 적어주세요"
            maxLength={30}
            value={title}
            onChange={handleTitleChange}
            autoFocus
          />
        </div>
        <div>
          <h2 className="mb-3 font-semibold">자료</h2>
          <div className="mb-3 flex gap-3">
            <div className="flex w-fit gap-[7px] rounded-lg border bg-slate-100 p-2">
              <Image alt="checkbox-icon" width={24} height={24} src="/modal-unchecked.svg" />
              <span>파일 업로드</span>
            </div>
            <div className="flex w-fit cursor-pointer gap-[7px] rounded-lg border bg-slate-100 p-2">
              <Image alt="checkbox-icon" width={24} height={24} src="/modal-unchecked.svg" />
              <span>링크 첨부</span>
            </div>
          </div>
          <div className="flex h-[184px] w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center text-slate-400">
              <div className="hover:underline">
                <p>+</p>
                <p>파일을 업로드해주세요</p>
              </div>
              <input className="absolute opacity-0" type="file" />
            </div>
          </div>
        </div>
        <div className="relative">
          <h2 className="mb-3 font-semibold">목표</h2>
          <div className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3">
            <p className="text-slate-400">목표를 선택해주세요</p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>
        </div>
        <button className="w-full rounded-xl bg-slate-500 py-3 text-white" disabled>
          확인
        </button>
      </div>
    </div>
  );
}
