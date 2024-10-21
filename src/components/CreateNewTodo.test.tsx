// import { vi } from "vitest";
// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { toast } from "react-toastify";

// import { editTodo, postFile, postTodos } from "@/api/todoAPI";
// import { getGoal } from "@/api/goalAPI";

// import CreateNewTodo from "./CreateNewTodo";

// // next/navigation module 모킹
// vi.mock("next/navigation", () => ({
//   usePathname: vi.fn(() => "/goals/1"),
// }));

// // API 모킹
// vi.mock("@/api/goalAPI", () => ({
//   getGoal: vi.fn(),
// }));

// vi.mock("@/api/todoAPI", () => ({
//   editTodo: vi.fn(),
//   postFile: vi.fn(),
//   postTodos: vi.fn(),
// }));

// // react-toastify 모킹
// vi.mock("react-toastify", () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// describe("CreateNewTodo", () => {
//   const mockCloseCreateNewTodo = vi.fn();
//   const mockOnUpdate = vi.fn();

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("렌더링", () => {
//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);
//     expect(screen.getByLabelText("할 일의 제목")).toBeInTheDocument();
//     expect(screen.getByText("파일 업로드")).toBeInTheDocument();
//     expect(screen.getByText("링크 첨부")).toBeInTheDocument();
//     expect(screen.getByText("목표를 선택해주세요")).toBeInTheDocument();
//   });

//   it("제목 입력 하기", async () => {
//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);
//     const titleInput = screen.getByLabelText("할 일의 제목");
//     await userEvent.type(titleInput, "빨래 하기");
//     expect(titleInput).toHaveValue("빨래 하기");
//   });

//   it("파일 업로드 하기", async () => {
//     const mockFile = new File(["테스트할 파일이에요."], "test.txt", { type: "text/plain" });
//     postFile.mockResolvedValue({ url: "http://example.com/test.txt" });

//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);
//     const fileInput = screen.getByLabelText("파일을 업로드해주세요");
//     await userEvent.upload(fileInput, mockFile);

//     expect(postFile).toHaveBeenCalledWith(mockFile);
//     await waitFor(() => {
//       expect(screen.getByText("test.txt")).toBeInTheDocument();
//     });
//   });

//   it("링크 업로드 하기", async () => {
//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);
//     const linkAttachButton = screen.getByText("링크 첨부");
//     fireEvent.click(linkAttachButton);

//     expect(linkAttachButton).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
//   });

//   it("목표 기본 값으로 세팅하기", async () => {
//     const mockGoal = { id: 1, title: "오늘의 할 일", teamId: "FESI3-5", userId: 1, createdAt: "", updatedAt: "" };
//     getGoal.mockResolvedValue(mockGoal);

//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);

//     await waitFor(() => {
//       expect(getGoal).toHaveBeenCalledWith(1);
//       expect(screen.getByText("오늘의 할 일")).toBeInTheDocument();
//     });
//   });

//   it("새 할 일 제출하기", async () => {
//     const mockGoal = { id: 1, title: "오늘의 할 일", teamId: "FESI3-5", userId: 1, createdAt: "", updatedAt: "" };
//     getGoal.mockResolvedValue(mockGoal);
//     postTodos.mockResolvedValue({ id: 1, title: "노래 선정", goal: mockGoal });

//     render(<CreateNewTodo closeCreateNewTodo={mockCloseCreateNewTodo} />);

//     await userEvent.type(screen.getByLabelText("할 일의 제목"), "노래 선정");
//     await userEvent.click(screen.getByText("확인"));

//     expect(postTodos).toHaveBeenCalledWith("노래 선정", null, null, 1);
//     expect(toast.success).toHaveBeenCalledWith("할 일이 성공적으로 생성되었습니다");
//     expect(mockCloseCreateNewTodo).toHaveBeenCalled();
//   });

//   it("할 일 수정하기", async () => {
//     const mockGoal = { id: 1, title: "오늘의 할 일", teamId: "FESI3-5", userId: 1, createdAt: "", updatedAt: "" };
//     const mockTodo = { id: 1, title: "노래 선정", goal: mockGoal, fileUrl: null, linkUrl: null };
//     editTodo.mockResolvedValue(mockTodo);

//     render(
//       <CreateNewTodo
//         closeCreateNewTodo={mockCloseCreateNewTodo}
//         isEdit={true}
//         todoId={1}
//         goal={mockGoal}
//         title="Existing Todo"
//         onUpdate={mockOnUpdate}
//       />,
//     );

//     await userEvent.clear(screen.getByLabelText("할 일의 제목"));
//     await userEvent.type(screen.getByLabelText("할 일의 제목"), "노래를 정해보자");
//     await userEvent.click(screen.getByText("수정"));

//     expect(editTodo).toHaveBeenCalledWith("노래를 정해보자", 1, null, null, 1);
//     expect(mockOnUpdate).toHaveBeenCalledWith(mockTodo);
//     expect(mockCloseCreateNewTodo).toHaveBeenCalled();
//   });
// });
