"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { decidePendingBusiness } from "@/lib/admin-businesses";

export type AdminBusinessDecisionState = {
  ok: boolean;
  message: string;
};

const decisionSchema = z.object({
  businessId: z.string().min(1),
  decision: z.enum(["APPROVE", "REJECT"]),
});

export async function submitAdminBusinessDecision(
  _previousState: AdminBusinessDecisionState,
  formData: FormData,
): Promise<AdminBusinessDecisionState> {
  await requireSuperAdmin();

  const parsed = decisionSchema.safeParse({
    businessId: formData.get("businessId"),
    decision: formData.get("decision"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid business action.",
    };
  }

  const result = await decidePendingBusiness({
    businessId: parsed.data.businessId,
    decision: parsed.data.decision,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: "This business is no longer pending.",
    };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    message: result.status === "APPROVED" ? "Business approved." : "Business rejected.",
  };
}
