"use client";

import { useEffect, useRef } from "react";

import { useModalStore } from "@/store/modalSotre";

export default function Modal() {
  const { isOpen, content, closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div ref={modalRef} className="z-50 overflow-auto rounded-lg bg-white shadow-xl">
        {content}
      </div>
    </div>
  );
}
