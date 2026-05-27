"use server";

import { z } from "zod";
import { createPublicBookingRequest } from "@/lib/bookings";

export type BookingRequestState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const phoneRegex = /^(?:\+976\s?)?[0-9]{8}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const bookingRequestSchema = z.object({
  resourceSlug: z.string().min(1, "Resource not found."),
  customerName: z
    .string()
    .trim()
    .min(2, "Enter a name with at least 2 characters.")
    .max(80, "Name is too long."),
  customerPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "Use an 8 digit phone number or +976 format."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  startTime: z.string().regex(timeRegex, "Choose a valid start time."),
  durationHours: z.coerce
    .number()
    .int("Duration must be a whole number.")
    .min(1, "Minimum duration is 1 hour.")
    .max(6, "MVP requests are limited to 6 hours."),
  note: z.string().trim().max(300, "Note must be 300 characters or less.").optional(),
});

function createUlaanbaatarDate(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`);
}

function getBookingRequestErrorMessage(
  reason:
    | "CONFIRMED_OVERLAP"
    | "INVALID_INTERVAL"
    | "OUTSIDE_BRANCH_HOURS"
    | "RESOURCE_UNAVAILABLE"
    | "START_IN_PAST",
) {
  if (reason === "CONFIRMED_OVERLAP") {
    return "That time overlaps a confirmed booking. Please choose another slot.";
  }

  if (reason === "INVALID_INTERVAL") {
    return "Choose a valid start time and duration.";
  }

  if (reason === "OUTSIDE_BRANCH_HOURS") {
    return "That time is outside this branch's booking hours.";
  }

  if (reason === "START_IN_PAST") {
    return "Choose a future time for your booking request.";
  }

  return "This resource is not accepting booking requests right now.";
}

export async function submitBookingRequest(
  _previousState: BookingRequestState,
  formData: FormData,
): Promise<BookingRequestState> {
  const parsed = bookingRequestSchema.safeParse({
    resourceSlug: formData.get("resourceSlug"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    durationHours: formData.get("durationHours"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the request details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const startTime = createUlaanbaatarDate(parsed.data.date, parsed.data.startTime);

  if (Number.isNaN(startTime.getTime())) {
    return {
      ok: false,
      message: "The selected date or time is invalid.",
    };
  }

  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + parsed.data.durationHours);

  if (endTime <= startTime) {
    return {
      ok: false,
      message: "End time must be after the start time.",
    };
  }

  const result = await createPublicBookingRequest({
    resourceSlug: parsed.data.resourceSlug,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone.replace(/\s/g, ""),
    startTime,
    endTime,
    note: parsed.data.note || null,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: getBookingRequestErrorMessage(result.reason),
    };
  }

  return {
    ok: true,
    message:
      "Booking request sent. The business will confirm it before the reservation becomes final.",
  };
}
