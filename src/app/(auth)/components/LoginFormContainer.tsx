import Image from "next/image";

import LoginForm from "./LoginForm";
import SignupPrompt from "./SignupPrompt";

export default function LoginFormContainer() {
  return (
    <section aria-labelledby="login-heading" className="flex items-center justify-center">
      <div className="w-[300px] rounded-2xl py-6 sm:rounded-3xl sm:py-8">
        <h1 id="signup-heading" className="pb-8">
          <Image alt="브랜드" width={106} height={35} src="/brand.webp" className="mx-auto" priority />
        </h1>
        <LoginForm />
        <SignupPrompt />
      </div>
    </section>
  );
}
