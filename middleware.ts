import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me",
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      // токен недействителен — сбрасываем и уводим на вход
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("session");
  return response;
}

export const config = {
  matcher: ["/tasks/:path*"],
};
