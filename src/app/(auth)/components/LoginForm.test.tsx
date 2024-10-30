import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, Mock } from "vitest";

import { useAuth } from "@/hooks/useAuth";

import LoginForm from "./LoginForm";

// Mock the useAuth hook
vi.mock("@/hooks/useAuth");

describe("LoginForm", () => {
  const mockLoginMutation = {
    mutate: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({
      loginMutation: mockLoginMutation,
    });
  });

  it("모든 입력 필드와 로그인 버튼이 렌더링되어야 한다.", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("이메일")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  describe("유효성 검사", () => {
    it("이메일 및 비밀번호 필드 유효성 검사", async () => {
      render(<LoginForm />);
      fireEvent.blur(screen.getByPlaceholderText("이메일"));
      fireEvent.blur(screen.getByPlaceholderText("비밀번호"));

      await waitFor(() => {
        expect(screen.getByText("유효한 이메일 주소를 입력해주세요.")).toBeInTheDocument();
        expect(screen.getByText("비밀번호는 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
      });
    });

    it("이메일과 비밀번호로 로그인합니다.", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByPlaceholderText("이메일"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: "로그인" }));

      await waitFor(() => {
        expect(mockLoginMutation.mutate).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("제출 시 로딩 중인 스피너를 표시합니다.", async () => {
      mockLoginMutation.isLoading = true;
      render(<LoginForm />);

      fireEvent.change(screen.getByPlaceholderText("이메일"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: "로그인" }));

      await waitFor(() => {
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });
    });
  });
});
