import { create } from "zustand";

interface ModalData {
  firstData?: string;
  secondData?: string;
  currentGoalId?: number;
}

interface ModalStore {
  isFirstOpen: boolean;
  isSecondOpen: boolean;
  modalData: ModalData;
  openFirstModal: (goalId?: number) => void;
  closeFirstModal: () => void;
  openSecondModal?: () => void;
  closeSecondModal: () => void;
  setModalData: (data: Partial<ModalData>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isFirstOpen: false,
  isSecondOpen: false,
  modalData: {},
  openFirstModal: (goalId?: number) =>
    set((state) => ({
      isFirstOpen: true,
      modalData: { ...state.modalData, currentGoalId: goalId }, // goalId를 modalData에 저장
    })),
  closeFirstModal: () => set({ isFirstOpen: false, isSecondOpen: false, modalData: {} }),
  openSecondModal: () => set({ isSecondOpen: true }),
  closeSecondModal: () => set({ isSecondOpen: false }),
  setModalData: (data) => set((state) => ({ modalData: { ...state.modalData, ...data } })),
}));
