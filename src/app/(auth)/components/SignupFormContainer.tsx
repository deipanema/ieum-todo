import Image from "next/image";

import LoginPrompt from "./LoginPrompt";
import SignupForm from "./SignupForm";

export default function SignupFormContainer() {
  return (
    <section aria-labelledby="signup-heading" className="flex items-center justify-center">
      <Image alt="브랜드" width={106} height={35} src="/brand.webp" className="absolute left-4 top-4" />
      <div className="w-[343px] rounded-2xl bg-white px-8 py-6 sm:w-[510px] sm:rounded-3xl sm:px-14 sm:py-8 md:mx-[102px]">
        <h2 id="signup-heading" className="md:text-display-1 pb-8 text-center text-[20px] font-bold sm:text-black">
          회원가입
        </h2>
        <SignupForm />
        <LoginPrompt />
      </div>
    </section>
  );
}
