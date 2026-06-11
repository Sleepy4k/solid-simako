import { useNavigate } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { getTenantStats } from "~/server/actions/rooms";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE } from "~/config/site";

function TenantOverview() {
  const stats = createAsync(() => getTenantStats(), { deferStream: true });

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-5">
          <p class="text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Kamar Kosong</p>
          <p class="text-3xl font-black text-accent">{stats()?.available ?? 0}</p>
        </div>
        <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-5">
          <p class="text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">Kamar Terisi</p>
          <p class="text-3xl font-black text-green-600">{stats()?.occupied ?? 0}</p>
        </div>
        <div class="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
          <p class="text-xs font-bold text-amber-600/70 uppercase tracking-wider mb-2">Verifikasi Bayar</p>
          <p class="text-3xl font-black text-amber-600">{stats()?.pendingPayments ?? 0}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/dashboard/tenant/rooms" class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
          <div class="w-12 h-12 bg-[#E6F0FA] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p class="font-bold text-navy">Kelola Properti</p>
            <p class="text-xs text-navy/50">Tambah, edit, atau hapus properti</p>
          </div>
        </a>
        <a href="/dashboard/tenant/payments" class="bg-white rounded-2xl border border-amber-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
          <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="font-bold text-navy">Verifikasi Pembayaran</p>
            <Show
              when={(stats()?.pendingPayments ?? 0) > 0}
              fallback={<p class="text-xs text-navy/50">Tidak ada yang menunggu</p>}
            >
              <p class="text-xs text-amber-600 font-medium">{stats()?.pendingPayments} menunggu persetujuan</p>
            </Show>
          </div>
        </a>
      </div>

      <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-6">
        <h3 class="font-bold text-navy mb-4">Ringkasan Properti</h3>
        <Show
          when={(stats()?.total ?? 0) > 0}
          fallback={
            <div class="text-center py-6">
              <p class="text-sm text-navy/40 mb-3">Belum ada kamar terdaftar.</p>
              <a href="/dashboard/tenant/rooms" class="text-sm text-accent font-semibold hover:underline">Tambah properti pertama Anda →</a>
            </div>
          }
        >
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-black text-navy">{stats()?.total ?? 0}</p>
              <p class="text-xs text-navy/40 mt-0.5">Total Kamar</p>
            </div>
            <div>
              <p class="text-2xl font-black text-green-600">{stats()?.available ?? 0}</p>
              <p class="text-xs text-navy/40 mt-0.5">Tersedia</p>
            </div>
            <div>
              <p class="text-2xl font-black text-accent">{stats()?.occupied ?? 0}</p>
              <p class="text-xs text-navy/40 mt-0.5">Terisi</p>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "tenant") { navigate("/dashboard", { replace: true }); return; }
  });

  return (
    <>
      <Title>Dashboard Pemilik Kos - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Show
        when={isLoaded() && user()?.role === "tenant"}
        fallback={<DashboardSkeleton />}
      >
        <DashboardLayout user={user()!} title="Dashboard Pemilik Kos" breadcrumb={`${SITE.name} / Tenant`}>
          <TenantOverview />
        </DashboardLayout>
      </Show>
    </>
  );
}
