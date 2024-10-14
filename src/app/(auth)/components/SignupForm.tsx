"use client";

import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { postUser } from "@/api/authAPI";
import { ErrorResponse } from "@/app/Types/AuthType";

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
    clearErrors,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const signupMutation = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      clearErrors();
      reset();
      toast.success("회원가입이 완료되었습니다.");
      router.push("/login");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error);

      if (error.response) {
        const statusCode = error.response.status;
        const errorInfo = errorMessage[statusCode];
        if (errorInfo) {
          toast.error(errorInfo.message);
        }
      }
    },
  });

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
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
  400: {
    field: "email",
    message: "유효하지 않은 요청입니다.",
  },
};
