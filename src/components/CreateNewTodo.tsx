import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import { useTodoStore } from "@/store/todoStore";
import { createTodo, postFile, updateTodo } from "@/api/todoAPI";
import useModal from "@/hooks/useModal";
import { getGoals } from "@/api/goalAPI";
import { GoalType, InitialTodoType, TodoType } from "@/type";

import LinkUpload from "./LinkUpload";

type CreateNewTodoProps = {
  closeCreateNewTodo: () => void;
  todo?: TodoType | undefined;
  isEditing?: boolean;
  goals?: GoalType[];
  selectedGoalId?: number;
};

export default function CreateNewTodo({ closeCreateNewTodo, todo, isEditing, selectedGoalId }: CreateNewTodoProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateTodos } = useTodoStore();
  const { Modal, openModal, closeModal } = useModal();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isGoalListOpen, setIsGoalListOpen] = useState(false);
  const [goalList, setGoalList] = useState<GoalType[]>([]);
  const [goalId, setGoalId] = useState<number>(selectedGoalId ?? todo?.goal?.id ?? 0);
  const [initialTodo, setInitialTodo] = useState<InitialTodoType>({
    title: todo?.title || "",
    linkUrl: todo?.linkUrl || "",
    goalId: selectedGoalId || todo?.goal?.id || 0,
  });

  const fetchGoalList = async () => {
    const response = await getGoals();
    if (response) {
      setGoalList(response.goals);
    }
  };

  const handleFileUpload = async () => {
    const MAX_FILE_SIZE = 3 * 1024 * 1024;
    const file = fileInputRef.current?.files?.[0];

    try {
      if (file && file.size < MAX_FILE_SIZE) {
        const uploadResponse = await postFile(file);
        setFileUrl(uploadResponse.url);
        setFileUploaded(true);
        setFileName(file.name);
      } else {
        toast.error("파일은 3MB 이하만 업로드 가능합니다.");
      }
    } catch (error) {
      console.log(error);
      setFileUploaded(false);
      toast.error("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todoPayload = {
      title: initialTodo.title,
      goalId: goalId,
      fileUrl: fileUrl || null,
      linkUrl: initialTodo.linkUrl || null,
    };

    try {
      if (isEditing) {
        await updateTodo(todo?.id as number, todoPayload); // 업데이트할 경우
        toast.success("할 일이 수정되었습니다.");
      } else {
        await createTodo(
          todoPayload.title,
          todoPayload.goalId,
          todoPayload.fileUrl ?? undefined,
          todoPayload.linkUrl ?? undefined,
        ); // 새로 생성할 경우
        toast.success("할 일이 생성되었습니다.");
      }
      updateTodos();
      closeCreateNewTodo(); // 모달 닫기
    } catch (error) {
      console.error(error);
      toast.error("작업을 처리하는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchGoalList();
  }, []);

  useEffect(() => {
    if (todo) {
      setInitialTodo({
        title: todo.title || "",
        linkUrl: todo.linkUrl || "",
        goalId: todo.goal?.id || 0,
      });

      if (todo.fileUrl) {
        setFileUrl(todo.fileUrl);
        setFileUploaded(true);
      } else {
        setFileUrl("");
        setFileUploaded(false);
      }
    } else {
      setInitialTodo({
        title: "",
        linkUrl: "",
        goalId: selectedGoalId || 0,
      });
      setFileUrl("");
      setFileUploaded(false);
    }
  }, [todo, selectedGoalId]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todo]);

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
            value={initialTodo?.title}
            onChange={(e) => setInitialTodo({ ...initialTodo, title: e.target.value })}
            autoFocus
            required
          />
        </div>

        <div>
          <h2 className="mb-3 font-semibold">자료</h2>
          <div className="mb-3 flex gap-3">
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                fileUploaded ? "bg-black text-white" : "bg-slate-100 text-black"
              }`}
              style={{ pointerEvents: "none" }}
              onClick={() => setFileUploaded(!fileUploaded)}
            >
              <Image
                src={fileUploaded ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={18}
                height={18}
                alt="checkbox-icon"
              />
              <span>파일 업로드</span>
            </div>
            <div
              className={`flex w-fit cursor-pointer gap-[7px] rounded-md border p-2 ${
                initialTodo?.linkUrl ? "bg-black text-white" : "bg-slate-100 text-black"
              }`}
              onClick={() => openModal("LINK_ATTACHMENT")} // 링크 첨부 모달 열기
            >
              <Image
                src={initialTodo?.linkUrl ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={18}
                height={18}
                alt="checkbox-icon"
              />
              <span>링크 첨부</span>
            </div>
          </div>

          <div className="flex h-[184px] w-full cursor-pointer items-center justify-center rounded-xl bg-slate-50">
            <div className="text-center text-slate-400">
              {fileName ? (
                <p>{fileName}</p>
              ) : (
                <div className="hover:underline" onClick={() => fileInputRef.current?.click()}>
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
                onChange={handleFileUpload}
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
            onClick={() => setIsGoalListOpen((prev) => !prev)}
            className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3"
          >
            <p className={`${goalId ? "text-black" : "text-slate-400"}`}>
              {goalId ? goalList.find((goal) => goal.id === goalId)?.title : "목표를 선택해주세요"}
            </p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>

          {isGoalListOpen && (
            <div className="absolute z-50 max-h-[200px] w-full select-none overflow-y-scroll rounded-xl bg-white px-[20px] py-3">
              <ul>
                {goalList?.length > 0 ? (
                  goalList.map((goal) => (
                    <li
                      key={goal.id}
                      className="cursor-pointer p-3 hover:bg-blue-100"
                      onClick={() => {
                        setGoalId(goal.id);
                        setInitialTodo({ ...initialTodo, goalId: goal.id });
                        setIsGoalListOpen(false);
                      }}
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
          disabled={initialTodo.title === "" || goalId === 0}
        >
          {isEditing ? "수정" : "생성"}하기
        </button>
      </form>

      {/* 링크 첨부 모달 */}
      <Modal name="LINK_ATTACHMENT" title="링크 업로드">
        <LinkUpload closeSecond={closeModal} todo={initialTodo} setTodo={setInitialTodo} />
      </Modal>
    </>
  );
}
