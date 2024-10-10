import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { getGoals } from "@/api/goalAPI";
import { patchTodo, postFile, PostTodos } from "@/api/todoAPI";
import LinkUpload from "@/components/LinkUpload";
import useModal from "@/hook/useModal";

export type TodoType = {
  noteId: number | null;
  done: boolean; // 이 줄이 포함되어야 합니다.
  linkUrl: string | null;
  fileUrl: string | null;
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
  url?: string;
};

export type EditTodoProps = {
  closeEditTodo: () => void;
  goalsId?: number;
  title?: string;
  todoId: number;
  fileUrl?: string;
  linkUrl?: string;
  goalId?: number;
  done?: boolean;
};

export default function EditTodo({ closeEditTodo, goalsId, title, fileUrl, linkUrl, todoId, done }: EditTodoProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpenGoals, setIsOpenGoals] = useState(false);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const { Modal, openModal, closeModal } = useModal();
  const [newTodo, setNewTodo] = useState<TodoType>({ title: "", fileUrl: "", linkUrl: "", goalId: 0, done: false });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo((prevTodo) => ({ ...prevTodo, title: e.target.value }));
  };

  const fetchGoals = async () => {
    const goalsData = await getGoals();

    if (goalsData) {
      setGoals(goalsData.goals);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB 제한
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      console.error("파일이 선택되지 않았습니다.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      console.error("파일은 3MB 이하만 업로드 가능합니다.");
      setIsFileUpload(false);
      return;
    }

    const response = await postFile(selectedFile);
    if (response) {
      setNewTodo((prevNewTodo) => ({ ...prevNewTodo, fileUrl: response.url }));
      setFileTitle(selectedFile.name);
      setIsFileUpload(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await patchTodo(
        newTodo.title || "",
        newTodo.goalId || 0,
        todoId.toString(),
        newTodo.fileUrl || undefined,
        newTodo.linkUrl || undefined,
        newTodo.done,
      );

      if (response) {
        console.log("할 일이 성공적으로 생성되었습니다:", response);
      }
      closeEditTodo();
    } catch (error) {
      console.error("할 일 생성 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (title) setNewTodo((prevTodo) => ({ ...prevTodo, title }));
    if (fileUrl) {
      setFileTitle(fileUrl);
      setIsFileUpload(true);
    }
    if (linkUrl) setNewTodo((prevTodo) => ({ ...prevTodo, linkUrl }));
  }, [title, fileUrl, linkUrl]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mb-3 font-semibold">제목</h2>
          <input
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="할 일의 제목을 적어주세요"
            maxLength={30}
            value={newTodo.title}
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
                !newTodo.linkUrl ? "bg-slate-100 text-black" : "bg-black text-white"
              }`}
              onClick={() => openModal("LINK_ATTACHMENT")}
            >
              <Image
                src={newTodo.linkUrl ? "/modal-checked.svg" : "/modal-unchecked.svg"}
                width={newTodo.linkUrl ? 18 : 24}
                height={newTodo.linkUrl ? 18 : 24}
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
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="absolute opacity-0" />
            </div>
          </div>
        </div>
        <div className="relative">
          <h2 className="mb-3 font-semibold">목표</h2>
          <div
            onClick={() => setIsOpenGoals((prev) => !prev)}
            className="flex w-full cursor-pointer justify-between rounded-xl bg-slate-50 px-[20px] py-3"
          >
            <p className={`${newTodo.goalId ? "text-black" : "text-slate-400"}`}>
              {newTodo.goalId ? goals.find((goal) => goal.id === newTodo.goalId)?.title : "목표를 선택해주세요"}
            </p>
            <Image alt="arrowdown-icon" width={24} height={24} src="/modal-arrowdown.svg" />
          </div>

          {isOpenGoals && (
            <div className="absolute z-50 max-h-[200px] w-full select-none overflow-y-scroll rounded-xl bg-white px-[20px] py-3">
              <ul>
                {goals.map((goal) => (
                  <li key={goal.id} className="cursor-pointer rounded-lg p-3 hover:bg-blue-100">
                    {goal.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={handleConfirm}
          className="mb-6 mt-4 flex h-[50px] w-full items-center justify-center rounded-xl border bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
          disabled={!newTodo?.title?.trim() || !newTodo.goalId}
        >
          확인
        </button>
      </div>
      <Modal name="LINK_ATTACHMENT" title="링크 업로드">
        <LinkUpload closeSecond={closeModal} todo={newTodo} setTodo={setNewTodo} />
      </Modal>
    </>
  );
}
