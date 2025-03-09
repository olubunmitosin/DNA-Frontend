import { SessionOptions } from "iron-session";

import { SessionData } from "@/types/main";

export const sessionOptions: SessionOptions = {
  cookieName: "DNA_center_session",
  password: process.env.SECRET_KEY as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 3600,
  },
};

declare module "iron-session" {
  interface IronSessionData {
    session?: SessionData;
  }
}
