import Image from "next/image";
import { useRouter } from "next/navigation";

import { TodosType } from "../goal/[id]/page";

type todoItem = {
  todo: TodosType;
  goal?: boolean;
};

export default function TodoItem({ todo, goal = true }: todoItem) {
  const router = useRouter();

  return (
    <div key={todo.id} className={`group relative rounded-2xl ${goal ? "hover:border" : "hover:underline"} `}>
      <li className="flex items-center gap-[8px]">
        <Image
          className={`cursor-pointer ${todo.done ? "ml-[4px] mr-[2px]" : ""}`}
          src={todo.done ? "/checkbox-checked.svg" : "/checkbox-unchecked.svg"}
          width={todo.done === true ? 18 : 24}
          height={todo.done === true ? 18 : 24}
          alt="checkbox-icon"
        />

        <span className={`text-[1.4rem] ${todo.done ? "line-through" : ""}`}>{todo.title}</span>
      </li>
      {goal && (
        <div className="flex items-center gap-[8px]">
          <Image className="ml-[35px]" src="/goal-summit.png" width={24} height={24} alt="goal-summit-icon" />
          <p className="text-[1.4rem]">{todo.goal.title}</p>
        </div>
      )}
      <div
        className={`rounded-3xl} absolute bg-[#EFF6FF] ${
          goal ? "top-[25%]" : "top-0"
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
    </div>
  );
}
