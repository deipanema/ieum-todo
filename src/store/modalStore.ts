import { create } from "zustand";

interface ModalData {
  parentData?: string;
  childData?: string;
}

interface ModalStore {
  isParentOpen: boolean;
  isChildOpen: boolean;
  modalData: ModalData;
  openParentModal: () => void;
  closeParentModal: () => void;
  openChildModal?: () => void;
  closeChildModal: () => void;
  setModalData: (data: Partial<ModalData>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isParentOpen: false,
  isChildOpen: false,
  modalData: {},
  openParentModal: () => set({ isParentOpen: true }),
  closeParentModal: () => set({ isParentOpen: false, isChildOpen: false, modalData: {} }),
  openChildModal: () => set({ isChildOpen: true }),
  closeChildModal: () => set({ isChildOpen: false }),
  setModalData: (data) => set((state) => ({ modalData: { ...state.modalData, ...data } })),
}));
