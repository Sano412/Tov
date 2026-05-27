export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Business = {
  id: string;
  name: string;
};

export type Branch = {
  id: string;
  businessId: string;
  name: string;
  district: string;
  address: string;
};

export type Booking = {
  id: string;
  resourceId: string;
  startsAt: string;
  endsAt: string;
  status: "pending" | "confirmed" | "cancelled";
};

export type Resource = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  businessId: string;
  branchId: string;
  capacityMin: number;
  capacityMax: number;
  pricePerHour: number;
  availableNow: boolean;
  description: string;
  highlights: string[];
  availableSlots: string[];
  bookedSlots: string[];
};

export const categories: Category[] = [
  {
    id: "cat-karaoke",
    name: "Karaoke room",
    slug: "karaoke",
  },
];

export const businesses: Business[] = [
  {
    id: "business-amber",
    name: "Amber Karaoke",
  },
  {
    id: "business-golden",
    name: "Golden Stage",
  },
  {
    id: "business-velvet",
    name: "Velvet Lounge",
  },
];

export const branches: Branch[] = [
  {
    id: "branch-seoul",
    businessId: "business-amber",
    name: "Seoul Street",
    district: "Sukhbaatar",
    address: "Seoul Street, 3rd khoroo",
  },
  {
    id: "branch-khan-uul",
    businessId: "business-golden",
    name: "Khan-Uul",
    district: "Khan-Uul",
    address: "Naadamchid Road, 15th khoroo",
  },
  {
    id: "branch-ikh-toiruu",
    businessId: "business-velvet",
    name: "Ikh Toiruu",
    district: "Chingeltei",
    address: "Ikh Toiruu, 5th khoroo",
  },
  {
    id: "branch-bayan-zurkh",
    businessId: "business-amber",
    name: "Bayanzurkh",
    district: "Bayanzurkh",
    address: "Peace Avenue",
  },
];

export const resources: Resource[] = [
  {
    id: "resource-amber-room",
    slug: "amber-room",
    name: "Golden VIP Room",
    categoryId: "cat-karaoke",
    businessId: "business-amber",
    branchId: "branch-seoul",
    capacityMin: 8,
    capacityMax: 12,
    pricePerHour: 80000,
    availableNow: true,
    description:
      "Warm VIP karaoke room for friends, small celebrations, and private late-night sessions.",
    highlights: ["VIP", "Premium sound", "Private room"],
    availableSlots: ["18:00", "20:00", "22:00"],
    bookedSlots: ["19:00", "21:00"],
  },
  {
    id: "resource-golden-stage",
    slug: "golden-stage",
    name: "Party Room",
    categoryId: "cat-karaoke",
    businessId: "business-golden",
    branchId: "branch-khan-uul",
    capacityMin: 10,
    capacityMax: 14,
    pricePerHour: 90000,
    availableNow: false,
    description:
      "Large stage-style karaoke room for birthdays, team nights, and bigger groups.",
    highlights: ["Large room", "Stage lighting", "Food service"],
    availableSlots: ["17:00", "19:00", "23:00"],
    bookedSlots: ["20:00", "21:00"],
  },
  {
    id: "resource-velvet-lounge",
    slug: "velvet-lounge",
    name: "Cozy Room",
    categoryId: "cat-karaoke",
    businessId: "business-velvet",
    branchId: "branch-ikh-toiruu",
    capacityMin: 4,
    capacityMax: 6,
    pricePerHour: 45000,
    availableNow: true,
    description:
      "Compact central karaoke room with comfortable seating and a quieter lounge feel.",
    highlights: ["Small room", "Central location", "Late hours"],
    availableSlots: ["18:30", "20:30", "22:30"],
    bookedSlots: ["19:30"],
  },
  {
    id: "resource-citrus-suite",
    slug: "citrus-suite",
    name: "Duet Room",
    categoryId: "cat-karaoke",
    businessId: "business-amber",
    branchId: "branch-bayan-zurkh",
    capacityMin: 2,
    capacityMax: 4,
    pricePerHour: 38000,
    availableNow: true,
    description:
      "Small orange-glow karaoke room for couples, duets, and quick after-work sessions.",
    highlights: ["Duet", "Warm interior", "Easy parking"],
    availableSlots: ["16:00", "18:00", "21:00"],
    bookedSlots: ["20:00"],
  },
  {
    id: "resource-family-stage",
    slug: "family-stage",
    name: "Family Stage",
    categoryId: "cat-karaoke",
    businessId: "business-golden",
    branchId: "branch-seoul",
    capacityMin: 6,
    capacityMax: 10,
    pricePerHour: 70000,
    availableNow: true,
    description: "Relaxed group room for family gatherings and friendly karaoke nights.",
    highlights: ["Group room", "Food service", "Private room"],
    availableSlots: ["18:00", "21:00", "23:00"],
    bookedSlots: ["20:00"],
  },
  {
    id: "resource-sky-lounge",
    slug: "sky-lounge",
    name: "Sky Lounge",
    categoryId: "cat-karaoke",
    businessId: "business-velvet",
    branchId: "branch-khan-uul",
    capacityMin: 8,
    capacityMax: 12,
    pricePerHour: 85000,
    availableNow: true,
    description: "Evening lounge room with city-view energy and premium sound.",
    highlights: ["VIP", "Near me", "Premium sound"],
    availableSlots: ["19:00", "20:00", "22:00"],
    bookedSlots: ["21:00"],
  },
];

export const bookings: Booking[] = [
  {
    id: "booking-1",
    resourceId: "resource-amber-room",
    startsAt: "2026-05-16T19:00:00+08:00",
    endsAt: "2026-05-16T20:00:00+08:00",
    status: "confirmed",
  },
  {
    id: "booking-2",
    resourceId: "resource-golden-stage",
    startsAt: "2026-05-16T20:00:00+08:00",
    endsAt: "2026-05-16T22:00:00+08:00",
    status: "confirmed",
  },
];

export function getBranchById(branchId: string) {
  return branches.find((branch) => branch.id === branchId);
}

export function getBusinessById(businessId: string) {
  return businesses.find((business) => business.id === businessId);
}

export function getResourceBySlug(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}

export function getSimilarResources(resource: Resource) {
  return resources
    .filter((item) => item.id !== resource.id && item.categoryId === resource.categoryId)
    .slice(0, 3);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("mn-MN").format(price);
}
