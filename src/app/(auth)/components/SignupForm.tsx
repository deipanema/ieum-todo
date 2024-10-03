"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

type FormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    const firstInput = document.getElementById("nickname") as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <form className="flex flex-col justify-center" aria-label="회원가입 양식" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        id="nickname"
        label="닉네임"
        type="text"
        placeholder="닉네임을 입력해 주세요."
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
      />
      <InputField
        id="email"
        label="아이디"
        type="email"
        placeholder="이메일을 입력해 주세요."
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
      />
      <InputField
        id="password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해 주세요."
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
      />
      <InputField
        id="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 입력해 주세요."
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
      />
      <SubmitButton isSubmitting={isSubmitting} text="회원가입하기" />
    </form>
  );
}

const signupSchema = z.object({
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  passwordConfirm: z.string().min(8, "비밀번호 확인은 최소 8자 이상이어야 합니다."),
});
