"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import useModal from "@/hooks/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";
import { getNotes } from "@/api/noteAPI";
import { deleteTodo, toggleTodo } from "@/api/todoAPI";
import { useTodoStore } from "@/store/todoStore";
import { NoteType, TodoType } from "@/type";

import NoteViewer from "./NoteViewer";

type TodoProps = {
  todo: TodoType;
  isTodoCardRelated?: boolean;
  inTodoCard?: boolean;
};

export default function TodoItem({ todo, isTodoCardRelated = true, inTodoCard }: TodoProps) {
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState<NoteType>();
  const { updateTodos } = useTodoStore();

  const loadNoteContent = async () => {
    if (todo.noteId) {
      const response = await getNotes(todo.noteId);
      if (response) {
        setNoteContent(response);
      }
    }
  };

  // 할 일 상태 토글
  const toggleTodoStatus = async (todo: TodoType) => {
    const updatedTodo = { ...todo, done: !todo.done };
    const response = await toggleTodo(todo.id, updatedTodo);

    if (response) updateTodos();
  };

  const handleDeleteTodo = async () => {
    await deleteTodo(todo.id);
    updateTodos();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    loadNoteContent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ul
        key={todo.id}
        className={`group relative rounded-2xl ${isTodoCardRelated ? "hover:font-semibold" : "hover:underline"} `}
      >
        <li className="flex items-center gap-2">
          <Image
            className={`cursor-pointer ${todo.done ? "ml-1 mr-[2px]" : ""}`}
            src={todo.done ? "/checkbox-checked.svg" : "/checkbox-unchecked.svg"}
            width={todo.done === true ? 18 : 24}
            height={todo.done === true ? 18 : 24}
            alt="checkbox-icon"
            onClick={() => {
              toggleTodoStatus(todo);
            }}
          />
          <span className={`text-sm ${todo.done ? "line-through" : ""}truncate`}>{todo.title}</span>
        </li>
        {isTodoCardRelated && (
          <div className="flex items-center gap-2">
            <Image className="ml-[35px]" src="/goal-summit.webp" width={24} height={24} alt="goal-summit-icon" />
            <p className="text-sm">{todo.goal?.title}</p>
          </div>
        )}

        <div
          className={`absolute ${inTodoCard && "rounded-3xl bg-blue-50"} ${
            isTodoCardRelated ? "top-[25%]" : "top-0"
          } right-1 flex gap-1`}
        >
          {todo.fileUrl && (
            <a href={todo.fileUrl.includes("https://") ? todo.fileUrl : `https://${todo.fileUrl}`}>
              <Image
                className="cursor-pointer"
                src="/todo-file.webp"
                width={24}
                height={24}
                alt="첨부 파일"
                title="첨부 파일"
              />
            </a>
          )}
          {todo.linkUrl && (
            <a href={todo.linkUrl.includes("https://") ? todo.linkUrl : `https://${todo.linkUrl}`} target="_blank">
              <Image
                className="cursor-pointer"
                src="/todo-link.webp"
                width={24}
                height={24}
                alt="첨부 링크"
                title="첨부 링크"
              />
            </a>
          )}
          <Image
            className="cursor-pointer"
            src="/todo-write.svg"
            width={24}
            height={24}
            alt="노트 작성/수정"
            title="노트 작성/수정"
            onClick={() => router.push(`/dashboard/note/${todo.id}?goalId=${todo.goal.id}`)}
          />
          {todo.noteId && (
            <Image
              className="cursor-pointer"
              src="/todo-note.svg"
              width={24}
              height={24}
              alt="노트 보기"
              title="노트 보기"
              onClick={() => setIsNoteOpen((prev) => !prev)}
            />
          )}
          <Image
            className="cursor-pointer"
            src="/todo-kebab.svg"
            width={24}
            height={24}
            alt="수정/삭제"
            title="수정 / 삭제"
            onClick={() => {
              setDropdownOpen((prev) => !prev);
            }}
          />

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-3 top-7 z-10 w-24 cursor-pointer rounded-lg border bg-white text-center shadow-xl"
            >
              <p
                className="cursor-pointer p-3 hover:bg-slate-200"
                onClick={() => {
                  openModal("EDIT_TODO");
                  if (isDropdownOpen) setDropdownOpen(false);
                }}
              >
                수정하기
              </p>
              <p className="cursor-pointer p-3 hover:bg-slate-200" onClick={handleDeleteTodo}>
                삭제하기
              </p>
            </div>
          )}
        </div>
      </ul>
      <Modal name="EDIT_TODO" title="할 일 수정">
        <CreateNewTodo closeCreateNewTodo={closeModal} todo={todo} selectedGoalId={todo.goal?.id} isEditing={true} />
      </Modal>
      <NoteViewer isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} noteContent={noteContent} />
    </div>
  );
}
