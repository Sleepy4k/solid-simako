import { db } from "./index";
import { users, facilities } from "./schema";
import { eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import argon2 from "argon2";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@simako.web.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@Simako2025!";
const ADMIN_NAME     = process.env.ADMIN_NAME     ?? "Administrator";

const FACILITIES = [
  { id: uuidv7(), slug: "ac",              name: "AC",                  category: "basic",        icon: "Wind" },
  { id: uuidv7(), slug: "fan",             name: "Kipas Angin",          category: "basic",        icon: "Wind" },
  { id: uuidv7(), slug: "bed",             name: "Tempat Tidur",         category: "basic",        icon: "BedDouble" },
  { id: uuidv7(), slug: "wardrobe",        name: "Lemari",               category: "basic",        icon: "Archive" },
  { id: uuidv7(), slug: "desk",            name: "Meja Belajar",         category: "basic",        icon: "Monitor" },
  { id: uuidv7(), slug: "tv",              name: "TV",                   category: "basic",        icon: "Tv" },
  { id: uuidv7(), slug: "refrigerator",    name: "Kulkas",               category: "basic",        icon: "Refrigerator" },
  { id: uuidv7(), slug: "balcony",         name: "Balkon",               category: "basic",        icon: "Home" },
  { id: uuidv7(), slug: "living_room",     name: "Ruang Tamu",           category: "basic",        icon: "Sofa" },
  { id: uuidv7(), slug: "private_wc",      name: "Kamar Mandi Dalam",   category: "bathroom",     icon: "Bath" },
  { id: uuidv7(), slug: "shared_wc",       name: "KM Bersama",          category: "bathroom",     icon: "Bath" },
  { id: uuidv7(), slug: "water_heater",    name: "Water Heater",         category: "bathroom",     icon: "Flame" },
  { id: uuidv7(), slug: "bathtub",         name: "Bathtub",              category: "bathroom",     icon: "Bath" },
  { id: uuidv7(), slug: "wifi",            name: "WiFi",                 category: "connectivity", icon: "Wifi" },
  { id: uuidv7(), slug: "electricity",     name: "Listrik PLN",          category: "connectivity", icon: "Zap" },
  { id: uuidv7(), slug: "water",           name: "Air PDAM",             category: "connectivity", icon: "Droplets" },
  { id: uuidv7(), slug: "cable_tv",        name: "TV Kabel",             category: "connectivity", icon: "Tv2" },
  { id: uuidv7(), slug: "cctv",            name: "CCTV",                 category: "security",     icon: "Camera" },
  { id: uuidv7(), slug: "security",        name: "Satpam 24 Jam",        category: "security",     icon: "Shield" },
  { id: uuidv7(), slug: "fingerprint",     name: "Kunci Sidik Jari",     category: "security",     icon: "Fingerprint" },
  { id: uuidv7(), slug: "smart_lock",      name: "Kunci Digital",        category: "security",     icon: "Lock" },
  { id: uuidv7(), slug: "intercom",        name: "Interkom",             category: "security",     icon: "Phone" },
  { id: uuidv7(), slug: "motor",           name: "Parkir Motor",         category: "parking",      icon: "Bike" },
  { id: uuidv7(), slug: "car",             name: "Parkir Mobil",         category: "parking",      icon: "Car" },
  { id: uuidv7(), slug: "bicycle",         name: "Parkir Sepeda",        category: "parking",      icon: "Bike" },
  { id: uuidv7(), slug: "kitchen",         name: "Dapur Bersama",        category: "kitchen",      icon: "UtensilsCrossed" },
  { id: uuidv7(), slug: "laundry",         name: "Laundry",              category: "kitchen",      icon: "WashingMachine" },
  { id: uuidv7(), slug: "washing_machine", name: "Mesin Cuci Bersama",   category: "kitchen",      icon: "WashingMachine" },
  { id: uuidv7(), slug: "breakfast",       name: "Sarapan",              category: "service",      icon: "Coffee" },
  { id: uuidv7(), slug: "cleaning",        name: "Cleaning Service",     category: "service",      icon: "Sparkles" },
  { id: uuidv7(), slug: "garden",          name: "Taman",                category: "service",      icon: "Trees" },
  { id: uuidv7(), slug: "gym",             name: "Area Olahraga",        category: "service",      icon: "Dumbbell" },
  { id: uuidv7(), slug: "pool",            name: "Kolam Renang",         category: "service",      icon: "Waves" },
  { id: uuidv7(), slug: "elevator",        name: "Lift",                 category: "service",      icon: "ArrowUpDown" },
  { id: uuidv7(), slug: "generator",       name: "Genset",               category: "service",      icon: "Zap" },
  { id: uuidv7(), slug: "pet_friendly",    name: "Pet Friendly",         category: "service",      icon: "PawPrint" },
] as const;

async function main() {
  console.log("Starting production seed...");

  const [existingAdmin] = await db.select({ id: users.id })
    .from(users).where(eq(users.role, "admin")).limit(1);

  if (!existingAdmin) {
    const passwordHash = await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id });
    await db.insert(users).values({
      id:           uuidv7(),
      name:         ADMIN_NAME,
      email:        ADMIN_EMAIL,
      passwordHash,
      role:         "admin",
      isVerified:   true,
      isActive:     true,
    });
    console.log(`✓ Admin created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`- Admin already exists, skipping`);
  }

  for (const f of FACILITIES) {
    const [existing] = await db.select({ slug: facilities.slug })
      .from(facilities).where(eq(facilities.slug, f.slug)).limit(1);
    if (!existing) {
      await db.insert(facilities).values({
        id:       f.id,
        slug:     f.slug,
        name:     f.name,
        category: f.category as any,
        icon:     f.icon,
      });
    }
  }
  console.log(`✓ Facilities seeded (${FACILITIES.length} items)`);

  console.log("Production seed complete.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
