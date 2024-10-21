// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import userEvent from "@testing-library/user-event";
// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { vi } from "vitest";
// import { toast } from "react-toastify";

// import { login } from "@/utils/authUtils";

// import LoginForm from "./LoginForm";

// vi.mock("next/navigation", () => ({
//   useRouter: () => ({
//     push: vi.fn(),
//   }),
// }));

// vi.mock("@/utils/authUtils", () => ({
//   login: vi.fn(),
// }));

// vi.mock("react-toastify", () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// const user = userEvent.setup();

// const mockLogin = vi.mocked(login);

// const createWrapper = () => {
//   const queryClient = new QueryClient();

//   const Wrapper = ({ children }: { children: React.ReactNode }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );

//   // displayName 설정
//   Wrapper.displayName = "QueryClientProviderWrapper";

//   return Wrapper;
// };

// describe("회원가입 양식", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("로그인 양식이 렌더링되는지 확인한다", () => {
//     render(<LoginForm />, { wrapper: createWrapper() });

//     expect(screen.getByRole("form", { name: "로그인 양식" })).toBeInTheDocument();
//     expect(screen.getByLabelText("이메일")).toBeInTheDocument();
//     expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
//   });

//   it("비밀번호 입력 시 최소 길이 오류 메시지 표시", async () => {
//     render(<LoginForm />, { wrapper: createWrapper() });

//     fireEvent.change(screen.getByPlaceholderText("이메일"), {
//       target: { value: "test@example.com" },
//     });

//     fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
//       target: { value: "short" },
//     });

//     user.click(screen.getByText("로그인"));

//     expect(await screen.findByText("비밀번호는 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
//   });

//   it("유효성 확인 후 회원가입 버튼 클릭", async () => {
//     mockLogin.mockResolvedValueOnce({}); // 로그인 성공 시 반환할 값 설정

//     render(<LoginForm />, { wrapper: createWrapper() });

//     await user.type(screen.getByLabelText("이메일"), "qq@naver.com");
//     await user.type(screen.getByLabelText("비밀번호"), "012345678");
//     await user.click(screen.getByRole("button", { name: "로그인" }));

//     await waitFor(() => {
//       expect(mockLogin).toHaveBeenCalledWith("qq@naver.com", "012345678");
//       expect(toast.success).toHaveBeenCalledWith("로그인 되었습니다.");
//     });
//   });

//   it("로그인 실패 시 오류 메시지 표시합니다.", async () => {
//     mockLogin.mockRejectedValueOnce({
//       response: {
//         status: 404,
//       },
//     });

//     render(<LoginForm />, { wrapper: createWrapper() });

//     await user.type(screen.getByLabelText("이메일"), "jj@example.com");
//     await user.type(screen.getByLabelText("비밀번호"), "01234567");
//     await user.click(screen.getByRole("button", { name: "로그인" }));

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith("가입되지 않은 이메일입니다.");
//     });
//   });
// });
