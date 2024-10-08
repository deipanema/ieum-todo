import { useModalStore } from "@/store/modalStore";

type AddTodoProps = {
  goalId?: number;
};

export default function AddTodo({ goalId }: AddTodoProps) {
  const { openParentModal } = useModalStore();

  const handleAddTodo = () => {
    openParentModal(goalId);
  };

  return (
    <button className="cursor-pointer text-blue-500" onClick={handleAddTodo}>
      <span className="text-sm">+ 할일 추가</span>
    </button>
  );
}
