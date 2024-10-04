import Link from "next/link";

import LoginFormContainer from "../components/LoginFormContainer";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-grow items-center justify-center">
        <LoginFormContainer />
      </div>
      <footer className="p-4 text-center text-xs text-gray-50">
        ©{" "}
        <Link href="https://github.com/deipanema" className="hover:underline">
          deipanema
        </Link>
        . All Rights Reserved
      </footer>
    </section>
  );
}
