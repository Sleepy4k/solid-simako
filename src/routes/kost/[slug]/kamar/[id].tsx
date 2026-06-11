import { createAsync, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createSignal, onMount } from "solid-js";
import { getRoomDetail, logRoomViewAction } from "~/server/actions/rooms";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE, KOST_TYPE_LABELS, GENDER_TYPE_LABELS, GENDER_TYPE_COLORS } from "~/config/site";
import { FACILITY_CATEGORY_LABELS } from "~/constants/facilities";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  available:   { label: "Tersedia",    cls: "bg-green-100 text-green-700 border-green-200" },
  occupied:    { label: "Terisi",      cls: "bg-red-100 text-red-700 border-red-200" },
  maintenance: { label: "Maintenance", cls: "bg-amber-100 text-amber-700 border-amber-200" },
};

function GalleryImage(props: { url: string; alt: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
        props.active ? "border-accent scale-105" : "border-transparent opacity-70 hover:opacity-100"
      }`}
    >
      <img src={props.url} alt={props.alt} loading="lazy" decoding="async" class="w-full h-full object-cover" />
    </button>
  );
}

function RoomDetailContent() {
  const params = useParams<{ slug: string; id: string }>();
  const data   = createAsync(() => getRoomDetail(params.id), { deferStream: true });
  const [activeImg, setActiveImg] = createSignal(0);

  onMount(() => {
    void logRoomViewAction(params.id);
  });

  return (
    <Show
      when={data()}
      fallback={
        <div class="min-h-[60vh] flex items-center justify-center">
          <div class="text-center">
            <div class="w-20 h-20 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 class="text-xl font-black text-navy mb-2">Kamar Tidak Ditemukan</h2>
            <p class="text-navy/50 text-sm mb-6">Kamar ini tidak tersedia atau telah dihapus.</p>
            <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Cari Kamar Lain
            </a>
          </div>
        </div>
      }
    >
      {(room) => {
        const images = () => room().images;
        const currentImg = () => images()[activeImg()] ?? null;
        const statusInfo = () => STATUS_MAP[room().status] ?? STATUS_MAP.available;

        const facilitiesByCategory = () => {
          const grouped: Record<string, any[]> = {};
          for (const f of room().facilities) {
            if (!grouped[f.category]) grouped[f.category] = [];
            grouped[f.category].push(f);
          }
          return grouped;
        };

        return (
          <>
            <Title>Kamar {room().roomNumber} - {room().propertyName} - {SITE.name}</Title>
            <Meta name="description" content={room().description ?? `Kamar ${room().roomNumber} tipe ${room().roomType} di ${room().propertyName}, ${room().district}. ${fmt(room().pricePerMonth)}/bulan.`} />
            <Meta property="og:title" content={`Kamar ${room().roomNumber} - ${room().propertyName} - ${SITE.name}`} />
            <Meta property="og:type" content="article" />
            <Meta name="robots" content="index, follow" />

            <div class="max-w-6xl mx-auto px-5 pt-20 pb-10">
              <nav class="text-xs text-navy/40 mb-6 flex items-center gap-1.5 flex-wrap">
                <a href="/" class="hover:text-navy transition-colors">Beranda</a>
                <span>/</span>
                <a href="/search" class="hover:text-navy transition-colors">Cari Kos</a>
                <span>/</span>
                <a href={`/kost/${room().propertySlug}`} class="hover:text-navy transition-colors">{room().propertyName}</a>
                <span>/</span>
                <span class="text-navy font-medium">Kamar {room().roomNumber}</span>
              </nav>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                  <div class="bg-[#E6F0FA] rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                    <Show
                      when={currentImg()}
                      fallback={
                        <div class="text-center text-navy/30">
                          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="text-sm">Belum ada foto</p>
                        </div>
                      }
                    >
                      {(img) => (
                        <img
                          src={img().url}
                          alt={img().altText ?? `Kamar ${room().roomNumber}`}
                          decoding="async"
                          class="w-full h-full object-cover"
                        />
                      )}
                    </Show>
                  </div>

                  <Show when={images().length > 1}>
                    <div class="flex gap-2 overflow-x-auto pb-1">
                      <For each={images()}>
                        {(img, i) => (
                          <GalleryImage
                            url={img.url}
                            alt={img.altText ?? `Foto ${i() + 1}`}
                            active={activeImg() === i()}
                            onClick={() => setActiveImg(i())}
                          />
                        )}
                      </For>
                    </div>
                  </Show>

                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                    <div class="flex flex-wrap items-center gap-2 mb-4">
                      <span class={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusInfo().cls}`}>
                        {statusInfo().label}
                      </span>
                      <span class={`text-xs font-bold px-3 py-1.5 rounded-full ${GENDER_TYPE_COLORS[room().genderType]}`}>
                        {GENDER_TYPE_LABELS[room().genderType]}
                      </span>
                      <span class="text-xs font-bold px-3 py-1.5 rounded-full bg-[#E6F0FA] text-accent">
                        {KOST_TYPE_LABELS[room().kostType]}
                      </span>
                    </div>

                    <h1 class="text-2xl font-black text-navy mb-1">
                      Kamar {room().roomNumber}
                    </h1>
                    <p class="text-navy/50 text-sm mb-1">{room().roomType}</p>

                    <p class="flex items-center gap-1.5 text-sm text-navy/50 mb-4">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {room().address}, {room().district}, {room().city}
                    </p>

                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <Show when={room().size}>
                        <div class="bg-[#F4F7FA] rounded-xl p-3">
                          <p class="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Ukuran</p>
                          <p class="text-sm font-bold text-navy">{room().size}</p>
                        </div>
                      </Show>
                      <Show when={room().floorNumber}>
                        <div class="bg-[#F4F7FA] rounded-xl p-3">
                          <p class="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Lantai</p>
                          <p class="text-sm font-bold text-navy">{room().floorNumber}</p>
                        </div>
                      </Show>
                      <Show when={room().avgRating > 0}>
                        <div class="bg-[#F4F7FA] rounded-xl p-3">
                          <p class="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Rating</p>
                          <p class="text-sm font-bold text-navy flex items-center gap-1">
                            <span class="text-amber-400">★</span> {room().avgRating.toFixed(1)}
                          </p>
                        </div>
                      </Show>
                      <div class="bg-[#F4F7FA] rounded-xl p-3">
                        <p class="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Dilihat</p>
                        <p class="text-sm font-bold text-navy">{room().viewCount.toLocaleString("id-ID")}x</p>
                      </div>
                    </div>

                    <Show when={room().description}>
                      <div class="prose prose-sm max-w-none text-navy/70 leading-relaxed">
                        <p>{room().description}</p>
                      </div>
                    </Show>
                  </div>

                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                    <h2 class="font-black text-navy text-lg mb-3">Tentang Properti</h2>
                    <a href={`/kost/${room().propertySlug}`} class="flex items-center gap-3 p-3 bg-[#F4F7FA] rounded-xl hover:bg-[#E6F0FA] transition-colors group">
                      <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-bold text-navy text-sm group-hover:text-accent transition-colors">{room().propertyName}</p>
                        <p class="text-xs text-navy/50">{room().district}, {room().city}</p>
                      </div>
                      <svg class="w-4 h-4 text-navy/30 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>

                  <Show when={room().facilities.length > 0}>
                    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                      <h2 class="font-black text-navy text-lg mb-4">Fasilitas</h2>
                      <div class="space-y-4">
                        <For each={Object.entries(facilitiesByCategory())}>
                          {([cat, items]) => (
                            <div>
                              <p class="text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">
                                {FACILITY_CATEGORY_LABELS[cat] ?? cat}
                              </p>
                              <div class="flex flex-wrap gap-2">
                                <For each={items}>
                                  {(f: any) => (
                                    <span class="inline-flex items-center gap-1.5 text-sm text-navy bg-[#F4F7FA] px-3 py-1.5 rounded-xl">
                                      {f.name}
                                    </span>
                                  )}
                                </For>
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </Show>

                  <Show when={room().rules}>
                    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                      <h2 class="font-black text-navy text-lg mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Peraturan Kos
                      </h2>
                      <p class="text-sm text-navy/70 whitespace-pre-line">{room().rules}</p>
                    </div>
                  </Show>
                </div>

                <div class="space-y-5">
                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6 sticky top-6">
                    <div class="mb-5">
                      <p class="text-xs text-navy/40 mb-1">Harga per bulan</p>
                      <p class="text-3xl font-black text-navy">{fmt(room().pricePerMonth)}</p>
                      <p class="text-xs text-navy/40">/bulan</p>
                      <Show when={room().depositAmount > 0}>
                        <p class="text-sm text-navy/50 mt-1.5">Deposit: <span class="font-semibold text-navy">{fmt(room().depositAmount)}</span></p>
                      </Show>
                    </div>

                    <div class="space-y-2 text-sm mb-5">
                      <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                        <span class="text-navy/50">Status</span>
                        <span class={`font-bold text-xs px-2 py-0.5 rounded-full border ${statusInfo().cls}`}>
                          {statusInfo().label}
                        </span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                        <span class="text-navy/50">Tipe</span>
                        <span class="font-semibold text-navy">{room().roomType}</span>
                      </div>
                      <Show when={room().size}>
                        <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                          <span class="text-navy/50">Ukuran</span>
                          <span class="font-semibold text-navy">{room().size}</span>
                        </div>
                      </Show>
                      <Show when={room().floorNumber}>
                        <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                          <span class="text-navy/50">Lantai</span>
                          <span class="font-semibold text-navy">{room().floorNumber}</span>
                        </div>
                      </Show>
                      <div class="flex justify-between py-2">
                        <span class="text-navy/50">Lokasi</span>
                        <span class="font-semibold text-navy text-right max-w-[150px]">{room().district}</span>
                      </div>
                    </div>

                    <Show
                      when={room().status === "available"}
                      fallback={
                        <div class="text-center py-3 text-sm text-navy/40 bg-[#F4F7FA] rounded-xl">
                          Kamar tidak tersedia
                        </div>
                      }
                    >
                      <a
                        href={"/checkout?room=" + params.id}
                        class="block w-full text-center bg-accent hover:bg-accent-dark text-white font-black py-3.5 rounded-xl transition-colors"
                      >
                        Pesan Sekarang
                      </a>
                    </Show>

                    <a
                      href={`https://wa.me/${SITE.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan Kamar ${room().roomNumber} di ${room().propertyName} (${SITE.name})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-2 block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                      Tanya via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Show>
  );
}

export default function KamarDetailPage() {
  return (
    <LandingLayout>
      <RoomDetailContent />
    </LandingLayout>
  );
}
