"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type UploadLinkModalProps = {
  closeUploadLink: () => void;
  link?: string;
  setLink?: Dispatch<SetStateAction<string>>;
};

export default function UploadLinkModal({ closeUploadLink, link = "", setLink }: UploadLinkModalProps) {
  const [title, setTitle] = useState(link);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (setLink) setLink(title);
    closeUploadLink();
  };

  useEffect(() => {
    setTitle(link);
  }, [link]);

  return (
    <form className="flex select-none flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="mb-3 font-semibold">제목</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#F8FAFC] px-6 py-3 focus:outline-none"
          placeholder="영상이나 글, 파일의 링크를 넣어주세요."
          autoFocus
        />
      </div>
      <div>
        <button
          disabled={title.length === 0}
          className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
        >
          확인
        </button>
      </div>
    </form>
  );
}
