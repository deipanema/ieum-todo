import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

import { NoteType } from "@/app/types/todoGoalType";

type NoteViewerProps = {
  isNoteOpen: boolean;
  setIsNoteOpen: Dispatch<SetStateAction<boolean>>;
  noteContent: NoteType | undefined;
};

export default function NoteViewer({ isNoteOpen, setIsNoteOpen, noteContent }: NoteViewerProps) {
  const handleLinkClick = (linkUrl: string) => {
    const url = linkUrl.includes("https://") ? linkUrl : `https://${linkUrl}`;
    const screen = window.screen.width;
    const windowWidth = screen > 450 ? window.screen.width * 0.5 : screen;
    const windowHeight = window.screen.height;
    const windowLeft = window.screenX;
    const windowTop = window.screenY + 100;

    window.open(url, "_blank", `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
  };

  return (
    <div className="relative">
      {isNoteOpen && (
        <div
          className="fixed left-0 top-0 z-10 h-screen w-screen bg-[rgba(0,0,0,0.5)]"
          onClick={() => setIsNoteOpen((prev) => !prev)}
        ></div>
      )}
      <div
        className={`fixed right-0 top-0 z-20 h-full w-full bg-white p-6 transition-transform duration-700 sm:w-3/4 xl:w-1/2 ${
          isNoteOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 ml-0.5">
          <Image
            className="cursor-pointer"
            src="/modal-close.svg"
            width={18}
            height={18}
            alt="close-icon"
            onClick={() => setIsNoteOpen((prev) => !prev)}
          />
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-white">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1E293B]">
            <Image src="/goal-flag.svg" width={14} height={14} alt="recent-task-icon" />
          </div>
          <h1 className="font-semibold">{noteContent?.goal.title}</h1>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-[4px] bg-slate-100 px-[3px] py-[2px] text-xs">
              {noteContent?.todo.done ? "Done" : "To do"}
            </span>
            <h2 className="text-sm text-slate-700">{noteContent?.todo.title}</h2>
          </div>
          <span className="text-xs text-slate-500">{noteContent?.updatedAt.slice(0, 10).split("-").join(".")}</span>
        </div>
        <h3 className="mb-3 w-full border-y py-3 text-lg font-medium focus:outline-none">{noteContent?.title}</h3>
        {noteContent?.linkUrl && (
          <div className="mb-4 mt-3 flex w-full justify-between rounded-[20px] bg-slate-200 px-[6px] py-1">
            <div className="flex items-center gap-2">
              <Image src="/note-embed.svg" width={24} height={24} alt="embed-icon" />
              <p
                className="cursor-pointer overflow-hidden text-ellipsis hover:underline"
                onClick={() => handleLinkClick(noteContent.linkUrl)}
              >
                {noteContent?.linkUrl}
              </p>
            </div>
          </div>
        )}
        <textarea
          value={noteContent ? noteContent.content : "불러오는중..."}
          readOnly
          className="h-[500px] w-full overflow-y-auto focus:outline-none"
        />
      </div>
    </div>
  );
}
