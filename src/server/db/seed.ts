import { db } from "./index";
import {
  users, tenants, kostProperties, rooms, facilities,
  propertyFacilities, propertyImages, reviews, notifications,
} from "./schema";
import { v7 as uuidv7 } from "uuid";
import argon2 from "argon2";
import { sql } from "drizzle-orm";

const PASS_ADMIN  = "Password123!";
const PASS_TENANT = "Password123!";
const PASS_USER   = "Password123!";

async function hash(p: string) {
  return argon2.hash(p, { type: argon2.argon2id, memoryCost: 32768, timeCost: 2, parallelism: 1 });
}

async function main() {
  console.log("Clearing existing data...");
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await db.delete(notifications);
  await db.delete(reviews);
  await db.delete(propertyFacilities);
  await db.delete(propertyImages);
  await db.delete(rooms);
  await db.delete(kostProperties);
  await db.delete(facilities);
  await db.delete(tenants);
  await db.delete(users);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
  console.log("✓ Data cleared");

  const adminId   = uuidv7();
  const tenant1Id = uuidv7(); const tenant1UserId = uuidv7();
  const tenant2Id = uuidv7(); const tenant2UserId = uuidv7();
  const tenant3Id = uuidv7(); const tenant3UserId = uuidv7();
  const user1Id   = uuidv7();
  const user2Id   = uuidv7();
  const user3Id   = uuidv7();

  const [hashAdmin, hashTenant, hashUser] = await Promise.all([
    hash(PASS_ADMIN), hash(PASS_TENANT), hash(PASS_USER),
  ]);

  await db.insert(users).values([
    { id: adminId,      name: "Administrator",    email: "admin@simako.web.id",     passwordHash: hashAdmin,  role: "admin",  isVerified: true,  isActive: true },
    { id: tenant1UserId,name: "Budi Santoso",     email: "budi.santoso@email.com",  passwordHash: hashTenant, role: "tenant", isVerified: true,  isActive: true, phone: "081234567801" },
    { id: tenant2UserId,name: "Sri Wahyuningsih", email: "sri.wahyu@email.com",     passwordHash: hashTenant, role: "tenant", isVerified: true,  isActive: true, phone: "081234567802" },
    { id: tenant3UserId,name: "Ahmad Fauzi",      email: "ahmad.fauzi@email.com",   passwordHash: hashTenant, role: "tenant", isVerified: true,  isActive: true, phone: "081234567803" },
    { id: user1Id,      name: "Dewi Rahayu",      email: "dewi.rahayu@email.com",   passwordHash: hashUser,   role: "user",   isVerified: true,  isActive: true, phone: "081234567811" },
    { id: user2Id,      name: "Rizky Pratama",    email: "rizky.pratama@email.com", passwordHash: hashUser,   role: "user",   isVerified: true,  isActive: true, phone: "081234567812" },
    { id: user3Id,      name: "Ayu Lestari",      email: "ayu.lestari@email.com",   passwordHash: hashUser,   role: "user",   isVerified: false, isActive: true, phone: "081234567813" },
  ]);
  console.log("✓ Users created");

  await db.insert(tenants).values([
    { id: tenant1Id, userId: tenant1UserId, businessName: "Kos Bu Budi",      bankName: "BCA",    bankAccount: "1234567890", bankHolder: "Budi Santoso",     isApproved: true },
    { id: tenant2Id, userId: tenant2UserId, businessName: "Kos Sri Sejahtera",bankName: "Mandiri",bankAccount: "0987654321", bankHolder: "Sri Wahyuningsih", isApproved: true },
    { id: tenant3Id, userId: tenant3UserId, businessName: "Villa Kos Fauzi",  bankName: "BRI",    bankAccount: "1122334455", bankHolder: "Ahmad Fauzi",      isApproved: false },
  ]);
  console.log("✓ Tenants created");

  const facIds: Record<string, string> = {};
  const facilityDefs = [
    { slug: "ac",              name: "AC",                  category: "basic",        icon: "Wind" },
    { slug: "fan",             name: "Kipas Angin",          category: "basic",        icon: "Wind" },
    { slug: "bed",             name: "Tempat Tidur",         category: "basic",        icon: "BedDouble" },
    { slug: "wardrobe",        name: "Lemari",               category: "basic",        icon: "Archive" },
    { slug: "desk",            name: "Meja Belajar",         category: "basic",        icon: "Monitor" },
    { slug: "tv",              name: "TV",                   category: "basic",        icon: "Tv" },
    { slug: "refrigerator",    name: "Kulkas",               category: "basic",        icon: "Refrigerator" },
    { slug: "private_wc",      name: "Kamar Mandi Dalam",   category: "bathroom",     icon: "Bath" },
    { slug: "shared_wc",       name: "KM Bersama",          category: "bathroom",     icon: "Bath" },
    { slug: "water_heater",    name: "Water Heater",         category: "bathroom",     icon: "Flame" },
    { slug: "wifi",            name: "WiFi",                 category: "connectivity", icon: "Wifi" },
    { slug: "electricity",     name: "Listrik PLN",          category: "connectivity", icon: "Zap" },
    { slug: "water",           name: "Air PDAM",             category: "connectivity", icon: "Droplets" },
    { slug: "cctv",            name: "CCTV",                 category: "security",     icon: "Camera" },
    { slug: "motor",           name: "Parkir Motor",         category: "parking",      icon: "Bike" },
    { slug: "car",             name: "Parkir Mobil",         category: "parking",      icon: "Car" },
    { slug: "kitchen",         name: "Dapur Bersama",        category: "kitchen",      icon: "UtensilsCrossed" },
    { slug: "laundry",         name: "Laundry",              category: "kitchen",      icon: "WashingMachine" },
    { slug: "breakfast",       name: "Sarapan",              category: "service",      icon: "Coffee" },
    { slug: "cleaning",        name: "Cleaning Service",     category: "service",      icon: "Sparkles" },
  ] as const;

  const facilityRows = facilityDefs.map((f) => {
    const id = uuidv7();
    facIds[f.slug] = id;
    return { id, slug: f.slug, name: f.name, category: f.category as any, icon: f.icon };
  });
  await db.insert(facilities).values(facilityRows);
  console.log("✓ Facilities created");

  const prop1Id = uuidv7();
  const prop2Id = uuidv7();
  const prop3Id = uuidv7();
  const prop4Id = uuidv7();

  await db.insert(kostProperties).values([
    {
      id: prop1Id, tenantId: tenant1Id,
      name: "Kos Melati Indah", slug: "kos-melati-indah",
      description: "Kos nyaman dengan fasilitas lengkap di area strategis Purwokerto Utara. Dekat kampus UNSOED dan pusat kota.",
      address: "Jl. HR Bunyamin No. 45", city: "Purwokerto", district: "Purwokerto Utara",
      kostType: "kost", genderType: "female", isActive: true,
      rules: "1. Tidak membawa tamu menginap\n2. Jam malam pukul 22.00\n3. Menjaga kebersihan bersama",
    },
    {
      id: prop2Id, tenantId: tenant1Id,
      name: "Kos Putra Mandiri", slug: "kos-putra-mandiri",
      description: "Kos putra modern di kawasan Sokanegara. Kamar luas, AC, dan parkir motor tersedia.",
      address: "Jl. Pemuda No. 12", city: "Purwokerto", district: "Sokanegara",
      kostType: "kost", genderType: "male", isActive: true,
      rules: "1. Dilarang membawa tamu wanita\n2. Parkir rapi\n3. Bayar sewa tanggal 1-5",
    },
    {
      id: prop3Id, tenantId: tenant2Id,
      name: "Kos Sejahtera Premium", slug: "kos-sejahtera-premium",
      description: "Kos premium dengan kamar mandi dalam, AC, dan sarapan gratis. Cocok untuk profesional.",
      address: "Jl. Sudirman No. 78", city: "Purwokerto", district: "Purwokerto Selatan",
      kostType: "kost", genderType: "mixed", isActive: true,
      rules: "1. Tamu boleh kunjungan pukul 08.00-21.00\n2. Dilarang merokok di kamar\n3. Sampah dibuang di tempatnya",
    },
    {
      id: prop4Id, tenantId: tenant2Id,
      name: "Guest House Griya Asri", slug: "guest-house-griya-asri",
      description: "Guest house elegan dengan fasilitas hotel. Area parkir luas, dapur bersama, dan taman.",
      address: "Jl. Gerilya No. 99", city: "Purwokerto", district: "Grendeng",
      kostType: "guest_house", genderType: "mixed", isActive: true,
      rules: "1. Check-in minimal 1 bulan\n2. Tamu harus lapor ke pengelola\n3. Hewan peliharaan tidak diizinkan",
    },
  ]);
  console.log("✓ Properties created");

  const roomDefs = [
    { propertyId: prop1Id, roomNumber: "A1", type: "Standard",  pricePerMonth: "750000",  depositAmount: "750000",  size: "3x4m",  floorNumber: 1, status: "available", viewCount: "45", avgRating: "4.50" },
    { propertyId: prop1Id, roomNumber: "A2", type: "Standard",  pricePerMonth: "750000",  depositAmount: "750000",  size: "3x4m",  floorNumber: 1, status: "occupied",  viewCount: "38", avgRating: "4.30" },
    { propertyId: prop1Id, roomNumber: "B1", type: "AC Room",   pricePerMonth: "900000",  depositAmount: "900000",  size: "3x5m",  floorNumber: 2, status: "available", viewCount: "62", avgRating: "4.80" },
    { propertyId: prop1Id, roomNumber: "B2", type: "AC Room",   pricePerMonth: "900000",  depositAmount: "900000",  size: "3x5m",  floorNumber: 2, status: "available", viewCount: "29", avgRating: "0.00" },
    { propertyId: prop2Id, roomNumber: "101",type: "Standard",  pricePerMonth: "650000",  depositAmount: "650000",  size: "3x3m",  floorNumber: 1, status: "available", viewCount: "21", avgRating: "4.20" },
    { propertyId: prop2Id, roomNumber: "102",type: "Standard",  pricePerMonth: "650000",  depositAmount: "650000",  size: "3x3m",  floorNumber: 1, status: "occupied",  viewCount: "19", avgRating: "4.00" },
    { propertyId: prop2Id, roomNumber: "201",type: "Deluxe AC", pricePerMonth: "850000",  depositAmount: "850000",  size: "4x4m",  floorNumber: 2, status: "available", viewCount: "35", avgRating: "4.60" },
    { propertyId: prop3Id, roomNumber: "P01",type: "Premium",   pricePerMonth: "1200000", depositAmount: "1200000", size: "4x5m",  floorNumber: 1, status: "available", viewCount: "88", avgRating: "4.90" },
    { propertyId: prop3Id, roomNumber: "P02",type: "Premium",   pricePerMonth: "1200000", depositAmount: "1200000", size: "4x5m",  floorNumber: 1, status: "occupied",  viewCount: "71", avgRating: "4.70" },
    { propertyId: prop3Id, roomNumber: "P03",type: "Premium+",  pricePerMonth: "1500000", depositAmount: "1500000", size: "5x5m",  floorNumber: 2, status: "available", viewCount: "55", avgRating: "5.00" },
    { propertyId: prop4Id, roomNumber: "G01",type: "Deluxe",    pricePerMonth: "1800000", depositAmount: "2000000", size: "5x6m",  floorNumber: 1, status: "available", viewCount: "120","avgRating": "4.95" },
    { propertyId: prop4Id, roomNumber: "G02",type: "Deluxe",    pricePerMonth: "1800000", depositAmount: "2000000", size: "5x6m",  floorNumber: 1, status: "available", viewCount: "95", avgRating: "4.80" },
    { propertyId: prop4Id, roomNumber: "G03",type: "Suite",     pricePerMonth: "2200000", depositAmount: "2500000", size: "6x7m",  floorNumber: 2, status: "occupied",  viewCount: "140","avgRating": "5.00" },
  ];

  const roomIds: string[] = [];
  for (const r of roomDefs) {
    const id = uuidv7();
    roomIds.push(id);
    await db.insert(rooms).values({ id, ...r as any });
  }
  console.log("✓ Rooms created");

  const propFacMap: Record<string, string[]> = {
    [prop1Id]: ["bed", "wardrobe", "desk", "wifi", "electricity", "water", "shared_wc", "motor", "kitchen"],
    [prop2Id]: ["bed", "wardrobe", "desk", "ac", "wifi", "electricity", "water", "shared_wc", "motor", "cctv"],
    [prop3Id]: ["bed", "wardrobe", "desk", "ac", "tv", "refrigerator", "wifi", "electricity", "water", "private_wc", "water_heater", "motor", "car", "breakfast", "cleaning", "cctv"],
    [prop4Id]: ["bed", "wardrobe", "desk", "ac", "tv", "refrigerator", "wifi", "electricity", "water", "private_wc", "water_heater", "motor", "car", "breakfast", "cleaning", "laundry", "cctv"],
  };

  for (const [propId, slugs] of Object.entries(propFacMap)) {
    for (const slug of slugs) {
      if (facIds[slug]) {
        await db.insert(propertyFacilities).values({ propertyId: propId, facilityId: facIds[slug] }).catch(() => {});
      }
    }
  }
  console.log("✓ Property facilities linked");

  const imgPlaceholders = [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  ];

  for (const propId of [prop1Id, prop2Id, prop3Id, prop4Id]) {
    const idx = [prop1Id, prop2Id, prop3Id, prop4Id].indexOf(propId);
    await db.insert(propertyImages).values({
      id: uuidv7(), propertyId: propId,
      url: imgPlaceholders[idx % imgPlaceholders.length],
      altText: "Foto kos", sortOrder: 0, isPrimary: true,
    });
  }
  console.log("✓ Property images added");

  await db.insert(notifications).values([
    { id: uuidv7(), userId: user1Id, type: "system", title: "Selamat Datang di Simako!", body: "Akun Anda telah berhasil dibuat. Mulai temukan kos impian Anda sekarang.", isRead: false },
    { id: uuidv7(), userId: tenant1UserId, type: "system", title: "Akun Tenant Terverifikasi", body: "Akun tenant Anda telah diverifikasi. Properti Anda sekarang dapat ditampilkan.", isRead: true },
  ]);
  console.log("✓ Sample notifications created");

  console.log("\n=== Seed Complete ===");
  console.log("Test accounts:");
  console.log(`  Admin:  admin@simako.web.id / ${PASS_ADMIN}`);
  console.log(`  Tenant: budi.santoso@email.com / ${PASS_TENANT}`);
  console.log(`  Tenant: sri.wahyu@email.com / ${PASS_TENANT}`);
  console.log(`  User:   dewi.rahayu@email.com / ${PASS_USER}`);
  console.log(`  User:   rizky.pratama@email.com / ${PASS_USER}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
