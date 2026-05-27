import "server-only";

import { cookies } from "next/headers";

export type SessionRole = "BUSINESS_OWNER" | "SUPER_ADMIN";

export type TovloSession = {
  id: string;
  name: string;
  role: SessionRole;
  businessSlug?: string;
};

export const sessionCookieName = "tovlo_session";

const demoSessions: Record<SessionRole, TovloSession> = {
  BUSINESS_OWNER: {
    id: "demo-owner-amber",
    name: "Amber Karaoke Owner",
    role: "BUSINESS_OWNER",
    businessSlug: "amber-karaoke",
  },
  SUPER_ADMIN: {
    id: "demo-super-admin",
    name: "Tovlo Super Admin",
    role: "SUPER_ADMIN",
  },
};

function encodeSession(session: TovloSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as TovloSession;

    if (parsed.role !== "BUSINESS_OWNER" && parsed.role !== "SUPER_ADMIN") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(sessionCookieName)?.value);
}

export async function setDemoSession(role: SessionRole) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(demoSessions[role]), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}
