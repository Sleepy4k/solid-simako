import { createAsync, useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, Suspense, createSignal, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { getTenantPayments, approvePaymentAction, rejectPaymentAction } from "~/server/actions/payments";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { SITE } from "~/config/site";
import type { PaymentStatus } from "~/types";
import type { PaymentEntry } from "~/server/actions/payments";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

function StatusChip(props: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; cls: string }> = {
    pending:  { label: "Menunggu",  cls: "bg-amber-100 text-amber-700" },
    approved: { label: "Disetujui", cls: "bg-green-100 text-green-700" },
    rejected: { label: "Ditolak",   cls: "bg-red-100 text-red-600" },
  };
  const s = map[props.status];
  return <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
}

function RejectModal(props: { onConfirm: (reason: string) => void; onClose: () => void; loading: boolean }) {
  const [reason, setReason] = createSignal("");
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={props.onClose}>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 class="font-black text-navy mb-3">Tolak Pembayaran</h3>
        <p class="text-sm text-navy/55 mb-4">Berikan alasan penolakan untuk dikirim ke penyewa.</p>
        <textarea
          rows={3}
          placeholder="Contoh: Bukti tidak terbaca, nominal tidak sesuai..."
          value={reason()}
          onInput={(e) => setReason(e.currentTarget.value)}
          class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-white resize-none transition-all"
        />
        <div class="flex gap-3 mt-4">
          <button onClick={props.onClose} class="flex-1 py-2.5 border border-[#E6F0FA] text-navy/60 font-semibold text-sm rounded-xl hover:bg-[#F4F7FA]">Batal</button>
          <button
            onClick={() => props.onConfirm(reason())}
            disabled={props.loading}
            class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl disabled:opacity-60"
          >
            {props.loading ? "Menolak..." : "Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterType = "all" | PaymentStatus;

function PaymentsContent() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "tenant") { navigate("/dashboard", { replace: true }); return; }
  });
  const payments = createAsync(() => getTenantPayments());

  const [filter,         setFilter]         = createSignal<FilterType>("all");
  const [actionLoading,  setActionLoading]  = createSignal<string | null>(null);
  const [rejectTarget,   setRejectTarget]   = createSignal<PaymentEntry | null>(null);

  const filtered = () => {
    const all = payments() ?? [];
    if (filter() === "all") return all;
    return all.filter((p) => p.status === filter());
  };

  const pending = () => (payments() ?? []).filter((p) => p.status === "pending");

  const handleApprove = async (payment: PaymentEntry) => {
    setActionLoading(payment.id);
    await approvePaymentAction(payment.id);
    setActionLoading(null);
    location.reload();
  };

  const handleReject = async (reason: string) => {
    const target = rejectTarget();
    if (!target) return;
    setActionLoading(target.id);
    await rejectPaymentAction(target.id, reason);
    setActionLoading(null);
    setRejectTarget(null);
    location.reload();
  };

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "all",      label: "Semua" },
    { key: "pending",  label: "Menunggu" },
    { key: "approved", label: "Disetujui" },
    { key: "rejected", label: "Ditolak" },
  ];

  return (
    <Show when={isLoaded() && user()?.role === "tenant"} fallback={<DashboardSkeleton />}>
      <DashboardLayout user={user()!} title="Verifikasi Pembayaran" breadcrumb={`${SITE.name} / Tenant / Pembayaran`}>
        <div class="space-y-6">
          <Suspense fallback={<div class="h-16 bg-[#E6F0FA] rounded-2xl animate-pulse" />}>
            <Show when={(pending()?.length ?? 0) > 0}>
              <div class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-amber-600 font-bold">{pending().length} Pembayaran Menunggu Verifikasi</p>
                  <p class="text-[11px] text-amber-500">Segera tinjau dan konfirmasi bukti pembayaran</p>
                </div>
              </div>
            </Show>
          </Suspense>

          <div class="bg-white rounded-2xl border border-[#E6F0FA] overflow-hidden">
            <div class="px-6 py-4 border-b border-[#F4F7FA] flex items-center justify-between flex-wrap gap-3">
              <h2 class="font-black text-navy">Semua Pembayaran</h2>
              <div class="flex gap-2 flex-wrap">
                <For each={FILTERS}>
                  {(f) => (
                    <button
                      onClick={() => setFilter(f.key)}
                      class={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        filter() === f.key
                          ? "bg-accent text-white"
                          : "bg-[#F4F7FA] text-navy/60 hover:bg-[#E6F0FA] hover:text-navy"
                      }`}
                    >
                      {f.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <Suspense fallback={<div class="p-6 space-y-4">{[1,2,3].map(() => <div class="h-20 bg-[#E6F0FA] rounded-xl animate-pulse"/>)}</div>}>
              <Show
                when={(filtered()?.length ?? 0) > 0}
                fallback={
                  <div class="p-12 text-center">
                    <div class="w-14 h-14 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg class="w-7 h-7 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <p class="text-navy/50 text-sm">Belum ada data pembayaran</p>
                  </div>
                }
              >
                <div class="divide-y divide-[#F4F7FA]">
                  <For each={filtered()}>
                    {(payment) => (
                      <div class="px-6 py-4 hover:bg-[#F4F7FA]/50 transition-colors">
                        <div class="flex items-start gap-4">
                          <div class="w-10 h-10 bg-[#E6F0FA] rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black text-accent">
                            {payment.tenantName.charAt(0).toUpperCase()}
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <p class="font-bold text-navy text-sm">{payment.tenantName}</p>
                                <p class="text-xs text-navy/50">Kamar {payment.roomNumber} - {payment.propertyName}</p>
                              </div>
                              <StatusChip status={payment.status} />
                            </div>
                            <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy/50">
                              <span class="font-semibold text-navy">{fmt(payment.amount)}</span>
                              <span>{payment.senderBank}</span>
                              <span>a.n. {payment.accountHolder}</span>
                              <span>{fmtDate(payment.transferDate)}</span>
                            </div>
                            <Show when={payment.rejectionReason}>
                              <p class="text-xs text-red-500 mt-1">Alasan: {payment.rejectionReason}</p>
                            </Show>
                            <Show when={payment.status === "pending"}>
                              <div class="mt-3 flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleApprove(payment)}
                                  disabled={actionLoading() === payment.id}
                                  class="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
                                >
                                  {actionLoading() === payment.id ? "Memproses..." : "Setujui"}
                                </button>
                                <button
                                  onClick={() => setRejectTarget(payment)}
                                  disabled={actionLoading() === payment.id}
                                  class="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
                                >
                                  Tolak
                                </button>
                                <Show when={payment.imageUrl}>
                                  <a
                                    href={payment.imageUrl}
                                    target="_blank"
                                    rel="noopener"
                                    class="px-3.5 py-1.5 border border-[#E6F0FA] text-navy/60 text-xs font-semibold rounded-lg hover:bg-[#F4F7FA] transition-colors"
                                  >
                                    Lihat Bukti
                                  </a>
                                </Show>
                              </div>
                            </Show>
                            <Show when={payment.status !== "pending" && payment.imageUrl}>
                              <a
                                href={payment.imageUrl}
                                target="_blank"
                                rel="noopener"
                                class="mt-2 inline-block text-xs text-accent hover:underline"
                              >
                                Lihat bukti pembayaran
                              </a>
                            </Show>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Suspense>
          </div>
        </div>

        <Show when={rejectTarget()}>
          <RejectModal
            onConfirm={handleReject}
            onClose={() => setRejectTarget(null)}
            loading={actionLoading() === rejectTarget()?.id}
          />
        </Show>
      </DashboardLayout>
    </Show>
  );
}

export default function TenantPaymentsPage() {
  return (
    <>
      <Title>Verifikasi Pembayaran - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <PaymentsContent />
    </>
  );
}
