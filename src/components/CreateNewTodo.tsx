import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import { createTodo, postFile, updateTodo } from "@/api/todoAPI";
import useModal from "@/hook/useModal";
import { GoalType, InitialTodoType, TodoType } from "@/app/Types/TodoGoalType";
import { getGoals } from "@/api/goalAPI";

import LinkUpload from "./LinkUpload";

type CreateNewTodoProps = {
  closeCreateNewTodo: () => void;
  todo?: TodoType | undefined;
  isEditing?: boolean;
  goals?: GoalType[];
  selectedGoalId?: number;
};

export default function CreateNewTodo({ closeCreateNewTodo, todo, isEditing, selectedGoalId }: CreateNewTodoProps) {
  console.log(selectedGoalId);
  const titleRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { Modal, openModal, closeModal } = useModal();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isGoalListOpen, setIsGoalListOpen] = useState(false);
  const [goalList, setGoalList] = useState<GoalType[]>([]);
  const [goalTitle, setGoalTitle] = useState<number | null>(selectedGoalId as number);
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

    // 모달이 확인으로 닫히는 이벤트를 받아서
    // 할 일 목록이 변경됐으니
    // 1. 서버에서 새로받기
    // 2. 할일목록 수정 또는 추가를 클라이언트 쪽에서 콜백 데이터를 넘겨받아 새로업데이트
    const todoPayload = {
      title: initialTodo.title,
      goalId: selectedGoalId || initialTodo.goalId,
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
      //updateTodos();  // 상태 업데이트
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
      // 데이터를 먼저 초기화
      setInitialTodo({
        title: todo.title || "",
        linkUrl: todo.linkUrl || "",
        goalId: todo.goal?.id || 0,
      });

      // 파일 URL 처리
      if (todo.fileUrl) {
        setFileUrl(todo.fileUrl);
        setFileUploaded(true);
      } else {
        setFileUrl(""); // 파일 URL이 없을 경우 빈 값 처리
        setFileUploaded(false);
      }
    } else {
      // todo가 없을 때 초기화
      setInitialTodo({
        title: "",
        linkUrl: "",
        goalId: 0,
      });
      setFileUrl(""); // 파일 URL 초기화
      setFileUploaded(false); // 파일 업로드 상태 초기화
    }
  }, [todo]);

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
            <p className={`${initialTodo.goalId || selectedGoalId ? "text-black" : "text-slate-400"}`}>
              {initialTodo.goalId || selectedGoalId
                ? goalList.find((goal) => goal.id === initialTodo.goalId || selectedGoalId)?.title
                : "목표를 선택해주세요"}
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
                        console.log(`목표 선택: ${selectedGoalId}`); // 디버깅 로그 추가
                        console.log(`목표 선택: ${goal.id}`); // 디버깅 로그 추가
                        console.log(`목표 선택: ${goal.title}`); // 디버깅 로그 추가
                        setGoalTitle(goal.id);
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
          disabled={initialTodo.title === "" || goalTitle === null}
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
