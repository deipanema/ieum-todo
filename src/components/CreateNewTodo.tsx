"use client";

import { toast } from "react-toastify";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { createTodo, postFile } from "@/api/todoAPI";
import useModal from "@/hook/useModal";
import { useGoalStore } from "@/store/goalStore";
import useTodoStore from "@/store/todoStore";

import LinkUpload from "./LinkUpload";

export type TodoType = {
  noteId?: number | null;
  done: boolean;
  linkUrl?: string | null;
  fileUrl?: string | null;
  title: string;
  id: number;
  goal: GoalType;
  userId: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
};
export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type FileType = {
  url?: string | null;
};

export type CreateNewTodoProps = {
  closeCreateNewTodo: () => void;
  goal?: GoalType;
  title?: string;
  fileUrl?: string | undefined;
  linkUrl?: string | undefined;
  todoId?: number;
  done?: boolean;
  isEdit?: boolean;
  goalId?: number | undefined; // 목표 ID를 받아옴
};

export default function CreateNewTodo({
  closeCreateNewTodo,
  goal,
  title,
  fileUrl,
  linkUrl,
  todoId,
  isEdit,
  goalId, // 목표 ID를 받아옴
}: CreateNewTodoProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const { Modal, openModal, closeModal } = useModal();
  const { goals } = useGoalStore();
  const { updateTodo } = useTodoStore();

  const [todo, setTodo] = useState<TodoType>({
    title: "",
    fileUrl: null,
    linkUrl: null,
    goal: goal || {
      id: 0,
      teamId: "",
      title: "",
      userId: 0,
      createdAt: "",
      updatedAt: "",
    },
    done: false,
    noteId: null,
    id: 0,
    userId: 0,
    teamId: "",
    updatedAt: "",
    createdAt: "",
  });

  useEffect(() => {
    // 할 일 추가할 때 목표가 설정되어 있지 않으면 전역 상태에서 기본값 설정
    if (!goal && goals.length > 0) {
      const defaultGoal = goals.find((g) => g.id === goalId); // goalId와 일치하는 목표 찾기
      if (defaultGoal) {
        setTodo((prevTodo) => ({
          ...prevTodo,
          goal: defaultGoal, // 일치하는 목표가 있으면 todo에 설정
        }));
      }
    }
  }, [goal, goals, goalId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, title: e.target.value });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB 제한
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      toast.error("파일이 선택되지 않았습니다.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("파일은 3MB 이하만 업로드 가능합니다.");
      setIsFileUpload(false);
      return;
    }

    const response = await postFile(selectedFile);
    if (response) {
      setTodo((prevTodo) => ({
        ...prevTodo,
        fileUrl: response.url,
      }));
      setFileTitle(selectedFile.name);
      setIsFileUpload(true);
      toast.success("파일이 성공적으로 업로드되었습니다");
    } else {
      toast.error("파일 업로드 실패");
    }
  };

  const handleGoalSelect = (goalId: number, goalTitle: string) => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      goal: { ...prevTodo.goal, id: goalId, title: goalTitle },
    }));
    setIsOpenGoals(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todo) return;

    if (isEdit && todoId) {
      await updateTodo(todoId, { title: todo.title, fileUrl: todo.fileUrl, linkUrl: todo.linkUrl, id: todo.id });
    } else {
      await createTodo(todo.title, todo.fileUrl || null, todo.linkUrl || null, todo.goal.id);
    }

    toast.success(isEdit ? "할 일이 수정되었습니다" : "할 일이 생성되었습니다");
    closeCreateNewTodo();
  };

  useEffect(() => {
    console.log(isEdit, goal);

    if (isEdit && goal) {
      setTodo((prevTodo) => ({
        ...prevTodo,
        title: title || "",
        linkUrl: linkUrl || null,
        fileUrl: fileUrl || null,
        goal: goal,
      }));
    }

    if (fileUrl) {
      setIsFileUpload(true);
    }
  }, [isEdit, title, fileUrl, linkUrl, goal]);

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h2 className="mb-3 font-semibold">제목</h2>
          <label htmlFor="title" className="sr-only">
            할 일의 제목
          </label>
          <input
            id="title"
            name="title"
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="할 일의 제목을 적어주세요"
            maxLength={30}
            value={todo.title}
            onChange={handleTitleChange}
            autoFocus
          />
        </div>
        <div>
          <h2 className="mb-3 font-semibold">자료</h2>
          <div className="mb-3 flex gap-3">
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                !isFileUpload ? "bg-slate-100 text-black" : "bg-black text-white"
              }`}
            >
              <Image
                src={isFileUpload ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={isFileUpload ? 18 : 24}
                height={isFileUpload ? 18 : 24}
                alt="checkbox-icon"
              />
              <span>파일 업로드</span>
            </div>
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                !todo.linkUrl ? "bg-slate-100 text-black" : "bg-black text-white"
              }`}
              onClick={() => openModal("LINK_ATTACHMENT")}
            >
              <Image
                src={todo.linkUrl ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={todo.linkUrl ? 18 : 24}
                height={todo.linkUrl ? 18 : 24}
                alt="checkbox-icon"
              />
              <span>링크 첨부</span>
            </div>
          </div>
          <div className="flex h-[184px] w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center text-slate-400">
              {fileTitle ? (
                <p>{fileTitle}</p>
              ) : (
                <div
                  className="hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <p>+</p>
                  <p>파일을 업로드해주세요</p>
                </div>
              )}
              <label className="sr-only" htmlFor="file-upload">
                파일을 업로드해주세요
              </label>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="absolute opacity-0"
              />
            </div>
          </div>
        </div>

        {/* 목표 선택 UI */}
        <div className="relative">
          <h2 data-testid="modal-heading" className="mb-3 font-semibold">
            목표
          </h2>
          <div
            onClick={() => setIsOpenGoals((prev) => !prev)}
            className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3"
          >
            <p className={`${todo.goal.id ? "text-black" : "text-slate-400"}`}>
              {todo.goal.id ? todo.goal.title : "목표를 선택해주세요"}
            </p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>

          {isOpenGoals && (
            <div className="absolute z-50 max-h-[200px] w-full select-none overflow-y-scroll rounded-xl bg-white px-[20px] py-3">
              <ul>
                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <li
                      key={goal.id}
                      className="cursor-pointer p-3 hover:bg-blue-100"
                      onClick={() => handleGoalSelect(goal.id, goal.title)}
                    >
                      {goal.title}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-center text-gray-500">목표가 없습니다.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="mb-6 mt-4 flex h-[50px] w-full items-center justify-center rounded-xl border bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
          disabled={!todo.title.trim() || !todo.goal.id}
        >
          {isEdit ? "수정" : "확인"}
        </button>
      </form>
      <Modal name="LINK_ATTACHMENT" title="링크 업로드">
        <LinkUpload closeSecond={closeModal} todo={todo} setTodo={setTodo} />
      </Modal>
    </>
  );
}
