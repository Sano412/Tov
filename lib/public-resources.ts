import "server-only";

import { prisma } from "@/lib/prisma";
import {
  getBranchById,
  getBusinessById,
  getSimilarResources as getMockSimilarResources,
  resources as mockResources,
  type Resource as MockResource,
} from "@/lib/mock-data";

export type PublicResource = {
  id: string;
  slug: string;
  name: string;
  description: string;
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number;
  imageUrl: string | null;
  status: string;
  isFeatured: boolean;
  availableNow: boolean;
  availableSlots: string[];
  bookedSlots: string[];
  branch: {
    name: string;
    district: string;
    address: string;
    openTime?: string;
    closeTime?: string;
    bufferMinutes?: number;
    businessName?: string;
  };
  category: {
    name: string;
    slug: string;
  };
};

export type PublicResourceFilters = {
  district?: string;
  capacity?: number;
  maxPrice?: number;
  features?: string[];
  limit?: number;
};

type ResourceWithRelations = {
  id: string;
  slug: string;
  name: string;
  description: string;
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number;
  imageUrl: string | null;
  status: string;
  isFeatured: boolean;
  branch: {
    name: string;
    district: string;
    address: string;
    openTime: string;
    closeTime: string;
    bufferMinutes: number;
    business: {
      name: string;
      status: string;
    };
  };
  category: {
    name: string;
    slug: string;
  };
  bookings: {
    startTime: Date;
    status: string;
  }[];
};

const defaultSlots = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const publicResourceLimitMax = 24;
const featuredResourceLimitMax = 6;

const publicResourceWhere = {
  status: "ACTIVE",
  branch: {
    business: {
      status: "APPROVED",
    },
  },
};

