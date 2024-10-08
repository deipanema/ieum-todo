import { useModalStore } from "@/store/modalStore";

export default function AddTodo() {
  const { openParentModal } = useModalStore();

  console.log("🚟");

  return (
    <button className="cursor-pointer text-blue-500" onClick={openParentModal}>
      <span className="text-sm">+ 할일 추가</span>
    </button>
  );
}
