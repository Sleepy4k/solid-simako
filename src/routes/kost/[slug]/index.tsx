import { createAsync, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show, For, createSignal, onMount } from "solid-js";
import { getPropertyDetail, logPropertyViewAction } from "~/server/actions/rooms";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE, KOST_TYPE_LABELS, GENDER_TYPE_LABELS, GENDER_TYPE_COLORS } from "~/config/site";
import { FACILITY_CATEGORY_LABELS } from "~/constants/facilities";
import type { RoomDetail } from "~/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function RoomCard(props: { room: RoomDetail; propertySlug: string }) {
  const statusMap: Record<string, { label: string; cls: string }> = {
    available:   { label: "Tersedia",    cls: "bg-green-100 text-green-700" },
    occupied:    { label: "Terisi",      cls: "bg-red-100 text-red-700" },
    maintenance: { label: "Maintenance", cls: "bg-amber-100 text-amber-700" },
  };
  const s = statusMap[props.room.status] ?? statusMap.available;

  return (
    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div>
          <p class="font-bold text-navy">Kamar {props.room.roomNumber}</p>
          <p class="text-xs text-navy/50">{props.room.type}</p>
        </div>
        <span class={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
      </div>
      <div class="space-y-1.5 text-sm text-navy/70 mb-4">
        <Show when={props.room.size}>
          <p>Ukuran: <span class="font-medium text-navy">{props.room.size}</span></p>
        </Show>
        <Show when={props.room.floorNumber}>
          <p>Lantai: <span class="font-medium text-navy">{props.room.floorNumber}</span></p>
        </Show>
        <Show when={props.room.avgRating > 0}>
          <p class="flex items-center gap-1">
            <span class="text-amber-400">★</span>
            <span class="font-medium text-navy">{props.room.avgRating.toFixed(1)}</span>
          </p>
        </Show>
      </div>
      <div class="border-t border-[#F4F7FA] pt-3 mb-3">
        <p class="text-lg font-black text-navy">{fmt(props.room.pricePerMonth)}<span class="text-xs font-normal text-navy/40">/bulan</span></p>
        <Show when={props.room.depositAmount > 0}>
          <p class="text-xs text-navy/50 mt-0.5">Deposit: {fmt(props.room.depositAmount)}</p>
        </Show>
      </div>
      <a
        href={`/kost/${props.propertySlug}/kamar/${props.room.id}`}
        class="block w-full text-center border border-accent text-accent hover:bg-accent hover:text-white font-bold py-2.5 rounded-xl text-sm transition-colors mb-2"
      >
        Lihat Detail Kamar
      </a>
      <Show when={props.room.status === "available"}>
        <a
          href={`/checkout?room=${props.room.id}`}
          class="block w-full text-center bg-accent hover:bg-accent-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          Pesan Sekarang
        </a>
      </Show>
    </div>
  );
}

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

