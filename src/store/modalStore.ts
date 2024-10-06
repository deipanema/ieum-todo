"use client";

import { create } from "zustand";

type ModalType = "parent" | "child";

interface ModalState {
  isOpen: Record<ModalType, boolean>;
  openModal: (type: ModalType) => void;
  closeModal: (type: ModalType) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: { parent: false, child: false },
  openModal: (type) => set((state) => ({ isOpen: { ...state.isOpen, [type]: true } })),
  closeModal: (type) => set((state) => ({ isOpen: { ...state.isOpen, [type]: false } })),
}));
