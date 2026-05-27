import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type BookingRequestInput = {
  resourceSlug: string;
  customerName: string;
  customerPhone: string;
  startTime: Date;
  endTime: Date;
  note?: string | null;
};

export type BusinessBookingDecision = "CONFIRM" | "REJECT";

type BookingOverlapClient = Pick<Prisma.TransactionClient, "booking">;

const ulaanbaatarDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function createUlaanbaatarDate(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`);
}

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime());
}

function isValidInterval(startTime: Date, endTime: Date) {
  return isValidDate(startTime) && isValidDate(endTime) && endTime > startTime;
}

function getUlaanbaatarDate(date: Date) {
  return ulaanbaatarDateFormatter.format(date);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function isWithinOneBusinessDay({
  startTime,
  endTime,
  businessDate,
  openTime,
  closeTime,
}: {
  startTime: Date;
  endTime: Date;
  businessDate: string;
  openTime: string;
  closeTime: string;
}) {
  const openAt = createUlaanbaatarDate(businessDate, openTime);
  let closeAt = createUlaanbaatarDate(businessDate, closeTime);

  if (closeAt <= openAt) {
    closeAt = addDays(closeAt, 1);
  }

  return startTime >= openAt && endTime <= closeAt;
}

function isWithinBranchHours({
  startTime,
  endTime,
  openTime,
  closeTime,
}: {
  startTime: Date;
  endTime: Date;
  openTime: string;
  closeTime: string;
}) {
  const startDate = getUlaanbaatarDate(startTime);
  const previousDate = getUlaanbaatarDate(addDays(createUlaanbaatarDate(startDate, "00:00"), -1));

  return [startDate, previousDate].some((businessDate) =>
    isWithinOneBusinessDay({
      startTime,
      endTime,
      businessDate,
      openTime,
      closeTime,
    }),
  );
}

async function findConfirmedBookingOverlapForClient(
  client: BookingOverlapClient,
  {
    resourceId,
    startTime,
    endTime,
    excludeBookingId,
  }: {
    resourceId: string;
    startTime: Date;
    endTime: Date;
    excludeBookingId?: string;
  },
) {
  return client.booking.findFirst({
    where: {
      id: excludeBookingId
        ? {
            not: excludeBookingId,
          }
        : undefined,
      resourceId,
      status: "CONFIRMED",
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });
}

export async function findConfirmedBookingOverlap({
  resourceId,
  startTime,
  endTime,
}: {
  resourceId: string;
  startTime: Date;
  endTime: Date;
}) {
  return findConfirmedBookingOverlapForClient(prisma, {
    resourceId,
    startTime,
    endTime,
  });
}

export async function createPublicBookingRequest(input: BookingRequestInput) {
  if (!isValidInterval(input.startTime, input.endTime)) {
    return {
      ok: false as const,
      reason: "INVALID_INTERVAL" as const,
    };
  }

  if (input.startTime <= new Date()) {
    return {
      ok: false as const,
      reason: "START_IN_PAST" as const,
    };
  }

  return prisma.$transaction(async (tx) => {
    const resource = await tx.resource.findFirst({
      where: {
        slug: input.resourceSlug,
        status: "ACTIVE",
        branch: {
          business: {
            status: "APPROVED",
          },
        },
      },
      select: {
        id: true,
        branch: {
          select: {
            openTime: true,
            closeTime: true,
          },
        },
      },
    });

    if (!resource) {
      return {
        ok: false as const,
        reason: "RESOURCE_UNAVAILABLE" as const,
      };
    }

    if (
      !isWithinBranchHours({
        startTime: input.startTime,
        endTime: input.endTime,
        openTime: resource.branch.openTime,
        closeTime: resource.branch.closeTime,
      })
    ) {
      return {
        ok: false as const,
        reason: "OUTSIDE_BRANCH_HOURS" as const,
      };
    }

    const overlap = await findConfirmedBookingOverlapForClient(tx, {
      resourceId: resource.id,
      startTime: input.startTime,
      endTime: input.endTime,
    });

    if (overlap) {
      return {
        ok: false as const,
        reason: "CONFIRMED_OVERLAP" as const,
      };
    }

    const booking = await tx.booking.create({
      data: {
        resourceId: resource.id,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        startTime: input.startTime,
        endTime: input.endTime,
        status: "PENDING",
        note: input.note || null,
      },
      select: {
        id: true,
      },
    });

    return {
      ok: true as const,
      bookingId: booking.id,
    };
  });
}

export async function decideBusinessBooking({
  bookingId,
  businessSlug,
  decision,
}: {
  bookingId: string;
  businessSlug: string;
  decision: BusinessBookingDecision;
}) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: {
        id: bookingId,
        resource: {
          branch: {
            business: {
              slug: businessSlug,
            },
          },
        },
      },
      select: {
        id: true,
        resourceId: true,
        startTime: true,
        endTime: true,
        status: true,
        resource: {
          select: {
            status: true,
            branch: {
              select: {
                openTime: true,
                closeTime: true,
                business: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return {
        ok: false as const,
        reason: "NOT_FOUND" as const,
      };
    }

    if (booking.status !== "PENDING") {
      return {
        ok: false as const,
        reason: "NOT_PENDING" as const,
      };
    }

    if (decision === "REJECT") {
      const updated = await tx.booking.updateMany({
        where: {
          id: booking.id,
          status: "PENDING",
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (updated.count !== 1) {
        return {
          ok: false as const,
          reason: "NOT_PENDING" as const,
        };
      }

      return {
        ok: true as const,
        status: "CANCELLED" as const,
      };
    }

    if (!isValidInterval(booking.startTime, booking.endTime)) {
      return {
        ok: false as const,
        reason: "INVALID_INTERVAL" as const,
      };
    }

    if (
      booking.resource.status !== "ACTIVE" ||
      booking.resource.branch.business.status !== "APPROVED"
    ) {
      return {
        ok: false as const,
        reason: "RESOURCE_UNAVAILABLE" as const,
      };
    }

    if (
      !isWithinBranchHours({
        startTime: booking.startTime,
        endTime: booking.endTime,
        openTime: booking.resource.branch.openTime,
        closeTime: booking.resource.branch.closeTime,
      })
    ) {
      return {
        ok: false as const,
        reason: "OUTSIDE_BRANCH_HOURS" as const,
      };
    }

    const overlap = await findConfirmedBookingOverlapForClient(tx, {
      resourceId: booking.resourceId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      excludeBookingId: booking.id,
    });

    if (overlap) {
      return {
        ok: false as const,
        reason: "CONFIRMED_OVERLAP" as const,
      };
    }

    const updated = await tx.booking.updateMany({
      where: {
        id: booking.id,
        status: "PENDING",
      },
      data: {
        status: "CONFIRMED",
      },
    });

    if (updated.count !== 1) {
      return {
        ok: false as const,
        reason: "NOT_PENDING" as const,
      };
    }

    return {
      ok: true as const,
      status: "CONFIRMED" as const,
    };
  });
}
