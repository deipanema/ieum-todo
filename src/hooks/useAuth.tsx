import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { signup } from "@/api/authAPI";
import { ErrorType } from "@/api/goalAPI";
import { poof } from "@/utils/confetti";
import { login } from "@/utils/authUtils";

export const useAuth = () => {
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("회원가입이 완료되었습니다.");
      poof();
      router.push("/login");
    },
    onError: (error: ErrorType) => {
      throw error;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data.email, data.password),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: ErrorType) => {
      console.error("로그인 중 오류 발생:", error);
      toast.error("로그인을 실패했습니다. 다시 시도해 주세요.");
    },
  });

  return { signupMutation, loginMutation };
};
