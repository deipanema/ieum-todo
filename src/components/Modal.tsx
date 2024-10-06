"use client";

import { IoCloseOutline } from "react-icons/io5";
import React, { ReactNode } from "react";

import { useModalStore } from "@/store/modalStore";

type ModalProps = {
  children: ReactNode;
  type: "parent" | "child";
};

export default function Modal({ children, type }: ModalProps) {
  const { isOpen, closeModal } = useModalStore();

  if (!isOpen[type]) return null;

  const handleClose = () => {
    closeModal(type);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (type === "parent" && e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6">
        {children}
        <button onClick={handleClose} className="absolute right-5 top-6 text-2xl text-slate-500 hover:text-slate-800">
          <IoCloseOutline />
        </button>
      </div>
    </div>
  );
}
