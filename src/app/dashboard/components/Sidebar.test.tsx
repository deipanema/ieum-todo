// import { useRouter } from "next/navigation";
// import { expect, vi } from "vitest";
// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

// import { useAuthStore } from "@/store/authStore";
// import { GoalType, useGoalStore } from "@/store/goalStore";
// import CreateNewTodo from "@/components/CreateNewTodo";
// import { logout } from "@/utils/authUtils";

// import SideBar from "./Sidebar";

// export const mockGoals: GoalType[] = [
//   {
//     id: 1,
//     teamId: "FESI3-5",
//     title: "스타벅스 가기",
//     userId: 1,
//     createdAt: "",
//     updatedAt: "",
//   },
//   {
//     id: 2,
//     teamId: "FESI3-5",
//     title: "이삭 토스트 가기",
//     userId: 1,
//     createdAt: "",
//     updatedAt: "",
//   },
// ];

// // Next.js의 navigation과 Image 컴포넌트 모킹
// vi.mock("next/navigation", () => ({
//   useRouter: vi.fn(() => ({
//     push: vi.fn(),
//   })),
//   usePathname: () => "/mocked/path",
// }));

// vi.mock("next/image", () => ({
//   default: vi.fn(() => null),
// }));

// // 스토어와 유틸리티 함수 모킹
// vi.mock("@/store/goalStore", () => ({
//   useGoalStore: vi.fn(),
// }));

// vi.mock("@/store/authStore", () => ({
//   useAuthStore: vi.fn(),
// }));

// vi.mock("@/utils/authUtils", () => ({
//   logout: vi.fn(),
// }));

// describe("SideBar 컴포넌트", () => {
//   const mockPush = vi.fn();
//   const mockRefreshGoals = vi.fn();
//   const mockAddGoal = vi.fn();
//   const mockUser = { name: "테스트 사용자", email: "test@example.com" };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     useRouter.mockReturnValue({
//       push: mockPush,
//     });
//     useGoalStore.mockReturnValue({
//       goals: [{ id: 1, title: "오늘의 할 일" }],
//       refreshGoals: mockRefreshGoals,
//       addGoal: mockAddGoal,
//     });
//     useAuthStore.mockReturnValue({ user: mockUser });
//     render(<CreateNewTodo closeCreateNewTodo={() => {}} goal={mockGoals[0]} />);
//   });

//   it("사이드바가 렌더링됩니다", async () => {
//     render(<SideBar />);
//     expect(screen.getByText("대시보드")).toBeInTheDocument();
//     expect(screen.getByText("+ 새 할 일")).toBeInTheDocument();
//     expect(screen.getByTestId("sidebar-goal-heading")).toBeInTheDocument();

//     // 목표가 비동기로 로드되므로 findByText 사용
//     expect(await screen.findByText("스타벅스 가기")).toBeInTheDocument();
//   });

//   it("로그아웃 클릭 시 로그아웃되어 / 경로로 갑니다.", async () => {
//     logout.mockResolvedValue(true);
//     render(<SideBar />);

//     const logoutButton = screen.getByText("로그아웃");
//     await fireEvent.click(logoutButton);

//     expect(logout).toHaveBeenCalled();

//     await waitFor(() => {
//       expect(mockPush).toHaveBeenCalledWith("/");
//     });
//   });

//   it("새 목표 추가 기능이 작동합니다", async () => {
//     render(<SideBar />);

//     const newGoalButton = screen.getByText("+ 새 목표");
//     await userEvent.click(newGoalButton);

//     const input = screen.getByRole("textbox", { name: "새목표" });
//     await userEvent.type(input, "cypress까지 달리기");
//     fireEvent.submit(input);

//     expect(mockAddGoal).toHaveBeenCalledWith("cypress까지 달리기");
//   });

//   it("사이드바 토글 기능이 작동합니다", async () => {
//     render(<SideBar />);

//     const toggleButton = screen.getByTestId("main-sidebar-button");
//     await userEvent.click(toggleButton);

//     expect(screen.getByTestId("slim-sidebar-button")).toBeInTheDocument();
//   });

//   it("컴포넌트 마운트 시 목표 새로고침합니다", () => {
//     render(<SideBar />);
//     expect(mockRefreshGoals).toHaveBeenCalled();
//   });
// });
