import { useNavigate, createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, Suspense, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { getRentalHistory } from "~/server/actions/user";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE } from "~/config/site";
import type { BookingStatus, PaymentStatus } from "~/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

function BookingStatusChip(props: { status: BookingStatus }) {
  const map: Record<BookingStatus, { label: string; cls: string }> = {
    pending:   { label: "Menunggu",  cls: "bg-amber-100 text-amber-700" },
    active:    { label: "Aktif",     cls: "bg-green-100 text-green-700" },
    ended:     { label: "Selesai",   cls: "bg-gray-100 text-gray-600"  },
    cancelled: { label: "Dibatalkan",cls: "bg-red-100 text-red-600"    },
  };
  const s = map[props.status];
  return <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
}

function PaymentStatusChip(props: { status: PaymentStatus | null }) {
  if (!props.status) return null;
  const map: Record<PaymentStatus, { label: string; cls: string }> = {
    pending:  { label: "Bukti Dikirim",cls: "bg-blue-100 text-blue-700"  },
    approved: { label: "Lunas",        cls: "bg-green-100 text-green-700" },
    rejected: { label: "Bukti Ditolak",cls: "bg-red-100 text-red-600"    },
  };
  const s = map[props.status];
  return <span class={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

function HistoryContent() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "user") { navigate("/dashboard", { replace: true }); return; }
  });

  const history = createAsync(() => getRentalHistory());

  return (
    <Show when={isLoaded() && user()?.role === "user"} fallback={<DashboardSkeleton />}>
      <DashboardLayout user={user()!} title="Riwayat Sewa" breadcrumb={`${SITE.name} / Riwayat`}>
        <Suspense fallback={
          <div class="space-y-3">
            {[1,2,3].map(() => <div class="h-24 bg-[#E6F0FA] rounded-2xl animate-pulse" />)}
          </div>
        }>
          <Show
            when={(history()?.length ?? 0) > 0}
            fallback={
              <div class="bg-white rounded-2xl border border-[#E6F0FA] p-12 text-center">
                <div class="w-16 h-16 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="font-bold text-navy mb-1">Belum ada riwayat sewa</h3>
                <p class="text-sm text-navy/50 mb-5">Riwayat booking dan sewa Anda akan muncul di sini.</p>
                <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                  Mulai Cari Kos
                </a>
              </div>
            }
          >
            <div class="space-y-4">
              <p class="text-sm text-navy/50">{history()!.length} riwayat sewa</p>
              <div class="bg-white rounded-2xl border border-[#E6F0FA] overflow-hidden divide-y divide-[#F4F7FA]">
                <For each={history()}>
                  {(booking) => (
                    <div class="px-6 py-4 hover:bg-[#F4F7FA]/50 transition-colors">
                      <div class="flex items-start justify-between gap-3 flex-wrap">
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-navy text-sm">{booking.propertyName}</p>
                          <p class="text-xs text-navy/50 mt-0.5">Kamar {booking.roomNumber}</p>
                          <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy/50">
                            <span>{fmtDate(booking.startDate)} - {fmtDate(booking.endDate)}</span>
                            <span class="font-semibold text-navy">{fmt(booking.totalAmount)}</span>
                          </div>
                          <Show when={booking.paymentStatus !== null}>
                            <div class="mt-2">
                              <PaymentStatusChip status={booking.paymentStatus} />
                            </div>
                          </Show>
                        </div>
                        <div class="flex flex-col items-end gap-1.5">
                          <BookingStatusChip status={booking.status} />
                          <p class="text-[11px] text-navy/35">{fmtDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </Suspense>
      </DashboardLayout>
    </Show>
  );
}

export default function UserHistoryPage() {
  return (
    <>
      <Title>Riwayat Sewa - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <HistoryContent />
    </>
  );
}
