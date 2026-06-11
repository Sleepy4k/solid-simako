import { createAsync, useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createSignal, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { getTenantRooms, createPropertyAction } from "~/server/actions/rooms";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE, KOST_TYPE_LABELS, GENDER_TYPE_LABELS } from "~/config/site";
import type { AuthUser } from "~/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function KostTypeChip(props: { type: string }) {
  const cls: Record<string, string> = {
    kost:        "bg-blue-100 text-blue-700",
    guest_house: "bg-purple-100 text-purple-700",
    apartment:   "bg-indigo-100 text-indigo-700",
    kontrakan:   "bg-orange-100 text-orange-700",
  };
  return (
    <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${cls[props.type] ?? "bg-gray-100 text-gray-600"}`}>
      {KOST_TYPE_LABELS[props.type] ?? props.type}
    </span>
  );
}

function AddPropertyModal(props: { onClose: () => void; onSaved: () => void }) {
  const [loading, setLoading] = createSignal(false);
  const [errors,  setErrors]  = createSignal<Record<string, string[]>>({});

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const fd  = new FormData(e.currentTarget as HTMLFormElement);
    const res = await createPropertyAction(fd);
    setLoading(false);
    if (res?.errors) { setErrors(res.errors as any); return; }
    if (res?.success) props.onSaved();
  };

  const inp = "w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-white transition-all [background-image:none]";

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={props.onClose}>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div class="p-6 border-b border-[#F4F7FA] flex items-center justify-between">
          <h2 class="font-black text-navy text-lg">Tambah Properti Baru</h2>
          <button type="button" onClick={props.onClose} class="w-8 h-8 rounded-xl hover:bg-[#F4F7FA] flex items-center justify-center text-navy/40 hover:text-navy transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={submit} class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Nama Properti <span class="text-red-500">*</span></label>
            <input name="name" required placeholder="Kos Melati Indah" class={inp} />
            <Show when={errors().name}><p class="text-xs text-red-500 mt-1">{errors().name[0]}</p></Show>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Tipe Kos</label>
              <div class="relative">
                <select name="kostType" class={inp}>
                  {Object.entries(KOST_TYPE_LABELS).map(([k, v]) => <option value={k}>{v}</option>)}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Peruntukan</label>
              <div class="relative">
                <select name="genderType" class={inp}>
                  <option value="mixed">Campuran</option>
                  <option value="male">Putra</option>
                  <option value="female">Putri</option>
                  <option value="campus">Kampus</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Alamat Lengkap <span class="text-red-500">*</span></label>
            <input name="address" required placeholder="Jl. HR Bunyamin No. 45" class={inp} />
            <Show when={errors().address}><p class="text-xs text-red-500 mt-1">{errors().address[0]}</p></Show>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Kota</label>
              <input name="city" value="Purwokerto" class={inp} />
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Kecamatan <span class="text-red-500">*</span></label>
              <input name="district" required placeholder="Purwokerto Utara" class={inp} />
              <Show when={errors().district}><p class="text-xs text-red-500 mt-1">{errors().district[0]}</p></Show>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Deskripsi</label>
            <textarea name="description" rows={3} placeholder="Ceritakan keunggulan properti Anda..." class={`${inp} resize-none`} />
          </div>
          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Peraturan Kos</label>
            <textarea name="rules" rows={3} placeholder="Contoh: Tidak boleh membawa tamu..." class={`${inp} resize-none`} />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" onClick={props.onClose} class="flex-1 py-3 rounded-xl border border-[#E6F0FA] text-navy/60 font-semibold text-sm hover:bg-[#F4F7FA] transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading()}
              class="flex-1 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors disabled:opacity-60"
            >
              {loading() ? "Menyimpan..." : "Simpan Properti"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoomsContent() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "tenant") { navigate("/dashboard", { replace: true }); return; }
  });

  const props = createAsync(() => getTenantRooms(), { deferStream: true });
  const [modalOpen, setModalOpen] = createSignal(false);

  const refresh = () => location.reload();

  return (
    <Show when={isLoaded() && user()?.role === "tenant"} fallback={<DashboardSkeleton />}>
      <DashboardLayout user={user()!} title="Kelola Properti" breadcrumb={`${SITE.name} / Tenant / Properti`}>
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-black text-navy">Daftar Properti</h2>
              <p class="text-sm text-navy/50">Kelola semua properti kos Anda</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              class="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-sm transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Tambah Properti
            </button>
          </div>
        </div>

        <Show when={modalOpen()}>
          <AddPropertyModal onClose={() => setModalOpen(false)} onSaved={refresh} />
        </Show>
      </DashboardLayout>
    </Show>
  );
}

export default function TenantRoomsPage() {
  return (
    <>
      <Title>Kelola Properti - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <RoomsContent />
    </>
  );
}
