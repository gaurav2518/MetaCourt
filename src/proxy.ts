import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  role: "user" | "juror" | "admin";
};

const protectedRoutes = [
  "/admin",
  "/complainant",
  "/juror",
  "/opposite-party",
];

const authRoutes = ["/login", "/register"];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthPath(pathname: string) {
  return authRoutes.includes(pathname);
}

function getDashboardForRole(role: TokenPayload["role"]) {
  if (role === "admin") return "/admin";
  if (role === "juror") return "/juror";
  return "/complainant";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (!isProtectedPath(pathname) && !isAuthPath(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    if (isProtectedPath(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }

  let payload: TokenPayload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
  } catch {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("token");
    return response;
  }

  if (isAuthPath(pathname)) {
    return NextResponse.redirect(
      new URL(getDashboardForRole(payload.role), request.url)
    );
  }

  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(
      new URL(getDashboardForRole(payload.role), request.url)
    );
  }

  if (pathname.startsWith("/juror") && payload.role !== "juror") {
    return NextResponse.redirect(
      new URL(getDashboardForRole(payload.role), request.url)
    );
  }

  if (
    pathname.startsWith("/complainant") &&
    payload.role !== "user" &&
    payload.role !== "juror"
  ) {
    return NextResponse.redirect(
      new URL(getDashboardForRole(payload.role), request.url)
    );
  }

  if (
    pathname.startsWith("/opposite-party") &&
    payload.role !== "user" &&
    payload.role !== "juror"
  ) {
    return NextResponse.redirect(
      new URL(getDashboardForRole(payload.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/complainant/:path*",
    "/juror/:path*",
    "/opposite-party/:path*",
    "/login",
    "/register",
  ],
};