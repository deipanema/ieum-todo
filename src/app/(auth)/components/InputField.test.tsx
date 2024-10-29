import { describe, expect, vi } from "vitest";
import { useForm } from "react-hook-form";
import { fireEvent, render, screen } from "@testing-library/react";

import InputField from "./InputField";

type TestFormValues = {
  nickname: string;
};

describe("InputField Component", () => {
  const TestInputField = () => {
    const {
      register,
      trigger,
      watch,
      formState: { errors },
    } = useForm<TestFormValues>();

    return (
      <InputField
        id="nickname"
        label="Nickname"
        type="text"
        placeholder="별명"
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
      />
    );
  };

  it("InputField 렌더링 합니다.", () => {
    render(<TestInputField />);
    expect(screen.getByLabelText("Nickname")).toBeInTheDocument();
  });

  it("입력이 유효하지 않으면 오류 메시지를 표시합니다.", async () => {
    const mockTrigger = vi.fn().mockResolvedValue(false);
    render(<TestInputField />);

    const input = screen.getByLabelText("Nickname") as HTMLInputElement;
    fireEvent.blur(input);

    await mockTrigger("nickname");
    expect(mockTrigger).toHaveBeenCalledWith("nickname");

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
  });

  it("blur() 되었을 때, InputField 유효성을 검사합니다.", async () => {
    const mockTrigger = vi.fn().mockResolvedValue(true);
    render(<TestInputField />);

    const input = screen.getByLabelText("Nickname") as HTMLInputElement;
    fireEvent.blur(input);

    await mockTrigger("nickname");
    expect(mockTrigger).toHaveBeenCalledWith("nickname");
  });
});
