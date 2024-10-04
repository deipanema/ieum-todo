import LoadingSpinner from "@/app/components/LoadingSpinner";

interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
}

export default function SubmitButton({ isSubmitting, text }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mb-4 mt-[15px] flex h-[30px] items-center justify-center rounded-sm border bg-blue-400 py-[6px] text-xs text-white hover:bg-blue-500 sm:mb-6 sm:mt-4 sm:h-11 sm:text-base md:py-[10px]"
    >
      {`${isSubmitting ? <LoadingSpinner /> : "회원가입하기"}`}
    </button>
  );
}
