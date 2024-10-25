"use client";

import { IoCloseOutline } from "react-icons/io5";
import React, { ReactNode, useCallback, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  name: string;
  title: string;
  children: ReactNode;
};

export default function useModal() {
  const [custom, setCustom] = useState("");

  const openModal = (name: string) => {
    setCustom(name);
  };

  const closeModal = () => {
    setCustom("");
  };

  const Modal = ({ name, children, title }: ModalProps) => {
    if (typeof document === "undefined") return null;

    return createPortal(
      name === custom ? (
        <div
          className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative h-auto w-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <IoCloseOutline className="h-6 w-6" />
              </button>
            </div>

            <div className="my-4 h-[1px] w-full bg-gray-200" />

            <div className="mt-4">{children}</div>
          </div>
        </div>
      ) : null,
      document.body,
    );
  };

  return { Modal, openModal, closeModal };
}
