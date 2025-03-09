import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./app/actions/session.action";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  guestRoutes,
} from "./routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const pathname = nextUrl.pathname;
  const session = await getSession();

  console.log(session);
  const isLoggedIn = session?.isLoggedIn || false;
  const isOnboarded = session?.onboarded || false;

  const isAPiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isGuestRoute = guestRoutes.some((route) => pathname.endsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  const privateRoute = !isGuestRoute;

  if (isAPiAuthRoute) {
    return;
  }

  // Redirect to login if accessing onboarding without being logged in
  if (!isLoggedIn && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // Redirect logged-in users to the default dashboard if already onboarded
  if (isLoggedIn && isOnboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // if (isLoggedIn && !isOnboarded) {
  //   return NextResponse.redirect(new URL("/onboarding", nextUrl));
  // }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect unauthenticated users attempting to access private routes
  if (privateRoute && !session?.userId) {
    const callbackUrl = encodeURIComponent(
      `${nextUrl.pathname}${nextUrl.search}`
    );
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
  // Prevent logged-in users from accessing login or signup pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
