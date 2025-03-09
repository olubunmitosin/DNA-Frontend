"use server";

import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { sessionOptions } from "@/lib/session";
import { isEmailVerified, sleep } from "@/lib/utils";
import { defaultSession, SessionData, User } from "@/types/main";

export async function getSession(shouldSleep = true) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.firstName = defaultSession.firstName;
  }

  if (shouldSleep) {
    await sleep(250);
  }

  return session;
}

export async function logout() {
  const session = await getSession();

  session.destroy();
  // Redirect to the homepage (or login page) immediately
  const headers = new Headers();
  headers.set("cache-control", "no-store");
  headers.set("location", "/"); // Correct location header setting

  return new Response(null, {
    status: 303,
    headers,
  });
}

export async function loginSession(user: User, accessToken: string) {
  // const userInfo = await getUserInfo(accessToken);
  const session = await getSession();
  console.log(user);
  const isBoarded = user.has_done_full === "yes";
  const isVerified = isEmailVerified(user.email_verified_at);

  Object.assign(session, {
    // more efficient than individual assignments
    firstName: user.first_name,
    isLoggedIn: true,
    email: user.email,
    onboarded: isBoarded,
    accessToken, // Consider if you REALLY need to store the access token in the cookie
    emailIsVerified: isVerified,
    // status: user.status,
    role: user.user_type,
    userId: user.id,
  });

  await session.save();

  revalidatePath("/dashboard");
}

export async function RegisterUserSession(user: User, accessToken: string) {
  // const userInfo = await getUserInfo(accessToken);
  const session = await getSession();

  Object.assign(session, {
    firstName: user.first_name,
    lastName: user.last_name,
    isLoggedIn: true,
    onboarded: false,
    email: user.email,
    accessToken, // Consider if you REALLY need to store the access token in the cookie
    userId: user.id,
  });

  await session.save();
  revalidatePath("/sign-up");
}

export async function onboardSession(data: User) {
  const session = await getSession();

  session.onboarded = data.has_done_full === "yes"; // Simplified assignment

  await session.save();
}

export async function verifyEmailSession(data: User) {
  const session = await getSession();

  session.emailIsVerified = isEmailVerified(data.email_verified_at); // Simplified

  await session.save();
}
