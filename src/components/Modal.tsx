"use client";

import { IoCloseOutline } from "react-icons/io5";
import React, { ReactNode } from "react";

import { useModalStore } from "@/store/modalStore";

type ModalProps = {
  children: ReactNode;
  type: "parent" | "child";
  onConfirm?: (data: string) => void; // New prop for confirmation in child modal
};

export default function Modal({ children, type, onConfirm }: ModalProps) {
  const { isOpen, closeModal } = useModalStore();

  if (!isOpen[type]) return null;

  const handleClose = () => {
    closeModal(type);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm("Your data here"); // You can customize this value as per your need
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6">
        {children}
        {type === "child" && (
          <button
            onClick={handleConfirm}
            className="w-full rounded-xl bg-blue-400 py-3 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
          >
            확인
          </button>
        )}
        <button onClick={handleClose} className="absolute right-5 top-6 text-2xl text-slate-500 hover:text-slate-800">
          <IoCloseOutline />
        </button>
      </div>
    </div>
  );
}
