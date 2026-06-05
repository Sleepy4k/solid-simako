export const SITE = {
  name: "Simako",
  tagline: "Temukan Kos Terbaik di Purwokerto",
  description:
    "Platform pencarian dan manajemen kos terpercaya di Purwokerto. Ribuan pilihan kos, kost putra, kost putri, dan guest house siap sewa.",
  url: (typeof process !== "undefined" ? process.env.APP_URL : undefined) ?? "http://localhost:3000",
  locale: "id-ID",
  currency: "IDR",
  city: "Purwokerto",
  province: "Jawa Tengah",
  country: "Indonesia",
  contact: {
    email: "contact@simako.web.id",
    whatsapp: "+6281234567890",
  },
  social: {
    instagram: "https://instagram.com/simakos",
    tiktok: "https://tiktok.com/@simakos",
  },
} as const;

export const PURWOKERTO_DISTRICTS = [
  "Purwokerto Utara",
  "Purwokerto Selatan",
  "Purwokerto Timur",
  "Purwokerto Barat",
  "Sokanegara",
  "Berkoh",
  "Karangwangkal",
  "Grendeng",
  "Bobosan",
  "Kranji",
  "Pasir Kidul",
  "Banyumas",
  "Sokaraja",
] as const;

export const KOST_TYPE_LABELS: Record<string, string> = {
  kost: "Kos",
  guest_house: "Guest House",
  apartment: "Apartemen",
  kontrakan: "Kontrakan",
};

export const GENDER_TYPE_LABELS: Record<string, string> = {
  male: "Putra",
  female: "Putri",
  mixed: "Campuran",
  campus: "Kampus",
};

export const GENDER_TYPE_COLORS: Record<string, string> = {
  male: "bg-blue-100 text-blue-700",
  female: "bg-pink-100 text-pink-700",
  mixed: "bg-purple-100 text-purple-700",
  campus: "bg-green-100 text-green-700",
};

export const PAGINATION_DEFAULTS = {
  perPage: 12,
  perPageOptions: [6, 12, 24, 48],
} as const;
