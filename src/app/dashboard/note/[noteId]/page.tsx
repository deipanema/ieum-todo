"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import useModal from "@/hooks/useModal";
import { getNote, patchNotes, postNotes } from "@/api/noteAPI";
import { getTodos } from "@/api/todoAPI";
import UploadLinkModal from "@/components/UploadLinkModal";
import { NoteType, TodoType } from "@/type";

export default function NotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [note, setNote] = useState<NoteType>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState<string>("");
  const { Modal, openModal, closeModal } = useModal();
  const [todo, setTodo] = useState<TodoType>();
  const todoId = Number(pathName.split("/").at(-1));
  const goalId = Number(searchParams.get("goalId"));

  const loadNoteData = async () => {
    const todoResponse = await getTodos(goalId);
    const selectedTodo = todoResponse.todos.find((todo: TodoType) => todo.id === todoId);
    setTodo(selectedTodo);

    const noteResponse = await getNote(selectedTodo.noteId);

    if (noteResponse) {
      setNote(noteResponse);
      setContent(noteResponse.content);
      setTitle(noteResponse.title);
      setLink(noteResponse.linkUrl);
    }
  };

  const handleSubmit = async (type: "write" | "edit") => {
    const response =
      type === "write"
        ? await postNotes(todoId, title, content, link || null)
        : await patchNotes(Number(note?.id), title, content, link || null);

    if (response) {
      setNote(response);
      toast.success(type === "write" ? "작성이 완료되었습니다." : "수정이 완료되었습니다.");
      router.back();
    }
  };

  useEffect(() => {
    loadNoteData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= 30) setTitle(value);
  };

  const saveDraft = () => {
    const tempData = { title, content, link };
    localStorage.setItem(`note${todoId}`, JSON.stringify(tempData));
    toast.success("임시 저장이 완료되었습니다.");
  };

  const loadSavedDraft = () => {
    const savedNote = localStorage.getItem(`note${todoId}`);
    if (savedNote) {
      const { title, content, link } = JSON.parse(savedNote);
      setTitle(title || "제목 없음");
      setContent(content || "");
      setLink(link || "");
      localStorage.removeItem(`note${todoId}`);
      toast.success("임시 저장된 내용을 불러왔습니다.");
    } else {
      toast.info("임시 저장된 내용이 없습니다.");
    }
  };

  return (
    <div className="flex">
      <form className="mt-[51px] h-[calc(100vh-51px)] w-full bg-white lg:mt-0 lg:h-screen">
        <div className="h-[calc(100vh-40px)] w-full p-6 2xl:w-[1200px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{note ? "노트 수정" : "노트 작성"}</h2>
            <div className="flex items-center gap-[31px] text-sm">
              <p
                className={`cursor-pointer font-semibold ${title && content ? "text-blue-500 hover:text-blue-600" : "cursor-default text-slate-400"}`}
                onClick={saveDraft}
              >
                임시저장
              </p>
              <h6
                className={`cursor-pointer rounded-xl px-6 py-3 text-white ${
                  title && content ? "bg-blue-500" : "cursor-default bg-slate-400"
                }`}
                onClick={() => (title && content && note ? handleSubmit("edit") : handleSubmit("write"))}
              >
                {note ? "수정하기" : "작성완료"}
              </h6>
            </div>
          </div>
          {localStorage.getItem(`note${todoId}`) && (
            <div className="mb-8 flex h-14 items-center justify-between rounded-3xl bg-blue-50 px-3 py-2.5 md:py-4 md:pl-4 md:pr-3">
              <div className="flex items-center gap-2">
                <button type="button" className="h-6 w-6 shrink-0 rounded-full p-[3px]">
                  <div className="flex h-full w-full items-center justify-center">
                    <Image alt="save as draft icon" width="16" height="16" src="/save-draft.png" />
                  </div>
                </button>
                <p className="hidden text-sm font-semibold text-blue-500 md:block">
                  임시 저장된 노트가 있어요. 저장된 노트를 불러오시겠어요?
                </p>
                <p className="block text-sm font-semibold text-blue-500 md:hidden">
                  임시 저장된 노트가 있어요.
                  <br /> 저장된 노트를 불러오시겠어요?
                </p>
              </div>
              <button
                className="border-1 relative inline-flex h-9 w-[84px] min-w-16 items-center justify-center gap-2 rounded-3xl border border-blue-500 bg-white px-3 py-3 text-sm font-semibold text-blue-500 transition-none hover:border-blue-600 hover:text-blue-600"
                type="button"
                onClick={loadSavedDraft}
              >
                불러오기
              </button>
            </div>
          )}
          <div className="mb-3 flex items-center gap-[6px]">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800">
              <Image alt="recent-task-icon" width="16" height="16" src="/goal-flag.svg" />
            </div>
            <h1
              onClick={() => router.push(`/dashboard/goal/${todo?.goal.id}`)}
              className="cursor-pointer font-medium hover:underline"
            >
              {todo?.goal.title}
            </h1>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <h2 className="rounded-[4px] bg-slate-100 px-[3px] py-[2px] text-xs">{todo?.done ? "Done" : "To do"}</h2>
            <h2 className="text-sm">{todo?.title}</h2>
          </div>
          <div className="relative">
            <input
              placeholder="노트의 제목을 입력해주세요"
              className="mb-3 w-full border-y py-3 text-lg focus:outline-none"
              type="text"
              value={title}
              onChange={handleTitleChange}
            />
            <p className="absolute right-0 top-3 rounded-[4px] px-1 py-[2px] text-xs font-medium text-slate-800">
              {title.length}/<span className="text-blue-500">30</span>
            </p>
          </div>
          <h4 className="text-sx mb-2 font-medium">{`공백 포함 : 총 ${
            content.length
          }자 | 공백 제외 : 총 ${content.replace(/\s+/g, "").length}자`}</h4>

          {link ? (
            <div className="mb-4 mt-3 flex w-full justify-between rounded-[20px] bg-slate-200 px-[6px] py-1">
              <div className="flex items-center gap-2">
                <Image src="/note-embed.svg" width={24} height={24} alt="embed-icon" />
                <p className="cursor-pointer hover:underline" onClick={() => {}}>
                  {link}
                </p>
              </div>
              <Image
                className="cursor-pointer"
                src="/note-delete.svg"
                width={18}
                height={18}
                alt="delete-icon"
                onClick={() => {
                  setLink("");
                }}
              />
            </div>
          ) : (
            <div className="mb-4 mt-3 flex gap-2 px-[6px] py-1">
              <Image alt="link-icon" width="24" height="24" src="/button-link.webp" />
              <span onClick={() => openModal("UPLOAD_LINK")} className="cursor-pointer hover:underline">
                링크첨부
              </span>
            </div>
          )}

          <textarea
            placeholder="이 곳을 클릭해 노트 작성을 시작해주세요"
            className="h-[500px] w-full overflow-y-auto p-5 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </form>
      <Modal name="UPLOAD_LINK" title="링크 업로드">
        <UploadLinkModal closeUploadLink={closeModal} link={link} setLink={setLink} />
      </Modal>
    </div>
  );
}
