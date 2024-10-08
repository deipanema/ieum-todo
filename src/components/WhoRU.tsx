"use client";

import { IoCloseOutline } from "react-icons/io5";
import React, { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  type: "first" | "second";
};

export default function WhoRU({ children }: ModalProps) {
  const handleClose = () => {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-5" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6">
        {children}
        <button onClick={handleClose} className="absolute right-5 top-6 text-2xl text-slate-500 hover:text-slate-800">
          <IoCloseOutline />
        </button>
      </div>
    </div>
  );
}
