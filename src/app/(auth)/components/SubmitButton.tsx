interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
}

export default function SubmitButton({ isSubmitting, text }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`mb-4 mt-[15px] flex h-[30px] items-center justify-center rounded-sm border py-[6px] text-xs text-white sm:mb-6 sm:mt-4 sm:h-11 sm:text-base md:py-[10px] ${isSubmitting ? "border-slate-100 bg-slate-50" : "border-blue-500 bg-blue-500"}`}
    >
      {text}
    </button>
  );
}
