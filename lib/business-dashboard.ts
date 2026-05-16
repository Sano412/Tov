import "server-only";

import { prisma } from "@/lib/prisma";
import type { MockBusinessOwner } from "@/lib/auth/guards";

type DashboardBooking = {
  id: string;
  customerName: string;
  customerPhone: string;
  startTime: Date;
  endTime: Date;
  status: string;
  note: string | null;
  resourceName: string;
  branchName: string;
  pricePerHour: number;
};

type DashboardResource = {
  id: string;
  name: string;
  status: string;
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number;
  branchName: string;
};

function getUlaanbaatarDateParts(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTodayRange() {
  const today = getUlaanbaatarDateParts();
  const tomorrow = new Date(`${today}T00:00:00+08:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    start: new Date(`${today}T00:00:00+08:00`),
    end: tomorrow,
  };
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

function mapBooking(booking: {
  id: string;
  customerName: string;
  customerPhone: string;
  startTime: Date;
  endTime: Date;
  status: string;
  note: string | null;
  resource: {
    name: string;
    pricePerHour: number;
    branch: {
      name: string;
    };
  };
}): DashboardBooking {
  return {
    id: booking.id,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    note: booking.note,
    resourceName: booking.resource.name,
    branchName: booking.resource.branch.name,
    pricePerHour: booking.resource.pricePerHour,
  };
}

function mapResource(resource: {
  id: string;
  name: string;
  status: string;
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number;
  branch: {
    name: string;
  };
}): DashboardResource {
  return {
    id: resource.id,
    name: resource.name,
    status: resource.status,
    capacityMin: resource.capacityMin,
    capacityMax: resource.capacityMax,
    pricePerHour: resource.pricePerHour,
    branchName: resource.branch.name,
  };
}

function getHours(startTime: Date, endTime: Date) {
  return Math.max(0, (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60);
}

export async function getBusinessDashboard(owner: MockBusinessOwner) {
  const business = await prisma.business.findUnique({
    where: {
      slug: owner.businessSlug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      branches: {
        select: {
          id: true,
          name: true,
          district: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!business) {
    return null;
  }

  const todayRange = getTodayRange();
  const now = new Date();
  const businessResourceScope = {
    resource: {
      branch: {
        businessId: business.id,
      },
    },
  };

  const [todayBookings, pendingBookings, activeResources, overlappingConfirmed] =
    await Promise.all([
      prisma.booking.findMany({
        where: {
          ...businessResourceScope,
          startTime: {
            gte: todayRange.start,
            lt: todayRange.end,
          },
        },
        include: {
          resource: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
        take: 24,
      }),
      prisma.booking.findMany({
        where: {
          ...businessResourceScope,
          status: "PENDING",
        },
        include: {
          resource: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
      }),
      prisma.resource.findMany({
        where: {
          branch: {
            businessId: business.id,
          },
        },
        include: {
          branch: true,
        },
        orderBy: {
          name: "asc",
        },
        take: 24,
      }),
      prisma.booking.findMany({
        where: {
          ...businessResourceScope,
          status: "CONFIRMED",
          startTime: {
            lte: now,
          },
          endTime: {
            gt: now,
          },
        },
        select: {
          resourceId: true,
        },
      }),
    ]);

  const activeResourceRows = activeResources.filter((resource) => resource.status === "ACTIVE");
  const unavailableResourceIds = new Set(
    overlappingConfirmed.map((booking) => booking.resourceId),
  );
  const availableResourcesNow = activeResourceRows.filter(
    (resource) => !unavailableResourceIds.has(resource.id),
  );
  const confirmedToday = todayBookings.filter((booking) => booking.status === "CONFIRMED");
  const estimatedRevenue = confirmedToday.reduce((sum, booking) => {
    return sum + getHours(booking.startTime, booking.endTime) * booking.resource.pricePerHour;
  }, 0);
  const extensionBlockedBooking = confirmedToday[0] ?? null;

  return {
    business,
    generatedAtLabel: formatTime(now),
    todayBookings: todayBookings.map(mapBooking),
    pendingBookings: pendingBookings.map(mapBooking),
    resources: activeResources.map(mapResource),
    availableResourcesNow: availableResourcesNow.map(mapResource),
    estimatedRevenue,
    extensionBlockedExample: extensionBlockedBooking
      ? {
          resourceName: extensionBlockedBooking.resource.name,
          currentEndTime: formatTime(extensionBlockedBooking.endTime),
          nextStartTime: formatTime(extensionBlockedBooking.endTime),
        }
      : null,
  };
}
