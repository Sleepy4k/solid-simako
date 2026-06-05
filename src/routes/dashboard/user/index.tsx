import { useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE } from "~/config/site";
import type { AuthUser } from "~/types";

function UserOverview(props: { user: AuthUser }) {
  return (
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-navy to-accent rounded-2xl p-6 text-white">
        <p class="text-white/60 text-sm mb-1">Selamat datang kembali</p>
        <h2 class="text-xl font-black mb-3">Halo, {props.user.name.split(" ")[0]}!</h2>
        <div class="flex gap-4 text-sm">
          <div class="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div class="font-black text-xl">0</div>
            <div class="text-white/60 text-xs">Sewa Aktif</div>
          </div>
          <div class="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div class="font-black text-xl">0</div>
            <div class="text-white/60 text-xs">Favorit</div>
          </div>
          <div class="bg-white/10 rounded-xl px-4 py-2 text-center">
            <div class="font-black text-xl">0</div>
            <div class="text-white/60 text-xs">Riwayat</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(
          [
            { label: "Cari Kos Baru",   href: "/search",                  icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",                                                                                                                color: "bg-blue-50 text-accent"    },
            { label: "Kos Favorit",     href: "/dashboard/user/favorites", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",                          color: "bg-pink-50 text-pink-600"  },
            { label: "Riwayat Sewa",    href: "/dashboard/user/history",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "bg-green-50 text-green-600" },
          ] as const
        ).map((a) => (
          <a href={a.href} class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
            <div class={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={a.icon} />
              </svg>
            </div>
            <span class="font-semibold text-navy text-sm">{a.label}</span>
          </a>
        ))}
      </div>

      <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-8 text-center">
        <div class="w-16 h-16 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="font-bold text-navy mb-1">Belum ada aktivitas</h3>
        <p class="text-sm text-navy/50 mb-4">Mulai cari kos impian Anda di Purwokerto.</p>
        <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          Cari Kos Sekarang
        </a>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "user") { navigate("/dashboard", { replace: true }); return; }
  });

  return (
    <>
      <Title>Dashboard Penyewa - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Show
        when={isLoaded() && user()?.role === "user"}
        fallback={<DashboardSkeleton />}
      >
        <DashboardLayout user={user()!} title="Dashboard Penyewa" breadcrumb={`${SITE.name} / Dashboard`}>
          <UserOverview user={user()!} />
        </DashboardLayout>
      </Show>
    </>
  );
}
