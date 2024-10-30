import { render, screen, waitFor } from "@testing-library/react";
import { vi, Mock } from "vitest";
import userEvent from "@testing-library/user-event";

import { useAuth } from "@/hooks/useAuth";

import SignupForm from "./SignupForm";

// Mock modules

vi.mock("@/hooks/useAuth");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hook/useSignup", () => ({
  useSignup: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignupForm", () => {
  const mockSignupMutation = { mutate: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      signupMutation: mockSignupMutation,
      isLoading: false,
    });
  });

  describe("SignupForm 렌더링 테스트", () => {
    it("모든 입력 필드와 제출 버튼이 렌더링되어야 한다", () => {
      render(<SignupForm />);

      expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
      expect(screen.getByLabelText("아이디")).toBeInTheDocument();
      expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
      expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
      expect(screen.getByText("회원가입하기")).toBeInTheDocument();
    });

    it("페이지 로드시 닉네임 입력 필드에 포커스가 되어야 한다", () => {
      render(<SignupForm />);

      expect(screen.getByLabelText("닉네임")).toHaveFocus();
    });
  });

  describe("유효성 검사", () => {
    it("닉네임이 2자 미만일 경우 에러 메시지를 표시해야 한다", async () => {
      render(<SignupForm />);
      const nicknameInput = screen.getByLabelText("닉네임");

      await userEvent.type(nicknameInput, "a");
      await userEvent.tab();

      expect(await screen.findByText("닉네임은 최소 2자 이상이어야 합니다.")).toBeInTheDocument();
    });

    it("이메일 형식이 잘못된 경우 에러 메시지를 표시해야 한다", async () => {
      render(<SignupForm />);
      const emailInput = screen.getByLabelText("아이디");

      await userEvent.type(emailInput, "invalid-email");
      await userEvent.tab();

      expect(await screen.findByText("유효한 이메일 주소를 입력해 주세요.")).toBeInTheDocument();
    });

    it("비밀번호가 8자 미만일 경우 에러 메시지를 표시해야 한다", async () => {
      render(<SignupForm />);
      const passwordInput = screen.getByLabelText("비밀번호");

      await userEvent.type(passwordInput, "1234567");
      await userEvent.tab();

      expect(await screen.findByText("비밀번호는 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
    });

    it("비밀번호와 비밀번호 확인이 일치하지 않을 경우 에러 메시지를 표시해야 한다", async () => {
      render(<SignupForm />);
      const passwordInput = screen.getByLabelText("비밀번호");
      const passwordConfirmInput = screen.getByLabelText("비밀번호 확인");

      await userEvent.type(passwordInput, "password123");
      await userEvent.type(passwordConfirmInput, "password456");
      await userEvent.tab();

      expect(await screen.findByText("비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
    });
  });

  describe("폼 제출", () => {
    const validFormData = {
      nickname: "유저",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
    };

    it("유효한 데이터로 폼 제출시 회원가입 mutation이 호출되어야 한다", async () => {
      render(<SignupForm />);

      await userEvent.type(screen.getByLabelText("닉네임"), validFormData.nickname);
      await userEvent.type(screen.getByLabelText("아이디"), validFormData.email);
      await userEvent.type(screen.getByLabelText("비밀번호"), validFormData.password);
      await userEvent.type(screen.getByLabelText("비밀번호 확인"), validFormData.passwordConfirm);

      const submitButton = screen.getByText("회원가입하기");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignupMutation.mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            nickname: validFormData.nickname,
            email: validFormData.email,
            password: validFormData.password,
            passwordConfirm: validFormData.passwordConfirm,
          }),
          expect.any(Object),
        );
      });
    });

    it("이미 사용 중인 이메일로 가입 시도시 에러 메시지를 표시해야 한다", async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 409,
        },
      };

      mockSignupMutation.mutate.mockImplementation((_, options) => {
        options.onError(mockError);
      });

      render(<SignupForm />);

      await userEvent.type(screen.getByLabelText("닉네임"), validFormData.nickname);
      await userEvent.type(screen.getByLabelText("아이디"), validFormData.email);
      await userEvent.type(screen.getByLabelText("비밀번호"), validFormData.password);
      await userEvent.type(screen.getByLabelText("비밀번호 확인"), validFormData.passwordConfirm);

      const submitButton = screen.getByText("회원가입하기");
      await userEvent.click(submitButton);

      expect(await screen.findByText("이미 사용 중인 이메일입니다.")).toBeInTheDocument();
    });
  });
});
