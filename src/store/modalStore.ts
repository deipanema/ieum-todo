import { create } from "zustand";

interface ModalData {
  parentData?: string;
  childData?: string;
  currentGoalId?: number;
}

interface ModalStore {
  isParentOpen: boolean;
  isChildOpen: boolean;
  modalData: ModalData;
  openParentModal: (goalId?: number) => void;
  closeParentModal: () => void;
  openChildModal?: () => void;
  closeChildModal: () => void;
  setModalData: (data: Partial<ModalData>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isParentOpen: false,
  isChildOpen: false,
  modalData: {},
  openParentModal: (goalId?: number) =>
    set((state) => ({
      isParentOpen: true,
      modalData: { ...state.modalData, currentGoalId: goalId }, // goalId를 modalData에 저장
    })),
  closeParentModal: () => set({ isParentOpen: false, isChildOpen: false, modalData: {} }),
  openChildModal: () => set({ isChildOpen: true }),
  closeChildModal: () => set({ isChildOpen: false }),
  setModalData: (data) => set((state) => ({ modalData: { ...state.modalData, ...data } })),
}));
