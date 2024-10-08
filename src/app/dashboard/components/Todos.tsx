"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { deleteTodos, patchTodo } from "@/api/todoAPI";

import { TodoType } from "./TodoCard";

type TodoProps = {
  todo: TodoType;
  isGoal?: boolean;
  isInGoalSection?: boolean;
};

// type TodoUpdateData = {
//   title: string;
//   goalId: number;
//   attachmentUrl: string;
//   externalLink: string;
//   isCompleted: boolean;
//   todoId: number;
// };

export default function Todos({ todo, isGoal = true, isInGoalSection }: TodoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleTodoStatus = async (
    title: string,
    goalId: number,
    fileUrl: string,
    linkUrl: string,
    done: boolean,
    todoId: number,
  ) => {
    try {
      const updatedTodo = await patchTodo(title, goalId, fileUrl, linkUrl, !done, todoId);

      if (updatedTodo) {
        //refreshTodo(); // 할 일 목록 새로고침
      }
    } catch (error) {
      console.error("할 일 상태 변경 중 오류 발생:", error);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    // console.log(goal);
    try {
      const response = await deleteTodos(todo.id as number);
      return response;
    } catch (error) {
      console.error("목표 삭제 중 오류 발생:", error);
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // 드롭다운 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ul key={todo.id} className={`group relative rounded-2xl ${isGoal ? "hover:border" : "hover:underline"} `}>
      <li className="flex items-center gap-2">
        <Image
          className={`cursor-pointer ${todo.done ? "ml-1 mr-[2px]" : ""}`}
          src={todo.done ? "/checkbox-checked.svg" : "/checkbox-unchecked.svg"}
          width={todo.done === true ? 18 : 24}
          height={todo.done === true ? 18 : 24}
          alt="checkbox-icon"
          onClick={() => toggleTodoStatus(todo.title, todo.goal.id, todo.fileUrl, todo.linkUrl, todo.done, todo.id)}
        />

        <span className={`text-sm ${todo.done ? "line-through" : ""}`}>{todo.title}</span>
      </li>
      {isGoal && (
        <div className="flex items-center gap-2">
          <Image className="ml-[35px]" src="/goal-summit.png" width={24} height={24} alt="goal-summit-icon" />
          <p className="text-sm">{todo.goal.title}</p>
        </div>
      )}

      <div
        className={`absolute ${isInGoalSection && "rounded-3xl bg-blue-50"} ${
          isGoal ? "top-[25%]" : "top-0"
        } right-1 flex gap-[4px]`}
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
        />
        {todo.noteId && (
          <Image
            className="cursor-pointer"
            src="/todo-note.svg"
            width={24}
            height={24}
            alt="노트 보기"
            title="노트 보기"
          />
        )}
        <Image
          className=""
          src="/todo-kebab.svg"
          width={24}
          height={24}
          alt="수정/삭제"
          title="수정 / 삭제"
          onClick={handleToggleDropdown}
        />
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-3 top-9 z-10 w-24 cursor-pointer rounded-lg border bg-white text-center shadow-xl"
          >
            <p className="cursor-pointer p-3 hover:bg-slate-200">수정하기</p>
            <p onClick={handleDelete} className="cursor-pointer p-3 hover:bg-slate-200">
              삭제하기
            </p>
          </div>
        )}
      </div>
    </ul>
  );
}