const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const karaokeCategory = await prisma.category.upsert({
    where: { slug: "karaoke" },
    update: {},
    create: {
      name: "Karaoke",
      slug: "karaoke",
    },
  });

  const amberBusiness = await prisma.business.upsert({
    where: { slug: "amber-karaoke" },
    update: {
      name: "Amber Karaoke",
      status: "APPROVED",
    },
    create: {
      name: "Amber Karaoke",
      slug: "amber-karaoke",
      status: "APPROVED",
    },
  });

  const goldenBusiness = await prisma.business.upsert({
    where: { slug: "golden-stage" },
    update: {
      name: "Golden Stage",
      status: "APPROVED",
    },
    create: {
      name: "Golden Stage",
      slug: "golden-stage",
      status: "APPROVED",
    },
  });

  const seoulBranch = await prisma.branch.upsert({
    where: { id: "branch-seoul" },
    update: {
      businessId: amberBusiness.id,
      name: "Seoul Street",
      district: "Sukhbaatar",
      address: "Seoul Street, 3rd khoroo",
      openTime: "12:00",
      closeTime: "02:00",
      bufferMinutes: 15,
    },
    create: {
      id: "branch-seoul",
      businessId: amberBusiness.id,
      name: "Seoul Street",
      district: "Sukhbaatar",
      address: "Seoul Street, 3rd khoroo",
      openTime: "12:00",
      closeTime: "02:00",
      bufferMinutes: 15,
    },
  });

  const khanUulBranch = await prisma.branch.upsert({
    where: { id: "branch-khan-uul" },
    update: {
      businessId: goldenBusiness.id,
      name: "Khan-Uul",
      district: "Khan-Uul",
      address: "Naadamchid Road, 15th khoroo",
      openTime: "11:00",
      closeTime: "03:00",
      bufferMinutes: 20,
    },
    create: {
      id: "branch-khan-uul",
      businessId: goldenBusiness.id,
      name: "Khan-Uul",
      district: "Khan-Uul",
      address: "Naadamchid Road, 15th khoroo",
      openTime: "11:00",
      closeTime: "03:00",
      bufferMinutes: 20,
    },
  });

  const resourceSeeds = [
    {
      branchId: seoulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Amber Room",
      slug: "amber-room",
      description:
        "Warm private karaoke room for friends, small celebrations, and late-night sessions.",
      capacityMin: 6,
      capacityMax: 8,
      pricePerHour: 45000,
      imageUrl: "/images/resources/amber-room.jpg",
      status: "ACTIVE",
      isFeatured: true,
    },
    {
      branchId: khanUulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Golden Stage",
      slug: "golden-stage",
      description: "Large stage-style karaoke room with premium lighting and group seating.",
      capacityMin: 10,
      capacityMax: 12,
      pricePerHour: 65000,
      imageUrl: "/images/resources/golden-stage.jpg",
      status: "ACTIVE",
      isFeatured: true,
    },
    {
      branchId: seoulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Velvet Lounge",
      slug: "velvet-lounge",
      description: "Compact central karaoke room with comfortable lounge seating.",
      capacityMin: 4,
      capacityMax: 6,
      pricePerHour: 38000,
      imageUrl: "/images/resources/velvet-lounge.jpg",
      status: "ACTIVE",
      isFeatured: true,
    },
    {
      branchId: seoulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Citrus Suite",
      slug: "citrus-suite",
      description: "Orange-glow karaoke room for medium groups and relaxed sessions.",
      capacityMin: 8,
      capacityMax: 10,
      pricePerHour: 52000,
      imageUrl: "/images/resources/citrus-suite.jpg",
      status: "ACTIVE",
      isFeatured: false,
    },
    {
      branchId: khanUulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Moon Booth",
      slug: "moon-booth",
      description: "Small room for duets, couples, and quick after-work karaoke.",
      capacityMin: 2,
      capacityMax: 4,
      pricePerHour: 32000,
      imageUrl: "/images/resources/moon-booth.jpg",
      status: "ACTIVE",
      isFeatured: false,
    },
    {
      branchId: khanUulBranch.id,
      categoryId: karaokeCategory.id,
      name: "Sunset Hall",
      slug: "sunset-hall",
      description: "Large event-style karaoke room reserved for future availability.",
      capacityMin: 12,
      capacityMax: 16,
      pricePerHour: 78000,
      imageUrl: "/images/resources/sunset-hall.jpg",
      status: "INACTIVE",
      isFeatured: false,
    },
  ];

  const seededResources = [];

  for (const resource of resourceSeeds) {
    const seededResource = await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: resource,
      create: resource,
    });

    seededResources.push(seededResource);
  }

  const [amberRoom, goldenStage, velvetLounge] = seededResources;

  await prisma.booking.upsert({
    where: { id: "booking-amber-confirmed-1" },
    update: {
      resourceId: amberRoom.id,
      customerName: "Bat",
      customerPhone: "99112233",
      startTime: new Date("2026-05-16T19:00:00+08:00"),
      endTime: new Date("2026-05-16T21:00:00+08:00"),
      status: "CONFIRMED",
      note: "Birthday gathering",
    },
    create: {
      id: "booking-amber-confirmed-1",
      resourceId: amberRoom.id,
      customerName: "Bat",
      customerPhone: "99112233",
      startTime: new Date("2026-05-16T19:00:00+08:00"),
      endTime: new Date("2026-05-16T21:00:00+08:00"),
      status: "CONFIRMED",
      note: "Birthday gathering",
    },
  });

  await prisma.booking.upsert({
    where: { id: "booking-golden-pending-1" },
    update: {
      resourceId: goldenStage.id,
      customerName: "Saruul",
      customerPhone: "88114455",
      startTime: new Date("2026-05-16T20:00:00+08:00"),
      endTime: new Date("2026-05-16T22:00:00+08:00"),
      status: "PENDING",
      note: "Group of 10",
    },
    create: {
      id: "booking-golden-pending-1",
      resourceId: goldenStage.id,
      customerName: "Saruul",
      customerPhone: "88114455",
      startTime: new Date("2026-05-16T20:00:00+08:00"),
      endTime: new Date("2026-05-16T22:00:00+08:00"),
      status: "PENDING",
      note: "Group of 10",
    },
  });

  await prisma.booking.upsert({
    where: { id: "booking-velvet-confirmed-1" },
    update: {
      resourceId: velvetLounge.id,
      customerName: "Nomin",
      customerPhone: "99001122",
      startTime: new Date("2026-05-17T18:30:00+08:00"),
      endTime: new Date("2026-05-17T20:30:00+08:00"),
      status: "CONFIRMED",
      note: null,
    },
    create: {
      id: "booking-velvet-confirmed-1",
      resourceId: velvetLounge.id,
      customerName: "Nomin",
      customerPhone: "99001122",
      startTime: new Date("2026-05-17T18:30:00+08:00"),
      endTime: new Date("2026-05-17T20:30:00+08:00"),
      status: "CONFIRMED",
      note: null,
    },
  });

  console.log("Seeded Tovlo local MVP data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
