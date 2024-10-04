"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "./SubmitButton";
import InputField from "./InputField";

type FormFields = "nickname" | "email" | "password" | "passwordConfirm";

type FormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // 실시간 유효성 검사를 위해 추가
  });

  useEffect(() => {
    const firstInput = document.getElementById("nickname") as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        email: data.email,
        name: data.nickname,
        password: data.password,
      });

      if (response.data) {
        clearErrors();
        reset();
        router.push("/login");
        console.log("회원가입 성공 ✨", response.data);
      }
    } catch (error) {
      console.error("회원가입 서버 오류🚨", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorCode = error.response.status;
        const errorInfo = errorMessage[errorCode];

        if (errorCode) {
          setError(errorInfo.field, {
            type: "manual",
            message: errorInfo.message,
          });
        }
      }
    }
  };

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

const signupSchema = z
  .object({
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(8, "비밀번호 확인은 최소 8자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

const errorMessage: Record<number, { field: FormFields; message: string }> = {
  409: {
    field: "email",
    message: "이미 사용 중인 이메일입니다.",
  },
};
