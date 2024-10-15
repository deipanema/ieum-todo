"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { login } from "@/utils/authUtils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ErrorResponse } from "@/app/Types/AuthType";

type FormFields = "email" | "password";

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data.email, data.password),
    onSuccess: (data) => {
      if (data) {
        toast.success("로그인 되었습니다.");
        router.push("/dashboard");
      } else {
        toast.error("로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
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
    clearErrors();
    loginMutation.mutate(data);
  };

  return (
    <form className="flex flex-col" aria-label="로그인 양식" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email" className="sr-only">
        이메일
      </label>
      <input
        id="email"
        type="email"
        placeholder="이메일"
        aria-required="true"
        required
        className={`w-full rounded-tl-md rounded-tr-md border px-[10px] py-3 text-sm placeholder-slate-400 hover:bg-slate-50 focus:z-50 focus:outline-none focus:ring-1 focus:ring-blue-300 sm:px-4 sm:text-base ${
          errors.email ? "border-red-500 focus:ring-red-50" : "border-slate-300"
        }`}
        {...register("email")}
        onBlur={() => trigger("email")}
      />
      {errors.email && <small className="text-sm text-red-50">{errors.email.message}</small>}
      <label htmlFor="password" className="sr-only">
        비밀번호
      </label>
      <input
        id="password"
        type="password"
        placeholder="비밀번호"
        {...register("password")}
        aria-required="true"
        className={`w-full rounded-bl-md rounded-br-md border px-[10px] py-3 text-sm placeholder-slate-400 hover:bg-slate-50 focus:z-50 focus:outline-none focus:ring-1 focus:ring-blue-300 sm:px-4 sm:text-base ${
          errors.password ? "border-red-50 focus:ring-red-50" : "border-slate-300"
        }`}
        onBlur={() => trigger("password")}
      />
      {errors.password && <small className="mb-5 text-sm text-red-50">{errors.password.message}</small>}
      <button
        type="submit"
        data-testid="login-sumbmit"
        disabled={isSubmitting}
        className="mb-6 mt-4 flex h-[50px] items-center justify-center rounded-md border bg-blue-400 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
      >
        {isSubmitting ? <LoadingSpinner /> : "로그인"}
      </button>
    </form>
  );
}

const schema = z.object({
  email: z.string(),
  password: z.string().min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
});
const errorMessage: Record<number, { field: FormFields; message: string }> = {
  404: {
    field: "email",
    message: "가입되지 않은 이메일입니다.",
  },
  400: {
    field: "email",
    message: "이메일 형식으로 작성해 주세요.",
  },
};
