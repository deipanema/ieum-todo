import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { vi } from "vitest";

import { postUser } from "@/api/authAPI";

import SignupForm from "./SignupForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/api/authAPI", () => ({
  postUser: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const user = userEvent.setup();

const mockPostUser = postUser;

const createWrapper = () => {
  const queryClient = new QueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // displayName 설정
  Wrapper.displayName = "QueryClientProviderWrapper";

  return Wrapper;
};

describe("회원가입 양식", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("회원가입 양식 렌더링", () => {
    render(<SignupForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
    expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "회원가입하기" })).toBeInTheDocument();
  });

  it("입력이 틀렸을 때, 오류 메시지를 표시합니다", async () => {
    render(<SignupForm />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: "회원가입하기" }));

    await waitFor(() => {
      expect(screen.getByText("닉네임은 최소 2자 이상이어야 합니다.")).toBeInTheDocument();
      expect(screen.getByText("유효한 이메일 주소를 입력해 주세요.")).toBeInTheDocument();
      expect(screen.getByText("비밀번호는 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
      expect(screen.getByText("비밀번호 확인은 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
    });
  });

  it("유효성 확인 후 회원가입 버튼 클릭", async () => {
    mockPostUser.mockResolvedValueOnce({});

    render(<SignupForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText("닉네임"), "testuser");
    await user.type(screen.getByLabelText("아이디"), "test@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.type(screen.getByLabelText("비밀번호 확인"), "password123");

    await user.click(screen.getByRole("button", { name: "회원가입하기" }));

    await waitFor(() => {
      expect(mockPostUser).toHaveBeenCalledWith({
        nickname: "testuser",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith("회원가입이 완료되었습니다.");
    });
  });

  it("API 호출에 실패할 때 오류 메시지를 표시합니다", async () => {
    mockPostUser.mockRejectedValueOnce({
      response: {
        status: 409,
      },
    });

    render(<SignupForm />, { wrapper: createWrapper() });
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("닉네임"), "testuser");
    await user.type(screen.getByLabelText("아이디"), "test@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.type(screen.getByLabelText("비밀번호 확인"), "password123");

    await user.click(screen.getByRole("button", { name: "회원가입하기" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("이미 사용 중인 이메일입니다.");
    });
  });
});
