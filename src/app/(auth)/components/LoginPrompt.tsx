import Link from "next/link";

export default function LoginPrompt() {
  return (
    <div className="mb-6 flex justify-center gap-x-1 text-xs sm:gap-x-[10px] sm:text-sm">
      <p>이미 아이디가 있으신가요?</p>
      <Link href="/login" className="font-bold underline hover:text-slate-500">
        <p>로그인</p>
      </Link>
    </div>
  );
}
