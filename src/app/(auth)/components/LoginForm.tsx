"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";

import { login } from "@/utils/authUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    clearErrors();
    setLoginError(null);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setLoginError("로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("로그인 중 오류 발생:", axiosError);
      setLoginError("로그인 실패했습니다. 다시 시도해 주세요.");
    }
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
          errors.email ? "border-red-50 focus:ring-red-50" : "border-slate-300"
        }`}
        {...register("email")}
        onBlur={() => trigger("email")}
      />
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
      {errors.email && <small className="text-sm text-red-50">{errors.email.message}</small>}
      {errors.password && <small className="mb-5 text-sm text-red-50">{errors.password.message}</small>}
      {loginError && <small className="mb-5 text-sm text-red-50">{loginError}</small>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mb-6 mt-4 flex h-[50px] items-center justify-center rounded-md border bg-blue-400 text-base text-white hover:bg-blue-500 disabled:bg-blue-200"
      >
        {isSubmitting ? <LoadingSpinner /> : "로그인"}
      </button>
    </form>
  );
}
const schema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
});
