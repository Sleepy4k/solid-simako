import { createAsync, useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createSignal, createEffect } from "solid-js";
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
  const payments = createAsync(() => getTenantPayments(), { deferStream: true });

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
