import { For, Show } from "solid-js";
import { createAsync, useSearchParams } from "@solidjs/router";
import { searchRooms } from "~/server/actions/rooms";
import { RoomCard } from "~/features/landing/RoomCard";
import { Pagination } from "~/components/ui/Pagination";
import { CustomSelect } from "~/components/ui/Select";
import { PAGINATION_DEFAULTS } from "~/config/site";
import type { SearchParams } from "~/types";

const SORT_OPTS = [
  { value: "recommended", label: "Direkomendasikan" },
  { value: "price_asc",   label: "Harga Terendah" },
  { value: "price_desc",  label: "Harga Tertinggi" },
  { value: "newest",      label: "Terbaru" },
];

function ResultsSkeleton() {
  return (
    <For each={Array.from({ length: 6 })}>
      {() => (
        <div class="bg-white rounded-2xl border border-[#E6F0FA] overflow-hidden animate-pulse">
          <div class="h-40 bg-[#E6F0FA]" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-[#E6F0FA] rounded w-3/4" />
            <div class="h-3 bg-[#E6F0FA] rounded w-1/2" />
            <div class="h-4 bg-[#E6F0FA] rounded w-1/3 mt-2" />
          </div>
        </div>
      )}
    </For>
  );
}

export function SearchResults() {
  const [sp, setSp] = useSearchParams();
  const valueOf = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  const params = (): SearchParams => ({
    q:        valueOf(sp.q),
    type:     (valueOf(sp.type) as SearchParams["type"]) || undefined,
    gender:   (valueOf(sp.gender) as SearchParams["gender"]) || undefined,
    city:     valueOf(sp.city),
    minPrice: valueOf(sp.minPrice) ? Number(valueOf(sp.minPrice)) : undefined,
    maxPrice: valueOf(sp.maxPrice) ? Number(valueOf(sp.maxPrice)) : undefined,
    page:     valueOf(sp.page) ? Number(valueOf(sp.page)) : 1,
    perPage:  valueOf(sp.perPage) ? Number(valueOf(sp.perPage)) : PAGINATION_DEFAULTS.perPage,
    sort:     (valueOf(sp.sort) as SearchParams["sort"]) || "recommended",
  });

  const result = createAsync(() => searchRooms(params()), { deferStream: true });

  const activeSort = () => valueOf(sp.sort) || "recommended";

  return (
    <div class="flex-1">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-navy/55">
          <Show when={result()}>
            Ditemukan <strong class="text-navy">{result()!.total}</strong> kamar
          </Show>
        </p>
        <CustomSelect
          value={String(valueOf(sp.perPage) || PAGINATION_DEFAULTS.perPage)}
          onChange={(v) => setSp({ perPage: v, page: "1" })}
          options={[...PAGINATION_DEFAULTS.perPageOptions].map((n) => ({ value: String(n), label: `${n} per halaman` }))}
          class="w-40"
        />
      </div>

      <div class="flex flex-wrap gap-2 mb-5">
        <For each={SORT_OPTS}>
          {(opt) => (
            <button
              type="button"
              onClick={() => setSp({ sort: opt.value, page: "1" })}
              class={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeSort() === opt.value
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "border-[#E6F0FA] text-navy/60 hover:border-accent/40"
              }`}
            >
              {opt.label}
            </button>
          )}
        </For>
      </div>

      <Show
          when={(result()?.data ?? []).length > 0}
          fallback={
            <div class="flex flex-col items-center justify-center py-20 text-center">
              <div class="w-20 h-20 bg-[#E6F0FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-navy mb-2">Kamar tidak ditemukan</h3>
              <p class="text-sm text-navy/50 max-w-sm">
                Coba ubah filter pencarian atau perluas area pencarian Anda.
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            <For each={result()?.data ?? []}>
              {(room) => <RoomCard room={room} />}
            </For>
          </div>

          <Pagination
            page={result()?.page ?? 1}
            totalPages={result()?.totalPages ?? 1}
            perPage={result()?.perPage}
            perPageOptions={[...PAGINATION_DEFAULTS.perPageOptions]}
            total={result()?.total}
          />
        </Show>
    </div>
  );
}
