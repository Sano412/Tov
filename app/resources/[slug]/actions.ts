"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type BookingRequestState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const phoneRegex = /^(?:\+976\s?)?[0-9]{8}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const bookingRequestSchema = z.object({
  resourceSlug: z.string().min(1, "Resource олдсонгүй."),
  customerName: z
    .string()
    .trim()
    .min(2, "Нэрээ 2-оос дээш тэмдэгтээр оруулна уу.")
    .max(80, "Нэр хэт урт байна."),
  customerPhone: z
    .string()
    .trim()
    .regex(phoneRegex, "Утасны дугаараа 8 оронтой эсвэл +976 форматаар оруулна уу."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Өдрөө зөв сонгоно уу."),
  startTime: z.string().regex(timeRegex, "Эхлэх цагаа зөв сонгоно уу."),
  durationHours: z.coerce
    .number()
    .int("Үргэлжлэх цаг бүхэл тоо байна.")
    .min(1, "Доод тал нь 1 цаг байна.")
    .max(6, "Одоогоор 6 цагаас урт хүсэлт авахгүй."),
  note: z.string().trim().max(300, "Тэмдэглэл 300 тэмдэгтээс ихгүй байна.").optional(),
});

function createUlaanbaatarDate(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`);
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
      message: "Мэдээллээ шалгаад дахин илгээнэ үү.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const resource = await prisma.resource.findUnique({
    where: {
      slug: parsed.data.resourceSlug,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!resource || resource.status !== "ACTIVE") {
    return {
      ok: false,
      message: "Энэ өрөөнд одоогоор booking request илгээх боломжгүй байна.",
    };
  }

  const startTime = createUlaanbaatarDate(parsed.data.date, parsed.data.startTime);

  if (Number.isNaN(startTime.getTime())) {
    return {
      ok: false,
      message: "Сонгосон өдөр, цаг буруу байна.",
    };
  }

  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + parsed.data.durationHours);

  if (endTime <= startTime) {
    return {
      ok: false,
      message: "Дуусах цаг эхлэх цагаас хойш байх ёстой.",
    };
  }

  await prisma.booking.create({
    data: {
      resourceId: resource.id,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone.replace(/\s/g, ""),
      startTime,
      endTime,
      status: "PENDING",
      note: parsed.data.note || null,
    },
  });

  return {
    ok: true,
    message: "Booking request амжилттай илгээгдлээ. Байгууллага баталгаажуулах хүртэл PENDING төлөвтэй байна.",
  };
}