const resourceInclude = {
  branch: {
    include: {
      business: {
        select: {
          name: true,
          status: true,
        },
      },
    },
  },
  category: true,
  bookings: {
    where: {
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    orderBy: {
      startTime: "asc" as const,
    },
    take: 8,
  },
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

function mapDbResource(resource: ResourceWithRelations): PublicResource {
  const bookedSlots = resource.bookings
    .filter((booking) => booking.status === "CONFIRMED")
    .map((booking) => formatTime(booking.startTime));
  const availableSlots = defaultSlots.filter((slot) => !bookedSlots.includes(slot)).slice(0, 4);

  return {
    id: resource.id,
    slug: resource.slug,
    name: resource.name,
    description: resource.description,
    capacityMin: resource.capacityMin,
    capacityMax: resource.capacityMax,
    pricePerHour: resource.pricePerHour,
    imageUrl: resource.imageUrl,
    status: resource.status,
    isFeatured: resource.isFeatured,
    availableNow: resource.status === "ACTIVE" && availableSlots.length > 0,
    availableSlots,
    bookedSlots,
    branch: {
      name: resource.branch.name,
      district: resource.branch.district,
      address: resource.branch.address,
      openTime: resource.branch.openTime,
      closeTime: resource.branch.closeTime,
      bufferMinutes: resource.branch.bufferMinutes,
      businessName: resource.branch.business.name,
    },
    category: {
      name: resource.category.name,
      slug: resource.category.slug,
    },
  };
}

function mapMockResource(resource: MockResource): PublicResource {
  const branch = getBranchById(resource.branchId);
  const business = getBusinessById(resource.businessId);

  return {
    id: resource.id,
    slug: resource.slug,
    name: resource.name,
    description: resource.description,
    capacityMin: resource.capacityMin,
    capacityMax: resource.capacityMax,
    pricePerHour: resource.pricePerHour,
    imageUrl: null,
    status: "ACTIVE",
    isFeatured: true,
    availableNow: resource.availableNow,
    availableSlots: resource.availableSlots,
    bookedSlots: resource.bookedSlots,
    branch: {
      name: branch?.name ?? "Tovlo branch",
      district: branch?.district ?? "Ulaanbaatar",
      address: branch?.address ?? "Mock address",
      businessName: business?.name,
    },
    category: {
      name: "Karaoke",
      slug: "karaoke",
    },
  };
}

function clampLimit(limit: number, max: number) {
  if (!Number.isFinite(limit)) {
    return max;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), max);
}

function normalizeFeature(feature: string) {
  return feature.trim().toLowerCase();
}

function resourceMatchesFilters(resource: PublicResource, filters: PublicResourceFilters) {
  if (filters.district && resource.branch.district !== filters.district) {
    return false;
  }

  if (
    typeof filters.capacity === "number" &&
    (filters.capacity < resource.capacityMin || filters.capacity > resource.capacityMax)
  ) {
    return false;
  }

  if (typeof filters.maxPrice === "number" && resource.pricePerHour > filters.maxPrice) {
    return false;
  }

  const features = filters.features?.map(normalizeFeature) ?? [];

  if (features.includes("open-now") && !resource.availableNow) {
    return false;
  }

  return true;
}

export async function getFeaturedPublicResources(limit = 6) {
  const safeLimit = clampLimit(limit, featuredResourceLimitMax);
  const resources = await prisma.resource.findMany({
    where: {
      ...publicResourceWhere,
      isFeatured: true,
    },
    include: resourceInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: safeLimit,
  });

  return resources.length > 0
    ? resources.map(mapDbResource)
    : mockResources.slice(0, safeLimit).map(mapMockResource);
}

export async function getPublicResources(filtersOrLimit: PublicResourceFilters | number = 24) {
  const filters =
    typeof filtersOrLimit === "number" ? { limit: filtersOrLimit } : filtersOrLimit;
  const safeLimit = clampLimit(filters.limit ?? 24, publicResourceLimitMax);
  const resources = await prisma.resource.findMany({
    where: {
      ...publicResourceWhere,
      branch: {
        district: filters.district,
        business: {
          status: "APPROVED",
        },
      },
      capacityMin:
        typeof filters.capacity === "number"
          ? {
              lte: filters.capacity,
            }
          : undefined,
      capacityMax:
        typeof filters.capacity === "number"
          ? {
              gte: filters.capacity,
            }
          : undefined,
      pricePerHour:
        typeof filters.maxPrice === "number"
          ? {
              lte: filters.maxPrice,
            }
          : undefined,
    },
    include: resourceInclude,
    orderBy: [
      {
        isFeatured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: safeLimit,
  });

  const mappedResources =
    resources.length > 0
      ? resources.map(mapDbResource)
      : mockResources.slice(0, safeLimit).map(mapMockResource);

  return mappedResources.filter((resource) => resourceMatchesFilters(resource, filters));
}

export async function getPublicDistricts() {
  const branches = await prisma.branch.findMany({
    where: {
      business: {
        status: "APPROVED",
      },
    },
    distinct: ["district"],
    orderBy: {
      district: "asc",
    },
    select: {
      district: true,
    },
    take: 24,
  });

  if (branches.length > 0) {
    return branches.map((branch) => branch.district);
  }

  return Array.from(
    new Set(
      mockResources
        .map((resource) => getBranchById(resource.branchId)?.district)
        .filter((district): district is string => Boolean(district)),
    ),
  );
}

export async function getPublicResourceBySlug(slug: string) {
  const resource = await prisma.resource.findFirst({
    where: {
      ...publicResourceWhere,
      slug,
    },
    include: resourceInclude,
  });

  if (resource) {
    return mapDbResource(resource);
  }

  const mockResource = mockResources.find((item) => item.slug === slug);
  return mockResource ? mapMockResource(mockResource) : null;
}

export async function getSimilarPublicResources(resource: PublicResource, limit = 3) {
  const safeLimit = clampLimit(limit, 6);
  const resources = await prisma.resource.findMany({
    where: {
      ...publicResourceWhere,
      slug: {
        not: resource.slug,
      },
      category: {
        slug: resource.category.slug,
      },
    },
    include: resourceInclude,
    orderBy: {
      isFeatured: "desc",
    },
    take: safeLimit,
  });

  if (resources.length > 0) {
    return resources.map(mapDbResource);
  }

  const mockResource = mockResources.find((item) => item.slug === resource.slug);
  return mockResource
    ? getMockSimilarResources(mockResource).slice(0, safeLimit).map(mapMockResource)
    : [];
}

export async function getPublicResourceSlugs() {
  const resources = await prisma.resource.findMany({
    where: publicResourceWhere,
    select: {
      slug: true,
    },
    take: 100,
  });

  return resources.length > 0
    ? resources.map((resource) => resource.slug)
    : mockResources.map((resource) => resource.slug);
}
