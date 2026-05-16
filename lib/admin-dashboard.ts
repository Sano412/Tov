import "server-only";

import { prisma } from "@/lib/prisma";
import type { MockSuperAdmin } from "@/lib/auth/guards";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

export async function getAdminDashboard(_admin: MockSuperAdmin) {
  const [
    businessCount,
    branchCount,
    resourceCount,
    bookingCount,
    pendingBusinesses,
    categories,
    recentBookings,
    featuredResources,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.branch.count(),
    prisma.resource.count(),
    prisma.booking.count(),
    prisma.business.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      take: 12,
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            resources: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        resource: {
          include: {
            branch: {
              include: {
                business: true,
              },
            },
          },
        },
      },
    }),
    prisma.resource.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
      include: {
        branch: {
          include: {
            business: true,
          },
        },
      },
    }),
  ]);

  const confirmedBookings = recentBookings.filter((booking) => booking.status === "CONFIRMED");
  const pendingBookings = recentBookings.filter((booking) => booking.status === "PENDING");

  return {
    generatedAtLabel: formatTime(new Date()),
    stats: {
      businesses: businessCount,
      branches: branchCount,
      resources: resourceCount,
      bookings: bookingCount,
    },
    pendingBusinesses,
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      resourceCount: category._count.resources,
    })),
    recentBookings: recentBookings.map((booking) => ({
      id: booking.id,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      status: booking.status,
      createdAt: booking.createdAt,
      resourceName: booking.resource.name,
      branchName: booking.resource.branch.name,
      businessName: booking.resource.branch.business.name,
    })),
    featuredResources: featuredResources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      slug: resource.slug,
      status: resource.status,
      businessName: resource.branch.business.name,
      branchName: resource.branch.name,
    })),
    analyticsPreview: {
      confirmedBookingShare:
        recentBookings.length > 0
          ? Math.round((confirmedBookings.length / recentBookings.length) * 100)
          : 0,
      pendingBookingShare:
        recentBookings.length > 0
          ? Math.round((pendingBookings.length / recentBookings.length) * 100)
          : 0,
      activeResourceShare:
        resourceCount > 0
          ? Math.round((featuredResources.length / resourceCount) * 100)
          : 0,
    },
  };
}
