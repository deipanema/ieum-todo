import AnimatedText from "@/utils/AnimatedText";
import Link from "next/link";

export default function SignupPrompt() {
  return (
    <div className="mb-6 flex justify-center gap-x-1 text-xs sm:gap-x-[10px] sm:text-sm">
      <p>처음이신가요?</p>
      <Link href="/signup">
        <AnimatedText text="회원가입" />
      </Link>
    </div>
  );
}
