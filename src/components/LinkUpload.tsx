"use client";

import { useModalStore } from "@/store/modalStore";

import { TodoType } from "./CreateNewTodo";
import Modal from "./Modal";

type LinkUploadProps = {
  setTodo: React.Dispatch<React.SetStateAction<TodoType>>;
};
export default function LinkUpload({ setTodo }: LinkUploadProps) {
  const { isChildOpen, closeChildModal, setModalData, modalData } = useModalStore();

  const handleConfirm = () => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      linkUrl: modalData.childData || prevTodo.linkUrl,
    }));
    closeChildModal();
  };

  if (!isChildOpen) return null;

  return (
    <>
      <Modal type="child">
        <h1 className="mb-6 text-lg font-semibold">링크 업로드</h1>
        <form onSubmit={(e) => e.preventDefault()} className="flex select-none flex-col gap-6">
          <div>
            <h2 className="mb-3 font-semibold">제목</h2>
            <input
              type="text"
              value={modalData.childData || ""}
              onChange={(e) => setModalData({ childData: e.target.value })}
              className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
              placeholder="영상이나 글, 파일의 링크를 넣어주세요"
            />
          </div>
          <div>
            <button
              onClick={handleConfirm}
              className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
              disabled={!modalData.childData}
            >
              확인
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
