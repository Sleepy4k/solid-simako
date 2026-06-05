import { useNavigate } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, Suspense, createSignal, createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { createAsync } from "@solidjs/router";
import { getUserFavorites, toggleFavoriteAction } from "~/server/actions/user";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";
import { SITE, KOST_TYPE_LABELS, GENDER_TYPE_LABELS, GENDER_TYPE_COLORS } from "~/config/site";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function FavoritesContent() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    if (!u) { navigate("/auth/login", { replace: true }); return; }
    if (u.role !== "user") { navigate("/dashboard", { replace: true }); return; }
  });

  const data = createAsync(() => getUserFavorites());
  const [removing, setRemoving] = createSignal<string | null>(null);

  const handleRemove = async (roomId: string) => {
    setRemoving(roomId);
    await toggleFavoriteAction(roomId);
    setRemoving(null);
    location.reload();
  };

  return (
    <Show when={isLoaded() && user()?.role === "user"} fallback={<DashboardSkeleton />}>
      <DashboardLayout user={user()!} title="Kos Favorit" breadcrumb={`${SITE.name} / Favorit`}>
        <Suspense fallback={
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(() => <div class="h-40 bg-[#E6F0FA] rounded-2xl animate-pulse" />)}
          </div>
        }>
          <Show
            when={(data()?.favorites.length ?? 0) > 0}
            fallback={
              <div class="bg-white rounded-2xl border border-[#E6F0FA] p-12 text-center">
                <div class="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 class="font-bold text-navy mb-1">Belum ada favorit</h3>
                <p class="text-sm text-navy/50 mb-5">Simpan kos yang Anda sukai agar mudah ditemukan kembali.</p>
                <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                  Cari Kos Sekarang
                </a>
              </div>
            }
          >
            <div class="space-y-4">
              <p class="text-sm text-navy/50">{data()!.total} kos favorit tersimpan</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <For each={data()!.favorites}>
                  {(fav) => (
                    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md transition-shadow">
                      <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex-1 min-w-0">
                          <a href={`/kost/${fav.slug}`} class="font-bold text-navy hover:text-accent transition-colors truncate block">
                            {fav.propertyName}
                          </a>
                          <p class="text-xs text-navy/50 mt-0.5">Kamar {fav.roomNumber} - {fav.district}</p>
                        </div>
                        <span class={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${GENDER_TYPE_COLORS[fav.genderType] ?? "bg-gray-100 text-gray-600"}`}>
                          {GENDER_TYPE_LABELS[fav.genderType] ?? fav.genderType}
                        </span>
                      </div>

                      <div class="flex items-center gap-3 text-xs mb-4">
                        <span class="bg-[#E6F0FA] text-accent font-bold px-2 py-0.5 rounded-full">
                          {KOST_TYPE_LABELS[fav.kostType] ?? fav.kostType}
                        </span>
                        <span class={`font-bold px-2 py-0.5 rounded-full ${fav.status === "available" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {fav.status === "available" ? "Tersedia" : "Terisi"}
                        </span>
                      </div>

                      <p class="font-bold text-accent text-base mb-4">
                        {fmt(fav.pricePerMonth)}<span class="text-navy/40 font-normal text-xs">/bulan</span>
                      </p>

                      <div class="flex gap-2">
                        <a
                          href={`/kost/${fav.slug}`}
                          class="flex-1 text-center text-xs font-bold text-white bg-accent hover:bg-accent-dark py-2 rounded-xl transition-colors"
                        >
                          Lihat Detail
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemove(fav.roomId)}
                          disabled={removing() === fav.roomId}
                          class="flex-1 text-center text-xs font-semibold text-red-500 hover:text-red-600 py-2 border border-red-100 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          {removing() === fav.roomId ? "Menghapus..." : "Hapus"}
                        </button>
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

export default function UserFavoritesPage() {
  return (
    <>
      <Title>Kos Favorit - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <FavoritesContent />
    </>
  );
}
