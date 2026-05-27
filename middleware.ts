import { NextRequest, NextResponse } from "next/server";

type SessionRole = "BUSINESS_OWNER" | "SUPER_ADMIN";

type TovloSession = {
  id: string;
  name: string;
  role: SessionRole;
  businessSlug?: string;
};

const sessionCookieName = "tovlo_session";

function decodeSession(value?: string): TovloSession | null {
  if (!value) {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(padded)) as TovloSession;

    if (parsed.role !== "BUSINESS_OWNER" && parsed.role !== "SUPER_ADMIN") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function hasRole(request: NextRequest, role: SessionRole) {
  const session = decodeSession(request.cookies.get(sessionCookieName)?.value);
  return session?.role === role;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") && !hasRole(request, "SUPER_ADMIN")) {
    return redirectToLogin(request);
  }

  if (pathname.startsWith("/business") && !hasRole(request, "BUSINESS_OWNER")) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/business/:path*"],
};
