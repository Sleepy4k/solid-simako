import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import Star from "lucide-solid/icons/star";
import MapPin from "lucide-solid/icons/map-pin";
import Eye from "lucide-solid/icons/eye";
import type { IconName } from "~/lib/client/icons";
import { ICON_MAP } from "~/lib/client/icons";
import type { RecommendedRoom } from "~/types";
import { KOST_TYPE_LABELS, GENDER_TYPE_LABELS, GENDER_TYPE_COLORS } from "~/config/site";
import { FACILITIES, FACILITY_DISPLAY_LIMIT } from "~/constants/facilities";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

interface RoomCardProps {
  room:   RecommendedRoom;
  index?: number;
}

export function RoomCard(props: RoomCardProps) {
  const r = props.room;

  const displayFacilities = () => {
    if (!r.facilities || r.facilities.length === 0) return { shown: [], extra: 0 };
    const shown = r.facilities.slice(0, FACILITY_DISPLAY_LIMIT);
    const extra = Math.max(0, r.facilities.length - FACILITY_DISPLAY_LIMIT);
    return { shown, extra };
  };

  const stars = () => Math.round(r.avgRating);

  const statusLabel = () => {
    if (r.status === "available") return { text: "Tersedia", cls: "bg-green-500/90" };
    if (r.status === "occupied") return { text: "Terisi", cls: "bg-red-500/90" };
    return { text: "Maintenance", cls: "bg-amber-500/90" };
  };

  return (
    <A
      href={`/kost/${r.propertySlug}/kamar/${r.id}`}
      class="group bg-white rounded-2xl border border-[#E6F0FA] shadow-sm hover:shadow-xl hover:shadow-navy/8 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div class="relative h-44 bg-gradient-to-br from-[#E6F0FA] to-[#F4F7FA] overflow-hidden flex-shrink-0">
        <Show
          when={r.thumbnail}
          fallback={
            <div class="absolute inset-0 flex flex-col items-center justify-center text-navy/20">
              <Eye class="w-10 h-10 mb-2" />
              <span class="text-xs">Foto belum tersedia</span>
            </div>
          }
        >
          <img
            src={r.thumbnail!}
            alt={r.name}
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Show>

        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span class="px-2 py-0.5 bg-navy/85 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
            {KOST_TYPE_LABELS[r.kostType] ?? r.kostType}
          </span>
          <span class={`px-2 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-sm ${GENDER_TYPE_COLORS[r.genderType]}`}>
            {GENDER_TYPE_LABELS[r.genderType] ?? r.genderType}
          </span>
        </div>

        <div class="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-[10px]">
          <Eye class="w-3 h-3" />
          {r.viewCount.toLocaleString("id-ID")}
        </div>

        <div class="absolute bottom-3 right-3">
          <span class={`px-2 py-1 ${statusLabel().cls} text-white text-[10px] font-bold rounded-lg`}>
            {statusLabel().text}
          </span>
        </div>
      </div>

      <div class="p-4 flex flex-col flex-1 gap-2.5">
        <div>
          <h3 class="font-bold text-navy text-sm leading-tight group-hover:text-accent transition-colors line-clamp-1">{r.name}</h3>
          <p class="text-[11px] text-navy/50 mt-0.5">Kamar {r.roomNumber} · {r.roomType}<Show when={r.size}> · {r.size}</Show></p>
          <div class="flex items-center gap-1.5 mt-1">
            <div class="flex items-center gap-0.5">
              <For each={Array.from({ length: 5 })}>
                {(_, i) => (
                  <Star class={`w-3 h-3 ${i() < stars() ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                )}
              </For>
            </div>
            <span class="text-xs text-navy/50">{r.avgRating.toFixed(1)}</span>
          </div>
        </div>

        <div class="flex items-start gap-1.5">
          <MapPin class="w-3.5 h-3.5 text-navy/35 flex-shrink-0 mt-0.5" />
          <span class="text-xs text-navy/55 line-clamp-1">{r.district}, {r.city}</span>
        </div>

        <Show when={r.facilities && r.facilities.length > 0}>
          <div class="flex items-center flex-wrap gap-1.5">
            <For each={displayFacilities().shown}>
              {(fac) => {
                const def = FACILITIES.find((f) => f.name === fac.name);
                const IconComp = def ? ICON_MAP[def.icon as IconName] : null;
                return (
                  <span title={fac.name} class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4F7FA] text-navy/60 rounded-lg text-[10px] font-medium">
                    {IconComp && <IconComp class="w-3 h-3" />}
                    {fac.name}
                  </span>
                );
              }}
            </For>
            <Show when={displayFacilities().extra > 0}>
              <span class="px-2 py-0.5 bg-[#E6F0FA] text-accent rounded-lg text-[10px] font-bold">+{displayFacilities().extra}</span>
            </Show>
          </div>
        </Show>

        <div class="mt-auto pt-2 border-t border-[#F4F7FA] flex items-end justify-between">
          <div>
            <span class="text-sm font-black text-accent">{fmt(r.pricePerMonth)}</span>
            <span class="text-xs text-navy/40">/bulan</span>
          </div>
          <span class="text-xs font-medium text-accent bg-[#E6F0FA] px-2 py-0.5 rounded-full">Lihat Kamar →</span>
        </div>
      </div>
    </A>
  );
}
