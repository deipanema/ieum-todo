"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getNotes } from "@/api/noteAPI";
import { NoteType } from "@/app/Types/TodoGoalType";

import NoteItem from "../../components/NoteItem";

export default function NotesPage() {
  const path = usePathname();
  const goalId = Number(path.split("/").at(-1));
  const [notes, setNotes] = useState<NoteType[]>();

  const loadNotesData = async () => {
    const response = await getNotes(goalId);
    console.log(response);

    if (response) {
      setNotes(response.notes);
    }
  };

  useEffect(() => {
    loadNotesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <main className="mt-[51px] h-[calc(100vh-51px)] w-full bg-slate-100 lg:mt-0 lg:h-screen">
        <div className="mx-auto h-[calc(100vh-60px)] w-[343px] select-none overflow-y-auto p-6 sm:w-full 2xl:w-[1200px]">
          <div className="flex justify-between">
            <h2 className="mb-3 text-lg font-semibold">노트 모아보기</h2>
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-6 py-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-slate-800">
              <Image src="/goal-flag.svg" width={14} height={14} alt="recent-task-icon" />
            </div>
            <h1 className="text-sm font-semibold hover:underline">
              <Link href={`https://ieum-todo.vercel.app/dashboard/goal/${goalId}`}>
                {notes && notes[0] ? notes[0].goal.title : "작성된 노트가 없습니다."}
              </Link>
            </h1>
          </div>
          <div className="flex flex-col gap-4">{notes?.map((note) => <NoteItem key={note.id} note={note} />)}</div>
        </div>
      </main>
    </div>
  );
}
