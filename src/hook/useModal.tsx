"use client";

import { IoCloseOutline } from "react-icons/io5";
import React, { ReactNode, useState } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  name: string;
  title: string;
  children: ReactNode;
};

export default function useModal() {
  const [custom, setCustom] = useState("");

  // 모달 열기 함수
  const openModal = (name: string) => {
    setCustom(name);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setCustom("");
  };

  const Modal = ({ name, title, children }: ModalProps) =>
    ReactDOM.createPortal(
      custom === name ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-5" onClick={closeModal}></div>
          <div
            className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
          >
            <h2 className="mb-6 text-[18px] font-semibold">{title}</h2>
            <IoCloseOutline
              className="absolute right-5 top-6 cursor-pointer text-2xl text-slate-500 hover:text-slate-800"
              onClick={closeModal} // 모달 닫기 버튼
            />
            {children}
          </div>
        </div>
      ) : null,
      document.body,
    );

  return { Modal, openModal, closeModal };
}
