import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 미들웨어 함수
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");

  // '/' 경로 접근 시 토큰이 있으면 /dashboard로, 없으면 /login으로 리다이렉션
  if (request.nextUrl.pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // accessToken이 없고 보호된 페이지에 접근하면 로그인 페이지로 리다이렉션
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 이미 로그인된 사용자가 /login 또는 /signup 페이지에 접근하면 /dashboard로 리다이렉션
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// matcher로 미들웨어가 적용될 경로 지정
export const config = {
  matcher: ["/", "/dashboard", "/login", "/signup"], // '/' 경로 포함
};
