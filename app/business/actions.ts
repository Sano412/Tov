"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { decideBusinessBooking } from "@/lib/bookings";

export type BusinessBookingDecisionState = {
  ok: boolean;
  message: string;
};

const decisionSchema = z.object({
  bookingId: z.string().min(1),
  decision: z.enum(["CONFIRM", "REJECT"]),
});

function getDecisionErrorMessage(
  reason:
    | "CONFIRMED_OVERLAP"
    | "INVALID_INTERVAL"
    | "NOT_FOUND"
    | "NOT_PENDING"
    | "OUTSIDE_BRANCH_HOURS"
    | "RESOURCE_UNAVAILABLE",
) {
  if (reason === "CONFIRMED_OVERLAP") {
    return "Cannot confirm: this time overlaps an existing confirmed booking.";
  }

  if (reason === "OUTSIDE_BRANCH_HOURS") {
    return "Cannot confirm: this time is outside branch booking hours.";
  }

  if (reason === "RESOURCE_UNAVAILABLE") {
    return "Cannot confirm: this resource is not accepting bookings right now.";
  }

  return "Cannot update this booking request.";
}

export async function submitBusinessBookingDecision(
  _previousState: BusinessBookingDecisionState,
  formData: FormData,
): Promise<BusinessBookingDecisionState> {
  const parsed = decisionSchema.safeParse({
    bookingId: formData.get("bookingId"),
    decision: formData.get("decision"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid booking action.",
    };
  }

  const owner = await requireBusinessOwner();
  const result = await decideBusinessBooking({
    bookingId: parsed.data.bookingId,
    businessSlug: owner.businessSlug,
    decision: parsed.data.decision,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: getDecisionErrorMessage(result.reason),
    };
  }

  revalidatePath("/business");

  return {
    ok: true,
    message:
      result.status === "CONFIRMED"
        ? "Booking confirmed."
        : "Booking request rejected.",
  };
}
