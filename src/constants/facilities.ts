export interface FacilityDef {
  id:       string;
  name:     string;
  category: "basic" | "bathroom" | "connectivity" | "security" | "parking" | "kitchen" | "service";
  icon:     string;
}

export const FACILITIES: FacilityDef[] = [
  { id: "ac",             name: "AC",                  category: "basic",        icon: "Wind" },
  { id: "fan",            name: "Kipas Angin",          category: "basic",        icon: "Wind" },
  { id: "bed",            name: "Tempat Tidur",         category: "basic",        icon: "BedDouble" },
  { id: "wardrobe",       name: "Lemari",               category: "basic",        icon: "Archive" },
  { id: "desk",           name: "Meja Belajar",         category: "basic",        icon: "Monitor" },
  { id: "tv",             name: "TV",                   category: "basic",        icon: "Tv" },
  { id: "refrigerator",   name: "Kulkas",               category: "basic",        icon: "Refrigerator" },
  { id: "balcony",        name: "Balkon",               category: "basic",        icon: "Home" },
  { id: "living_room",    name: "Ruang Tamu",           category: "basic",        icon: "Sofa" },
  { id: "private_wc",     name: "Kamar Mandi Dalam",   category: "bathroom",     icon: "Bath" },
  { id: "shared_wc",      name: "KM Bersama",          category: "bathroom",     icon: "Bath" },
  { id: "water_heater",   name: "Water Heater",         category: "bathroom",     icon: "Flame" },
  { id: "bathtub",        name: "Bathtub",              category: "bathroom",     icon: "Bath" },
  { id: "wifi",           name: "WiFi",                 category: "connectivity", icon: "Wifi" },
  { id: "electricity",    name: "Listrik PLN",          category: "connectivity", icon: "Zap" },
  { id: "water",          name: "Air PDAM",             category: "connectivity", icon: "Droplets" },
  { id: "cable_tv",       name: "TV Kabel",             category: "connectivity", icon: "Tv2" },
  { id: "cctv",           name: "CCTV",                 category: "security",     icon: "Camera" },
  { id: "security",       name: "Satpam 24 Jam",        category: "security",     icon: "Shield" },
  { id: "fingerprint",    name: "Kunci Sidik Jari",     category: "security",     icon: "Fingerprint" },
  { id: "smart_lock",     name: "Kunci Digital",        category: "security",     icon: "Lock" },
  { id: "intercom",       name: "Interkom",             category: "security",     icon: "Phone" },
  { id: "motor",          name: "Parkir Motor",         category: "parking",      icon: "Bike" },
  { id: "car",            name: "Parkir Mobil",         category: "parking",      icon: "Car" },
  { id: "bicycle",        name: "Parkir Sepeda",        category: "parking",      icon: "Bike" },
  { id: "kitchen",        name: "Dapur Bersama",        category: "kitchen",      icon: "UtensilsCrossed" },
  { id: "laundry",        name: "Laundry",              category: "kitchen",      icon: "WashingMachine" },
  { id: "washing_machine",name: "Mesin Cuci Bersama",   category: "kitchen",      icon: "WashingMachine" },
  { id: "breakfast",      name: "Sarapan",              category: "service",      icon: "Coffee" },
  { id: "cleaning",       name: "Cleaning Service",     category: "service",      icon: "Sparkles" },
  { id: "garden",         name: "Taman",                category: "service",      icon: "Trees" },
  { id: "gym",            name: "Area Olahraga",        category: "service",      icon: "Dumbbell" },
  { id: "pool",           name: "Kolam Renang",         category: "service",      icon: "Waves" },
  { id: "elevator",       name: "Lift",                 category: "service",      icon: "ArrowUpDown" },
  { id: "generator",      name: "Genset",               category: "service",      icon: "Zap" },
  { id: "pet_friendly",   name: "Pet Friendly",         category: "service",      icon: "PawPrint" },
];

export const FACILITY_MAP = Object.fromEntries(FACILITIES.map((f) => [f.id, f]));

export const FACILITY_BY_CATEGORY = FACILITIES.reduce<Record<string, FacilityDef[]>>((acc, f) => {
  if (!acc[f.category]) acc[f.category] = [];
  acc[f.category].push(f);
  return acc;
}, {});

export const FACILITY_CATEGORY_LABELS: Record<string, string> = {
  basic:        "Fasilitas Kamar",
  bathroom:     "Kamar Mandi",
  connectivity: "Konektivitas",
  security:     "Keamanan",
  parking:      "Parkir",
  kitchen:      "Dapur & Laundry",
  service:      "Layanan",
};

export const FACILITY_DISPLAY_LIMIT = 5;
