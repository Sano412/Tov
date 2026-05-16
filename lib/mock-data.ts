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
    name: "Сөүлийн гудамж",
    district: "Сүхбаатар",
    address: "Сөүлийн гудамж, 3-р хороо",
  },
  {
    id: "branch-khan-uul",
    businessId: "business-golden",
    name: "Хан-Уул",
    district: "Хан-Уул",
    address: "Наадамчдын зам, 15-р хороо",
  },
  {
    id: "branch-ikh-toiruu",
    businessId: "business-velvet",
    name: "Их тойруу",
    district: "Чингэлтэй",
    address: "Их тойруу, 5-р хороо",
  },
  {
    id: "branch-bayan-zurkh",
    businessId: "business-amber",
    name: "Баянзүрх",
    district: "Баянзүрх",
    address: "Энхтайваны өргөн чөлөө",
  },
];

export const resources: Resource[] = [
  {
    id: "resource-amber-room",
    slug: "amber-room",
    name: "Amber Room",
    categoryId: "cat-karaoke",
    businessId: "business-amber",
    branchId: "branch-seoul",
    capacityMin: 6,
    capacityMax: 8,
    pricePerHour: 45000,
    availableNow: true,
    description:
      "Дулаан гэрэлтэй, найзуудын жижиг уулзалтад тохиромжтой karaoke өрөө.",
    highlights: ["Private room", "Premium sound", "Snack menu"],
    availableSlots: ["18:00", "20:00", "22:00"],
    bookedSlots: ["19:00", "21:00"],
  },
  {
    id: "resource-golden-stage",
    slug: "golden-stage",
    name: "Golden Stage",
    categoryId: "cat-karaoke",
    businessId: "business-golden",
    branchId: "branch-khan-uul",
    capacityMin: 10,
    capacityMax: 12,
    pricePerHour: 65000,
    availableNow: false,
    description:
      "Том багтаамжтай, төрсөн өдөр болон багийн үдэшт тохирох тайзтай өрөө.",
    highlights: ["Large room", "Stage lighting", "Event friendly"],
    availableSlots: ["17:00", "19:00", "23:00"],
    bookedSlots: ["20:00", "21:00"],
  },
  {
    id: "resource-velvet-lounge",
    slug: "velvet-lounge",
    name: "Velvet Lounge",
    categoryId: "cat-karaoke",
    businessId: "business-velvet",
    branchId: "branch-ikh-toiruu",
    capacityMin: 4,
    capacityMax: 6,
    pricePerHour: 38000,
    availableNow: true,
    description:
      "Хотын төвд байрлах, тухтай суудалтай compact karaoke өрөө.",
    highlights: ["Central location", "Cozy seating", "Late hours"],
    availableSlots: ["18:30", "20:30", "22:30"],
    bookedSlots: ["19:30"],
  },
  {
    id: "resource-citrus-suite",
    slug: "citrus-suite",
    name: "Citrus Suite",
    categoryId: "cat-karaoke",
    businessId: "business-amber",
    branchId: "branch-bayan-zurkh",
    capacityMin: 8,
    capacityMax: 10,
    pricePerHour: 52000,
    availableNow: true,
    description:
      "Orange glow интерьер, дунд хэмжээний group-д зориулсан karaoke өрөө.",
    highlights: ["Warm interior", "Group seating", "Easy parking"],
    availableSlots: ["16:00", "18:00", "21:00"],
    bookedSlots: ["20:00"],
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
