export type InitialTodoType = {
  title?: string;
  fileUrl?: string | null;
  linkUrl?: string | null;
  goalId?: number;
};

export type TodoType = {
  noteId?: number | null;
  done: boolean;
  linkUrl?: string | null;
  fileUrl?: string | null;
  title: string;
  id: number;
  goal: GoalType;
  userId: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
};

export type GoalType = {
  id: number;
  teamId: string;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type NoteType = {
  content: string;
  createdAt: string;
  goal: {
    id: number;
    title: string;
  };
  id: number;
  linkUrl: string;
  teamId: string;
  title: string;
  todo: {
    done: boolean;
    fileUrl: string | null;
    id: number;
    linkUrl: string | null;
    title: string;
  };
  updatedAt: string;
  userId: number;
};
