import "server-only";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";

export type MockBusinessOwner = {
  id: string;
  name: string;
  businessSlug: string;
};

export type MockSuperAdmin = {
  id: string;
  name: string;
  role: "SUPER_ADMIN";
};

export async function requireBusinessOwner(): Promise<MockBusinessOwner> {
  const session = await getCurrentSession();

  if (!session || session.role !== "BUSINESS_OWNER" || !session.businessSlug) {
    redirect(`/login?next=${encodeURIComponent("/business")}`);
  }

  return {
    id: session.id,
    name: session.name,
    businessSlug: session.businessSlug,
  };
}

export async function requireSuperAdmin(): Promise<MockSuperAdmin> {
  const session = await getCurrentSession();

  if (!session || session.role !== "SUPER_ADMIN") {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  return {
    id: session.id,
    name: session.name,
    role: "SUPER_ADMIN",
  };
}
