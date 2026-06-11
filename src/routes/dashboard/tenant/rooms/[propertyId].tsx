import { createAsync, useNavigate, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createSignal, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import {
  getPropertyRooms, createRoomAction, updateRoomAction,
  deleteRoomAction, updatePropertyAction, togglePropertyActiveAction,
} from "~/server/actions/rooms";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE, KOST_TYPE_LABELS, GENDER_TYPE_LABELS, PURWOKERTO_DISTRICTS } from "~/config/site";
import type { RoomDetail } from "~/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const INP = "w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-white transition-all [background-image:none]";
const TEXTAREA = `${INP} resize-none`;

function StatusChip(props: { status: string }) {
  const map: Record<string, string> = {
    available:   "bg-green-100 text-green-700",
    occupied:    "bg-amber-100 text-amber-700",
    maintenance: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    available:   "Tersedia",
    occupied:    "Terisi",
    maintenance: "Pemeliharaan",
  };
  return (
    <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${map[props.status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[props.status] ?? props.status}
    </span>
  );
}

function RoomModal(props: {
  propertyId: string;
  room?: RoomDetail;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = () => !!props.room;
  const [loading, setLoading] = createSignal(false);
  const [errors,  setErrors]  = createSignal<Record<string, string[]>>({});

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const res = isEdit()
      ? await updateRoomAction(fd)
      : await createRoomAction(fd);
    setLoading(false);
    if (res?.errors) { setErrors(res.errors as any); return; }
    if (res?.error)  { setErrors({ _: [res.error] }); return; }
    if (res?.success) props.onSaved();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={props.onClose}>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div class="p-6 border-b border-[#F4F7FA] flex items-center justify-between">
          <h2 class="font-black text-navy text-lg">{isEdit() ? "Edit Kamar" : "Tambah Kamar"}</h2>
          <button type="button" onClick={props.onClose} class="w-8 h-8 rounded-xl hover:bg-[#F4F7FA] flex items-center justify-center text-navy/40 hover:text-navy transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={submit} class="p-6 space-y-4">
          <input type="hidden" name="propertyId" value={props.propertyId} />
          <Show when={isEdit()}>
            <input type="hidden" name="roomId" value={props.room!.id} />
          </Show>

          <Show when={errors()._}>
            <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{errors()._?.[0]}</div>
          </Show>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">No. Kamar <span class="text-red-500">*</span></label>
              <input name="roomNumber" required placeholder="101" value={props.room?.roomNumber ?? ""} class={INP} />
              <Show when={errors().roomNumber}><p class="text-xs text-red-500 mt-1">{errors().roomNumber[0]}</p></Show>
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Tipe</label>
              <input name="type" placeholder="Standard" value={props.room?.type ?? "Standard"} class={INP} />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Harga/Bulan <span class="text-red-500">*</span></label>
              <input name="pricePerMonth" type="number" required placeholder="1000000" value={props.room?.pricePerMonth ?? ""} min="100000" class={INP} />
              <Show when={errors().pricePerMonth}><p class="text-xs text-red-500 mt-1">{errors().pricePerMonth[0]}</p></Show>
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Deposit</label>
              <input name="depositAmount" type="number" placeholder="0" value={props.room?.depositAmount ?? 0} min="0" class={INP} />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Ukuran (m²)</label>
              <input name="size" placeholder="3x4" value={props.room?.size ?? ""} class={INP} />
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Lantai</label>
              <input name="floorNumber" type="number" placeholder="1" value={props.room?.floorNumber ?? ""} min="0" max="50" class={INP} />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Status</label>
            <div class="relative">
              <select name="status" class={INP}>
                <option value="available"   selected={props.room?.status === "available"   || !props.room}>Tersedia</option>
                <option value="occupied"    selected={props.room?.status === "occupied"}>Terisi</option>
                <option value="maintenance" selected={props.room?.status === "maintenance"}>Pemeliharaan</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" onClick={props.onClose} class="flex-1 py-3 rounded-xl border border-[#E6F0FA] text-navy/60 font-semibold text-sm hover:bg-[#F4F7FA] transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading()} class="flex-1 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors disabled:opacity-60">
              {loading() ? "Menyimpan..." : (isEdit() ? "Simpan Perubahan" : "Tambah Kamar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditPropertyModal(props: { property: any; onClose: () => void; onSaved: () => void }) {
  const [loading, setLoading] = createSignal(false);
  const [errors,  setErrors]  = createSignal<Record<string, string[]>>({});

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const fd  = new FormData(e.currentTarget as HTMLFormElement);
    const res = await updatePropertyAction(fd);
    setLoading(false);
    if (res?.errors) { setErrors(res.errors as any); return; }
    if (res?.success) props.onSaved();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={props.onClose}>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div class="p-6 border-b border-[#F4F7FA] flex items-center justify-between">
          <h2 class="font-black text-navy text-lg">Edit Properti</h2>
          <button type="button" onClick={props.onClose} class="w-8 h-8 rounded-xl hover:bg-[#F4F7FA] flex items-center justify-center text-navy/40 hover:text-navy transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={submit} class="p-6 space-y-4">
          <input type="hidden" name="propertyId" value={props.property.id} />

          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Nama Properti <span class="text-red-500">*</span></label>
            <input name="name" required value={props.property.name} class={INP} />
            <Show when={errors().name}><p class="text-xs text-red-500 mt-1">{errors().name[0]}</p></Show>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Tipe Kos</label>
              <div class="relative">
                <select name="kostType" class={INP}>
                  {Object.entries(KOST_TYPE_LABELS).map(([k, v]) => (
                    <option value={k} selected={props.property.kostType === k}>{v}</option>
                  ))}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Peruntukan</label>
              <div class="relative">
                <select name="genderType" class={INP}>
                  {Object.entries(GENDER_TYPE_LABELS).map(([k, v]) => (
                    <option value={k} selected={props.property.genderType === k}>{v}</option>
                  ))}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Alamat Lengkap <span class="text-red-500">*</span></label>
            <input name="address" required value={props.property.address} class={INP} />
            <Show when={errors().address}><p class="text-xs text-red-500 mt-1">{errors().address[0]}</p></Show>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Kota</label>
              <input name="city" value={props.property.city ?? "Purwokerto"} class={INP} />
            </div>
            <div>
              <label class="block text-sm font-semibold text-navy mb-1.5">Kecamatan <span class="text-red-500">*</span></label>
              <div class="relative">
                <select name="district" class={INP}>
                  {PURWOKERTO_DISTRICTS.map((d) => (
                    <option value={d} selected={props.property.district === d}>{d}</option>
                  ))}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg class="w-4 h-4 text-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <Show when={errors().district}><p class="text-xs text-red-500 mt-1">{errors().district[0]}</p></Show>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Deskripsi</label>
            <textarea name="description" rows={3} class={TEXTAREA}>{props.property.description ?? ""}</textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-navy mb-1.5">Peraturan Kos</label>
            <textarea name="rules" rows={3} class={TEXTAREA}>{props.property.rules ?? ""}</textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" onClick={props.onClose} class="flex-1 py-3 rounded-xl border border-[#E6F0FA] text-navy/60 font-semibold text-sm hover:bg-[#F4F7FA] transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading()} class="flex-1 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-sm transition-colors disabled:opacity-60">
              {loading() ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal(props: { title: string; desc: string; onConfirm: () => void; onClose: () => void; loading: boolean }) {
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm" onClick={props.onClose}>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h3 class="font-black text-navy text-center mb-1">{props.title}</h3>
        <p class="text-sm text-navy/55 text-center mb-6">{props.desc}</p>
        <div class="flex gap-3">
          <button onClick={props.onClose} class="flex-1 py-2.5 border border-[#E6F0FA] text-navy/60 font-semibold text-sm rounded-xl hover:bg-[#F4F7FA]">Batal</button>
          <button onClick={props.onConfirm} disabled={props.loading} class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl disabled:opacity-60">
            {props.loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyDetailContent() {
  const params = useParams<{ propertyId: string }>();
  const propertyId = () => params.propertyId;

  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "tenant") { navigate("/dashboard", { replace: true }); return; }
  });

  const data = createAsync(() => getPropertyRooms(propertyId()), { deferStream: true });

  const [modal,        setModal]        = createSignal<"addRoom" | "editRoom" | "editProp" | "deleteRoom" | null>(null);
  const [selectedRoom, setSelectedRoom] = createSignal<RoomDetail | null>(null);
  const [deleting,     setDeleting]     = createSignal(false);
  const [toggling,     setToggling]     = createSignal(false);

  const property = () => data()?.property;
  const rooms    = () => data()?.rooms ?? [];

  const refresh = () => location.reload();

  const handleDeleteRoom = async () => {
    if (!selectedRoom()) return;
    setDeleting(true);
    await deleteRoomAction(selectedRoom()!.id);
    setDeleting(false);
    setModal(null);
    refresh();
  };

  const handleToggleActive = async () => {
    if (!property()) return;
    setToggling(true);
    await togglePropertyActiveAction(property()!.id);
    setToggling(false);
    refresh();
  };

  return (
    <Show when={isLoaded() && user()?.role === "tenant"} fallback={<DashboardSkeleton />}>
      <Show when={property()} fallback={
        <DashboardLayout user={user()!} title="Properti Tidak Ditemukan" breadcrumb={`${SITE.name} / Tenant / Properti`}>
          <div class="bg-white rounded-2xl border border-[#E6F0FA] p-12 text-center">
            <p class="text-navy/50">Properti tidak ditemukan atau bukan milik Anda.</p>
            <a href="/dashboard/tenant/rooms" class="mt-4 inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline">Kembali ke daftar properti</a>
          </div>
        </DashboardLayout>
      }>
        <DashboardLayout user={user()!} title={property()!.name} breadcrumb={`${SITE.name} / Tenant / Properti / ${property()!.name}`}>
          <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
              <div class="flex items-start justify-between flex-wrap gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 flex-wrap mb-2">
                    <h2 class="text-xl font-black text-navy">{property()!.name}</h2>
                    <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${property()!.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {property()!.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p class="text-sm text-navy/55 mb-1">{property()!.address}, {property()!.district}</p>
                  <div class="flex items-center gap-3 flex-wrap mt-3 text-xs text-navy/40">
                    <span class="bg-[#E6F0FA] text-accent font-bold px-2.5 py-1 rounded-full">
                      {KOST_TYPE_LABELS[property()!.kostType] ?? property()!.kostType}
                    </span>
                    <span class="bg-[#E6F0FA] text-accent font-bold px-2.5 py-1 rounded-full">
                      {GENDER_TYPE_LABELS[property()!.genderType] ?? property()!.genderType}
                    </span>
                    <span>{rooms().length} kamar total</span>
                    <span class="text-green-600 font-semibold">
                      {rooms().filter((r) => r.status === "available").length} tersedia
                    </span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <a
                    href={`/kost/${property()!.slug}`}
                    target="_blank"
                    class="flex items-center gap-1.5 px-3.5 py-2 border border-[#E6F0FA] rounded-xl text-xs font-semibold text-navy/60 hover:text-navy hover:bg-[#F4F7FA] transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Lihat Halaman
                  </a>
                  <button
                    type="button"
                    onClick={() => setModal("editProp")}
                    class="flex items-center gap-1.5 px-3.5 py-2 border border-[#E6F0FA] rounded-xl text-xs font-semibold text-navy/60 hover:text-navy hover:bg-[#F4F7FA] transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Edit Properti
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    disabled={toggling()}
                    class={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 ${
                      property()!.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {toggling() ? "..." : (property()!.isActive ? "Nonaktifkan" : "Aktifkan")}
                  </button>
                  <a href="/dashboard/tenant/rooms" class="flex items-center gap-1.5 px-3.5 py-2 border border-[#E6F0FA] rounded-xl text-xs font-semibold text-navy/60 hover:text-navy hover:bg-[#F4F7FA] transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Kembali
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-base font-black text-navy">Daftar Kamar</h3>
                  <p class="text-xs text-navy/40">{rooms().length} kamar terdaftar</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedRoom(null); setModal("addRoom"); }}
                  class="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-sm transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah Kamar
                </button>
              </div>

                <Show
                  when={rooms().length > 0}
                  fallback={
                    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-12 text-center">
                      <div class="w-14 h-14 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                      </div>
                      <h3 class="font-bold text-navy mb-1">Belum ada kamar</h3>
                      <p class="text-sm text-navy/50 mb-4">Tambahkan kamar untuk properti ini.</p>
                      <button
                        type="button"
                        onClick={() => setModal("addRoom")}
                        class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                      >
                        Tambah Kamar Pertama
                      </button>
                    </div>
                  }
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For each={rooms()}>
                      {(room) => (
                        <div class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md transition-shadow">
                          <div class="flex items-start justify-between mb-3">
                            <div>
                              <p class="font-black text-navy text-lg">Kamar {room.roomNumber}</p>
                              <p class="text-xs text-navy/50">{room.type}</p>
                            </div>
                            <StatusChip status={room.status} />
                          </div>

                          <div class="space-y-1.5 mb-4 text-sm">
                            <p class="font-bold text-accent">{fmt(room.pricePerMonth)}<span class="text-navy/40 font-normal text-xs">/bulan</span></p>
                            <Show when={room.depositAmount > 0}>
                              <p class="text-xs text-navy/50">Deposit: {fmt(room.depositAmount)}</p>
                            </Show>
                            <div class="flex gap-3 text-xs text-navy/40">
                              <Show when={room.size}><span>Ukuran: {room.size}</span></Show>
                              <Show when={room.floorNumber != null}><span>Lantai {room.floorNumber}</span></Show>
                            </div>
                            <Show when={room.avgRating > 0}>
                              <div class="flex items-center gap-1 text-xs text-amber-500">
                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                {room.avgRating.toFixed(1)}
                              </div>
                            </Show>
                          </div>

                          <div class="flex gap-2">
                            <button
                              type="button"
                              onClick={() => { setSelectedRoom(room); setModal("editRoom"); }}
                              class="flex-1 text-center text-xs font-semibold text-navy/60 hover:text-navy py-2 border border-[#E6F0FA] rounded-xl hover:bg-[#F4F7FA] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedRoom(room); setModal("deleteRoom"); }}
                              class="flex-1 text-center text-xs font-bold text-red-500 hover:text-red-600 py-2 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
            </div>
          </div>

          <Show when={modal() === "addRoom"}>
            <RoomModal propertyId={property()!.id} onClose={() => setModal(null)} onSaved={refresh} />
          </Show>
          <Show when={modal() === "editRoom" && selectedRoom()}>
            <RoomModal propertyId={property()!.id} room={selectedRoom()!} onClose={() => setModal(null)} onSaved={refresh} />
          </Show>
          <Show when={modal() === "editProp"}>
            <EditPropertyModal property={property()!} onClose={() => setModal(null)} onSaved={refresh} />
          </Show>
          <Show when={modal() === "deleteRoom" && selectedRoom()}>
            <DeleteConfirmModal
              title="Hapus Kamar?"
              desc={`Kamar ${selectedRoom()!.roomNumber} akan dihapus secara permanen.`}
              onConfirm={handleDeleteRoom}
              onClose={() => setModal(null)}
              loading={deleting()}
            />
          </Show>
        </DashboardLayout>
      </Show>
    </Show>
  );
}

export default function PropertyDetailPage() {
  return (
    <>
      <Title>Kelola Kamar - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <PropertyDetailContent />
    </>
  );
}
