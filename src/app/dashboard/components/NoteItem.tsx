import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import deleteNote, { getNote } from "@/api/noteAPI";
import { NoteType } from "@/type";

import NoteViewer from "./NoteViewer";

export default function NoteItem({ note }: { note: NoteType }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState<NoteType>();

  const loadNoteItemData = async () => {
    const response = await getNote(note.id);
    if (response) {
      setNoteContent(response.data);
    }
  };

  const handleDelete = async () => {
    const response = await deleteNote(note.id);
    if (response) {
      toast.success("삭제되었습니다.");
    }
  };

  useEffect(() => {
    loadNoteItemData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={note.id} className="relative rounded-xl bg-white p-[24px]">
      <div className="mb-[16px] flex justify-between">
        <Image src="/note-header.webp" width={28} height={28} alt="note-header-icon" />
        <Image
          className="cursor-pointer"
          src="/note-kebab.webp"
          width={28}
          height={28}
          alt="note-header-icon"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />
      </div>
      <h2 className="cursor-pointer text-lg hover:underline" onClick={() => setIsNoteOpen((prev) => !prev)}>
        {note.title}
      </h2>
      <hr className="my-3" />
      <div className="flex gap-2">
        <span className="rounded-[4px] bg-[#f1f5f9] px-[3px] py-[2px] text-xs">
          {note.todo.done ? "Done" : "To do"}
        </span>
        <h3>{note.todo.title}</h3>
      </div>
      {isDropdownOpen && (
        <div
          className="absolute right-10 top-20 z-10 rounded-lg border bg-white"
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <p
            className="cursor-pointer p-5 hover:bg-slate-200"
            onClick={() => router.push(`/dashboard/note/${note.todo.id}?goalId=${note.goal.id}`)}
          >
            수정하기
          </p>
          <p className="cursor-pointer p-5 hover:bg-slate-200" onClick={handleDelete}>
            삭제하기
          </p>
        </div>
      )}
      <NoteViewer isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} noteContent={noteContent} />
    </div>
  );
}
