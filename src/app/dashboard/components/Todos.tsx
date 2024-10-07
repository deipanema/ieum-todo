import Image from "next/image";
import { useRouter } from "next/navigation";

import { patchTodo } from "@/api/todoAPI";

import { TodoType } from "./TodoCard";

type TodoProps = {
  todo: TodoType;
  isGoal?: boolean;
  isInGoalSection?: boolean;
};

// type TodoUpdateData = {
//   title: string;
//   goalId: number;
//   attachmentUrl: string;
//   externalLink: string;
//   isCompleted: boolean;
//   todoId: number;
// };

export default function Todos({ todo, isGoal = true, isInGoalSection }: TodoProps) {
  const router = useRouter();

  const toggleTodoStatus = async (
    title: string,
    goalId: number,
    fileUrl: string,
    linkUrl: string,
    done: boolean,
    todoId: number,
  ) => {
    try {
      const updatedTodo = await patchTodo(title, goalId, fileUrl, linkUrl, !done, todoId);

      if (updatedTodo) {
        //refreshTodo(); // 할 일 목록 새로고침
      }
    } catch (error) {
      console.error("할 일 상태 변경 중 오류 발생:", error);
    }
  };

  return (
    <ul key={todo.id} className={`group relative rounded-2xl ${isGoal ? "hover:border" : "hover:underline"} `}>
      <li className="flex items-center gap-2">
        <Image
          className={`cursor-pointer ${todo.done ? "ml-1 mr-[2px]" : ""}`}
          src={todo.done ? "/checkbox-checked.svg" : "/checkbox-unchecked.svg"}
          width={todo.done === true ? 18 : 24}
          height={todo.done === true ? 18 : 24}
          alt="checkbox-icon"
          onClick={() => toggleTodoStatus(todo.title, todo.goal.id, todo.fileUrl, todo.linkUrl, todo.done, todo.id)}
        />

        <span className={`text-sm ${todo.done ? "line-through" : ""}`}>{todo.title}</span>
      </li>
      {isGoal && (
        <div className="flex items-center gap-2">
          <Image className="ml-[35px]" src="/goal-summit.png" width={24} height={24} alt="goal-summit-icon" />
          <p className="text-sm">{todo.goal.title}</p>
        </div>
      )}

      <div
        className={`absolute ${isInGoalSection && "rounded-3xl bg-blue-50"} ${
          isGoal ? "top-[25%]" : "top-0"
        } right-1 hidden gap-[4px] group-hover:flex`}
      >
        {todo.fileUrl && (
          <a href={todo.fileUrl.includes("https://") ? todo.fileUrl : `https://${todo.fileUrl}`}>
            <Image
              className="cursor-pointer"
              src="/todo-file.png"
              width={24}
              height={24}
              alt="kebab-icon"
              title="첨부 파일"
            />
          </a>
        )}
        {todo.linkUrl && (
          <a href={todo.linkUrl.includes("https://") ? todo.linkUrl : `https://${todo.linkUrl}`} target="_blank">
            <Image
              className="cursor-pointer"
              src="/todo-link.png"
              width={24}
              height={24}
              alt="kebab-icon"
              title="첨부 링크"
            />
          </a>
        )}
        <Image
          className="cursor-pointer"
          src="/todo-write.svg"
          width={24}
          height={24}
          alt="kebab-icon"
          title="노트 작성/수정"
          onClick={() => router.push(`/dashboard/note/${todo.id}?goalId=${todo.goal.id}`)}
        />
        {todo.noteId && (
          <Image
            className="cursor-pointer"
            src="/todo-note.svg"
            width={24}
            height={24}
            alt="kebab-icon"
            title="노트 보기"
          />
        )}
        <Image
          className="cursor-pointer"
          src="/todo-kebab.svg"
          width={24}
          height={24}
          alt="kebab-icon"
          title="수정 / 삭제"
        />
      </div>
    </ul>
  );
}
