import { useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, Suspense, createResource, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { getAdminStats } from "~/server/actions/rooms";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE } from "~/config/site";

function AdminOverview() {
  const [stats] = createResource(() => getAdminStats());

  const metrics = () => [
    { label: "Total Pengguna",   value: stats()?.totalUsers     ?? 0, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-blue-50 text-accent" },
    { label: "Pemilik Kos Aktif",value: stats()?.activeTenants  ?? 0, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1", color: "bg-green-50 text-green-600" },
    { label: "Kamar Terdaftar",  value: stats()?.totalRooms     ?? 0, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", color: "bg-purple-50 text-purple-600" },
    { label: "Tenant Pending",   value: stats()?.pendingTenants ?? 0, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <For each={metrics()}>
          {(s) => (
            <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-5">
              <div class={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={s.icon} />
                </svg>
              </div>
              <p class="text-2xl font-black text-navy">{s.value.toLocaleString("id-ID")}</p>
              <p class="text-xs text-navy/50 mt-0.5">{s.label}</p>
            </div>
          )}
        </For>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Kelola Pengguna",  href: "/dashboard/admin/users",   desc: "Lihat & kelola semua akun" },
          { label: "Approvals Tenant", href: "/dashboard/admin/tenants", desc: "Tenant menunggu verifikasi" },
          { label: "Semua Properti",   href: "/dashboard/admin/rooms",   desc: "Kelola semua properti kos" },
        ].map((a) => (
          <a href={a.href} class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <p class="font-bold text-navy mb-1">{a.label}</p>
            <p class="text-xs text-navy/50">{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "admin") { navigate("/dashboard", { replace: true }); return; }
  });

  return (
    <>
      <Title>Admin Dashboard - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Show
        when={isLoaded() && user()?.role === "admin"}
        fallback={<DashboardSkeleton />}
      >
        <DashboardLayout user={user()!} title="Admin Dashboard" breadcrumb={`${SITE.name} / Admin`}>
          <Suspense fallback={<div class="space-y-5">{[1,2,3].map(() => <div class="h-24 bg-[#E6F0FA] rounded-2xl animate-pulse" />)}</div>}>
            <AdminOverview />
          </Suspense>
        </DashboardLayout>
      </Show>
    </>
  );
}
