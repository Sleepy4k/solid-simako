import type { Role } from "~/types";

export const ROLES = {
  USER:   "user"   as const,
  TENANT: "tenant" as const,
  ADMIN:  "admin"  as const,
} satisfies Record<string, Role>;

export const ROLE_LABELS: Record<Role, string> = {
  user:   "Pengguna",
  tenant: "Pemilik Kos",
  admin:  "Administrator",
};

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  user:   "/dashboard/user",
  tenant: "/dashboard/tenant",
  admin:  "/dashboard/admin",
};

export const ROLE_SIDEBAR_ITEMS: Record<Role, Array<{ id: string; label: string; path: string; icon: string }>> = {
  user: [
    { id: "home",      label: "Beranda",      path: "/dashboard/user",           icon: "Home" },
    { id: "favorites", label: "Kos Favorit",  path: "/dashboard/user/favorites", icon: "Heart" },
    { id: "history",   label: "Riwayat Sewa", path: "/dashboard/user/history",   icon: "ClipboardList" },
    { id: "profile",   label: "Profil Saya",  path: "/dashboard/user/profile",   icon: "User" },
  ],
  tenant: [
    { id: "home",     label: "Dashboard",        path: "/dashboard/tenant",          icon: "Home" },
    { id: "rooms",    label: "Kelola Kamar",     path: "/dashboard/tenant/rooms",    icon: "Building2" },
    { id: "payments", label: "Verifikasi Bayar", path: "/dashboard/tenant/payments", icon: "CreditCard" },
    { id: "reports",  label: "Laporan",          path: "/dashboard/tenant/reports",  icon: "BarChart2" },
    { id: "profile",  label: "Profil Usaha",     path: "/dashboard/tenant/profile",  icon: "User" },
  ],
  admin: [
    { id: "home",     label: "Dashboard",    path: "/dashboard/admin",          icon: "Home" },
    { id: "users",    label: "Pengguna",     path: "/dashboard/admin/users",    icon: "Users" },
    { id: "tenants",  label: "Pemilik Kos",  path: "/dashboard/admin/tenants",  icon: "Building2" },
    { id: "rooms",    label: "Semua Kamar",  path: "/dashboard/admin/rooms",    icon: "FileText" },
    { id: "settings", label: "Pengaturan",   path: "/dashboard/admin/settings", icon: "Settings" },
  ],
};
