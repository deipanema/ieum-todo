import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { signup } from "@/api/authAPI";
import { ErrorType } from "@/api/goalAPI";
import { poof } from "@/utils/confetti";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
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
};