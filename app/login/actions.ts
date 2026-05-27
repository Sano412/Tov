"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setDemoSession, clearSession } from "@/lib/auth/session";

export type LoginState = {
  ok: boolean;
  message: string;
};

const loginSchema = z.object({
  role: z.enum(["BUSINESS_OWNER", "SUPER_ADMIN"]),
  accessCode: z.string().trim().min(1),
  next: z.string().optional(),
});

function getSafeNext(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    role: formData.get("role"),
    accessCode: formData.get("accessCode"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Choose a role and enter the demo access code.",
    };
  }

  if (parsed.data.accessCode !== "tovlo-demo") {
    return {
      ok: false,
      message: "Wrong access code. Use tovlo-demo for this local MVP.",
    };
  }

  await setDemoSession(parsed.data.role);
  redirect(getSafeNext(parsed.data.next));
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