function PropertyDetailContent() {
  const params = useParams<{ slug: string }>();
  const data   = createAsync(() => getPropertyDetail(params.slug), { deferStream: true });
  const [activeImg, setActiveImg] = createSignal(0);

  onMount(() => {
    void logPropertyViewAction(params.slug);
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
            <h2 class="text-xl font-black text-navy mb-2">Properti Tidak Ditemukan</h2>
            <p class="text-navy/50 text-sm mb-6">Mungkin properti ini sudah tidak aktif atau URL tidak valid.</p>
            <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Lihat Properti Lain
            </a>
          </div>
        </div>
      }
    >
      {(property) => {
        const images = () => property().images;
        const currentImg = () => images()[activeImg()] ?? null;

        return (
          <>
            <Title>{property().name} - {SITE.name}</Title>
            <Meta name="description" content={property().description ?? `${property().name} di ${property().district}, ${property().city}. Temukan kamar terbaik di Simako.`} />
            <Meta property="og:title" content={`${property().name} - ${SITE.name}`} />
            <Meta property="og:type" content="article" />
            <Meta name="robots" content="index, follow" />

            <div class="max-w-6xl mx-auto px-5 pt-20 pb-10">
              <nav class="text-xs text-navy/40 mb-6 flex items-center gap-1.5">
                <a href="/" class="hover:text-navy transition-colors">Beranda</a>
                <span>/</span>
                <a href="/search" class="hover:text-navy transition-colors">Cari Kos</a>
                <span>/</span>
                <span class="text-navy font-medium">{property().name}</span>
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
                          alt={img().altText ?? property().name}
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
                      <span class={`text-xs font-bold px-3 py-1.5 rounded-full ${GENDER_TYPE_COLORS[property().genderType]}`}>
                        {GENDER_TYPE_LABELS[property().genderType]}
                      </span>
                      <span class="text-xs font-bold px-3 py-1.5 rounded-full bg-[#E6F0FA] text-accent">
                        {KOST_TYPE_LABELS[property().kostType]}
                      </span>
                    </div>
                    <h1 class="text-2xl font-black text-navy mb-2">{property().name}</h1>
                    <p class="flex items-center gap-1.5 text-sm text-navy/50 mb-4">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property().address}, {property().district}, {property().city}
                    </p>

                    <Show when={property().description}>
                      <div class="prose prose-sm max-w-none text-navy/70 leading-relaxed">
                        <p>{property().description}</p>
                      </div>
                    </Show>
                  </div>

                  <Show when={property().facilities.length > 0}>
                    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                      <h2 class="font-black text-navy text-lg mb-4">Fasilitas</h2>
                      <div class="space-y-4">
                        {Object.entries(
                          property().facilities.reduce<Record<string, typeof property extends () => infer T ? (T extends { facilities: infer F } ? F : never) : never>>((acc, f) => {
                            if (!acc[f.category]) acc[f.category] = [];
                            (acc[f.category] as any[]).push(f);
                            return acc;
                          }, {})
                        ).map(([cat, items]) => (
                          <div>
                            <p class="text-xs font-bold text-navy/40 uppercase tracking-wider mb-2">
                              {FACILITY_CATEGORY_LABELS[cat] ?? cat}
                            </p>
                            <div class="flex flex-wrap gap-2">
                              {(items as any[]).map((f: any) => (
                                <span class="inline-flex items-center gap-1.5 text-sm text-navy bg-[#F4F7FA] px-3 py-1.5 rounded-xl">
                                  {f.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Show>

                  <Show when={property().rules}>
                    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                      <h2 class="font-black text-navy text-lg mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Peraturan Kos
                      </h2>
                      <p class="text-sm text-navy/70 whitespace-pre-line">{property().rules}</p>
                    </div>
                  </Show>

                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                    <h2 class="font-black text-navy text-lg mb-4">
                      Daftar Kamar <span class="text-navy/30 font-normal text-base">({property().rooms.length} kamar)</span>
                    </h2>
                    <Show
                      when={property().rooms.length > 0}
                      fallback={
                        <p class="text-sm text-navy/40 text-center py-6">Belum ada kamar terdaftar.</p>
                      }
                    >
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <For each={property().rooms}>
                          {(room) => <RoomCard room={room} propertySlug={params.slug} />}
                        </For>
                      </div>
                    </Show>
                  </div>
                </div>

                <div class="space-y-5">
                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6 sticky top-6">
                    <div class="mb-4">
                      <Show
                        when={property().rooms.length > 0}
                        fallback={<p class="text-sm text-navy/40">Harga belum tersedia</p>}
                      >
                        <p class="text-xs text-navy/40 mb-1">Mulai dari</p>
                        <p class="text-2xl font-black text-navy">
                          {fmt(Math.min(...property().rooms.map((r) => r.pricePerMonth)))}
                        </p>
                        <p class="text-xs text-navy/40">/bulan</p>
                      </Show>
                    </div>

                    <div class="space-y-2 text-sm mb-5">
                      <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                        <span class="text-navy/50">Total Kamar</span>
                        <span class="font-semibold text-navy">{property().rooms.length}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-[#F4F7FA]">
                        <span class="text-navy/50">Kamar Tersedia</span>
                        <span class="font-semibold text-green-600">
                          {property().rooms.filter((r) => r.status === "available").length}
                        </span>
                      </div>
                      <div class="flex justify-between py-2">
                        <span class="text-navy/50">Lokasi</span>
                        <span class="font-semibold text-navy text-right max-w-[150px]">{property().district}</span>
                      </div>
                    </div>

                    <Show
                      when={property().rooms.some((r) => r.status === "available")}
                      fallback={
                        <div class="text-center py-3 text-sm text-navy/40 bg-[#F4F7FA] rounded-xl">
                          Semua kamar penuh
                        </div>
                      }
                    >
                      <a
                        href="#daftar-kamar"
                        class="block w-full text-center bg-accent hover:bg-accent-dark text-white font-black py-3.5 rounded-xl transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(".bg-white.rounded-2xl:last-of-type")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Lihat Kamar Tersedia
                      </a>
                    </Show>

                    <a
                      href={`https://wa.me/${SITE.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${property().name} di Simako`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-2 block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                      Hubungi via WhatsApp
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

export default function KostDetailPage() {
  return (
    <LandingLayout>
      <PropertyDetailContent />
    </LandingLayout>
  );
}
