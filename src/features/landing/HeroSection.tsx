import { createSignal, Show, For, createEffect, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { PURWOKERTO_DISTRICTS, KOST_TYPE_LABELS, GENDER_TYPE_LABELS } from "~/config/site";
import { liveSearchAction } from "~/server/actions/search";
import type { SearchPreviewItem, KostType, GenderType } from "~/types";
import { A } from "@solidjs/router";
import { CustomSelect, SearchableSelect, type SelectOption } from "~/components/ui/Select";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const TYPE_OPTIONS: SelectOption[] = Object.entries(KOST_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));
const GENDER_OPTIONS: SelectOption[] = Object.entries(GENDER_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));
const DISTRICT_OPTIONS: SelectOption[] = [...PURWOKERTO_DISTRICTS].map((d) => ({ value: d, label: d }));

export function HeroSection() {
  const navigate = useNavigate();

  onMount(async () => {
    const { gsap } = await import("gsap");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("#hero-title",    { opacity: 0, y: 40,  duration: 0.7 })
      .from("#hero-subtitle", { opacity: 0, y: 20,  duration: 0.5 }, "-=0.3")
      .from("#hero-search",   { opacity: 0, y: 30,  scale: 0.97, duration: 0.6 }, "-=0.2");
  });

  const [query,       setQuery]       = createSignal("");
  const [type,        setType]        = createSignal<KostType | "">("");
  const [gender,      setGender]      = createSignal<GenderType | "">("");
  const [district,    setDistrict]    = createSignal("");
  const [previews,    setPreviews]    = createSignal<SearchPreviewItem[]>([]);
  const [loadingPrev, setLoadingPrev] = createSignal(false);
  const [dropOpen,    setDropOpen]    = createSignal(false);

  let debounce: ReturnType<typeof setTimeout>;

  createEffect(() => {
    const q = query();
    clearTimeout(debounce);
    if (!q || q.trim().length < 2) { setPreviews([]); setDropOpen(false); return; }
    debounce = setTimeout(async () => {
      setLoadingPrev(true);
      const res = await liveSearchAction(q);
      setPreviews(res);
      setDropOpen(true);
      setLoadingPrev(false);
    }, 320);
    onCleanup(() => clearTimeout(debounce));
  });

  const doSearch = () => {
    const params = new URLSearchParams();
    if (query().trim()) params.set("q",      query().trim());
    if (type())         params.set("type",   type());
    if (gender())       params.set("gender", gender());
    if (district())     params.set("city",   district());
    navigate(`/search?${params.toString()}`);
    setDropOpen(false);
  };

  return (
    <section
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
      style="background: linear-gradient(135deg, #0A2540 0%, #0d3060 50%, #0073E6 100%)"
    >
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="animate-blob1 absolute top-16 left-10 w-80 h-80 rounded-full bg-white/10 blur-3xl opacity-60" />
        <div class="animate-blob2 absolute bottom-16 right-10 w-96 h-96 rounded-full bg-accent/25 blur-3xl opacity-70" />
        <div class="animate-blob3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-2xl opacity-40" />
        <div class="animate-blob2 absolute top-10 right-1/3 w-48 h-48 rounded-full bg-blue-400/15 blur-2xl" style="animation-delay: -4s" />
      </div>

      <div
        class="absolute inset-0 opacity-5"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 32px 32px"
      />

      <div class="relative z-10 max-w-5xl mx-auto px-5 py-32 text-center">
        <h1 id="hero-title" class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5">
          Temukan Kos{" "}
          <span
            style="-webkit-text-fill-color: transparent; -webkit-background-clip: text; background-clip: text; background-image: linear-gradient(90deg, #60d8ff, #a0f0ff);"
          >
            Impianmu
          </span>
          <br />
          di Purwokerto
        </h1>

        <p id="hero-subtitle" class="text-lg text-white/65 max-w-xl mx-auto mb-10 leading-relaxed">
          Platform pencarian kos terpercaya untuk mahasiswa dan pekerja di area Purwokerto & Banyumas.
          Ribuan pilihan, langsung dari pemilik.
        </p>

        <div id="hero-search" class="relative mx-auto w-full max-w-3xl" style="width: min(100%, 75vw + 200px)">
          <div class="bg-white rounded-2xl shadow-2xl border-2 border-white/50 p-4 sm:p-5">
            <div class="relative mb-3">
              <input
                type="text"
                placeholder="Cari nama kos, jalan, atau area…"
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onFocus={() => query().trim().length >= 2 && setDropOpen(true)}
                onBlur={() => setTimeout(() => setDropOpen(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                class="w-full pl-5 pr-12 py-4 rounded-xl border border-slate-200 text-navy text-base placeholder-navy/35 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              <CustomSelect
                value={type()}
                onChange={(v) => setType(v as KostType | "")}
                options={TYPE_OPTIONS}
                placeholder="Semua Tipe"
              />
              <CustomSelect
                value={gender()}
                onChange={(v) => setGender(v as GenderType | "")}
                options={GENDER_OPTIONS}
                placeholder="Semua Penghuni"
              />
              <SearchableSelect
                value={district()}
                onChange={setDistrict}
                options={DISTRICT_OPTIONS}
                placeholder="Semua Area"
                searchPlaceholder="Cari kecamatan..."
              />
            </div>

            <button
              type="button"
              onClick={doSearch}
              class="w-full bg-accent hover:bg-accent-dark text-white font-black py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-accent/30 flex items-center justify-center gap-2.5 text-base active:scale-[0.99]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Kos Sekarang
            </button>

            <Show when={dropOpen() && query().trim().length >= 2}>
              <div class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#E6F0FA] z-50 overflow-hidden">
                <Show
                  when={!loadingPrev()}
                  fallback={<div class="p-4 text-center text-sm text-navy/40">Mencari…</div>}
                >
                  <Show
                    when={previews().length > 0}
                    fallback={<div class="p-4 text-sm text-navy/40 text-center">Tidak ada hasil untuk "{query()}"</div>}
                  >
                    <ul class="divide-y divide-[#F4F7FA] max-h-72 overflow-y-auto scrollbar-thin">
                      <For each={previews()}>
                        {(item) => (
                          <li>
                            <A
                              href={`/kost/${item.slug}`}
                              class="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F7FA] transition-colors"
                              onClick={() => setDropOpen(false)}
                            >
                              <div class="w-10 h-10 bg-[#E6F0FA] rounded-lg flex-shrink-0 flex items-center justify-center">
                                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </div>
                              <div class="flex-1 min-w-0 text-left">
                                <p class="text-sm font-semibold text-navy truncate">{item.name}</p>
                                <p class="text-xs text-navy/50 truncate">{item.address}</p>
                              </div>
                              <p class="text-xs font-bold text-accent flex-shrink-0">{fmt(item.minPrice)}/bl</p>
                            </A>
                          </li>
                        )}
                      </For>
                    </ul>
                    <div class="px-4 py-2 bg-[#F4F7FA] text-center border-t border-[#E6F0FA]">
                      <button
                        type="button"
                        onClick={doSearch}
                        class="text-xs text-accent font-bold hover:underline"
                      >
                        Lihat semua hasil untuk "{query()}"
                      </button>
                    </div>
                  </Show>
                </Show>
              </div>
            </Show>
          </div>
        </div>

      </div>

      <div class="absolute bottom-0 left-0 right-0 translate-y-px">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" class="block w-full h-auto">
          <path d="M0,50 C240,90 480,20 720,50 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" fill="#F4F7FA" />
        </svg>
      </div>
    </section>
  );
}
