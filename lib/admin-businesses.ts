import "server-only";

import { prisma } from "@/lib/prisma";

export type AdminBusinessDecision = "APPROVE" | "REJECT";

export async function decidePendingBusiness({
  businessId,
  decision,
}: {
  businessId: string;
  decision: AdminBusinessDecision;
}) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      status: "PENDING",
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    return {
      ok: false as const,
      reason: "NOT_PENDING" as const,
    };
  }

  const status = decision === "APPROVE" ? "APPROVED" : "REJECTED";

  await prisma.business.update({
    where: {
      id: business.id,
    },
    data: {
      status,
    },
  });

  return {
    ok: true as const,
    status,
  };
}
