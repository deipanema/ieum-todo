"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import useModal from "@/hook/useModal";
import CreateNewTodo from "@/components/CreateNewTodo";
import { getNotes } from "@/api/noteAPI";
import useTodoStore, { TodoType } from "@/store/todoStore";
import { deleteTodo } from "@/api/todoAPI";

import NoteViewer from "./NoteViewer";

export type GoalType = {
  updatedAt: string;
  createdAt: string;
  title: string;
  id: number;
  userId: number;
  teamId: string;
};

type TodoProps = {
  todo: TodoType;
  isGoal?: boolean;
  isInGoalSection?: boolean;
};

// type toggleTodoStatusType = {
//   title: string;
//   goalId: number;
//   fileUrl: string;
//   linkUrl: string;
//   done: boolean;
//   todoId: number;
// };

export interface NoteType {
  content: string;
  createdAt: string;
  goal: {
    id: number;
    title: string;
  };
  id: number;
  linkUrl: string;
  teamId: string;
  title: string;
  todo: {
    done: boolean;
    fileUrl: string | null;
    id: number;
    linkUrl: string | null;
    title: string;
  };
  updatedAt: string;
  userId: number;
}

export default function Todos({ todo, isGoal = false, isInGoalSection = false }: TodoProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { Modal, openModal, closeModal } = useModal();
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState<NoteType>();
  const { updateTodo } = useTodoStore();

  const toggleTodoStatus = async (updatedTodo: TodoType) => {
    try {
      updateTodo(todo.id, updatedTodo);
    } catch (error) {
      console.error("할 일 상태 변경 중 오류 발생:", error);
    }
  };

  const fetchNoteContent = async () => {
    if (todo.noteId) {
      const response = await getNotes(todo.noteId);
      if (response) {
        setNoteContent(response);
      }
    }
  };

  // const handleTodoUpdate = (updatedTodo: TodoType) => {
  //   setTodos((prevTodos) =>
  //     prevTodos.map((prevTodo) => (prevTodo.id === updatedTodo.id ? { ...prevTodo, ...updatedTodo } : prevTodo)),
  //   );
  // };

  const handleDelete = async () => {
    await deleteTodo(todo.id); // Use deleteTodo from store
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    fetchNoteContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ul key={todo.id} className={`group relative rounded-2xl ${isGoal ? "hover:font-semibold" : "hover:underline"} `}>
        <li className="flex items-center gap-2">
          <Image
            className={`cursor-pointer ${todo.done ? "ml-1 mr-[2px]" : ""}`}
            src={todo.done ? "/checkbox-checked.svg" : "/checkbox-unchecked.svg"}
            width={todo.done === true ? 18 : 24}
            height={todo.done === true ? 18 : 24}
            alt="checkbox-icon"
            onClick={() => toggleTodoStatus({ ...todo, done: !todo.done })}
          />

          <span className={`text-sm ${todo.done ? "line-through" : ""}`}>{todo.title}</span>
        </li>
        {isGoal && (
          <div className="flex items-center gap-2">
            <Image className="ml-[35px]" src="/goal-summit.webp" width={24} height={24} alt="goal-summit-icon" />
            <p className="text-sm">{todo.goal?.title}</p>
          </div>
        )}

        <div
          className={`absolute ${isInGoalSection && "rounded-3xl bg-blue-50"} ${
            isGoal ? "top-[25%]" : "top-0"
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
              setIsOpen((prev) => !prev);
            }}
          />

          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-3 top-7 z-10 w-24 cursor-pointer rounded-lg border bg-white text-center shadow-xl"
            >
              <p
                className="cursor-pointer p-3 hover:bg-slate-200"
                onClick={() => {
                  openModal("EDIT_TODO");
                  if (isOpen) setIsOpen(false);
                }}
              >
                수정하기
              </p>
              <p onClick={handleDelete} className="cursor-pointer p-3 hover:bg-slate-200">
                삭제하기
              </p>
            </div>
          )}
        </div>
      </ul>
      <Modal name="EDIT_TODO" title="할 일 수정">
        <CreateNewTodo
          closeCreateNewTodo={closeModal}
          goal={todo.goal}
          title={todo.title}
          fileUrl={todo.fileUrl || undefined}
          linkUrl={todo.linkUrl || undefined}
          todoId={todo.id}
          isEdit
        />
      </Modal>
      <NoteViewer isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} noteContent={noteContent} />
    </div>
  );
}
