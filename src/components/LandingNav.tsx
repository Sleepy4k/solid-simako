import { createSignal, onMount, onCleanup, Show, For, createEffect } from "solid-js";
import { A, useNavigate, useLocation } from "@solidjs/router";
import Search from "lucide-solid/icons/search";
import Menu from "lucide-solid/icons/menu";
import X from "lucide-solid/icons/x";
import Building2 from "lucide-solid/icons/building-2";
import { SITE, KOST_TYPE_LABELS } from "~/config/site";
import { liveSearchAction } from "~/server/actions/search";
import type { SearchPreviewItem } from "~/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export function LandingNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled,    setScrolled]    = createSignal(false);
  const [drawerOpen,  setDrawerOpen]  = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [searchFocus, setSearchFocus] = createSignal(false);
  const [previews,    setPreviews]    = createSignal<SearchPreviewItem[]>([]);
  const [loadingPrev, setLoadingPrev] = createSignal(false);

  let debounce: ReturnType<typeof setTimeout>;

  const isHome = () => location.pathname === "/";
  const showBg = () => !isHome() || scrolled();

  const onScroll = () => setScrolled(window.scrollY > 60);

  onMount(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  createEffect(() => {
    if (drawerOpen()) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    onCleanup(() => { document.body.style.overflow = ""; });
  });

  createEffect(() => {
    const q = searchQuery();
    clearTimeout(debounce);
    if (!q || q.trim().length < 2) { setPreviews([]); return; }
    debounce = setTimeout(async () => {
      setLoadingPrev(true);
      const res = await liveSearchAction(q);
      setPreviews(res);
      setLoadingPrev(false);
    }, 320);
    onCleanup(() => clearTimeout(debounce));
  });

  const submitSearch = () => {
    const q = searchQuery().trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setPreviews([]);
    setSearchFocus(false);
  };

  const showPreview = () => searchFocus() && searchQuery().trim().length >= 2;

  const NAV_LINKS = [
    { href: "/",                   label: "Beranda" },
    { href: "/search",             label: "Cari Kos" },
    { href: "/about",              label: "Tentang Kami" },
    { href: "/auth/login",         label: "Masuk" },
    { href: "/auth/register",      label: "Daftar" },
  ];

  return (
    <>
      <header
        class={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          showBg()
            ? "bg-navy/97 backdrop-blur-md shadow-xl shadow-navy/20"
            : "bg-transparent"
        }`}
      >
        <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <A href="/" class="flex items-center gap-3 flex-shrink-0">
            <div class="w-9 h-9 bg-accent rounded-xl flex items-center justify-center font-black text-white text-sm shadow-inner select-none">SK</div>
            <div class="hidden sm:block">
              <div class="font-black text-white text-base leading-tight tracking-tight">{SITE.name}</div>
              <div class="text-[10px] text-white/40 leading-tight">Purwokerto</div>
            </div>
          </A>

          <Show when={showBg()}>
            <div class="flex-1 max-w-md relative hidden md:block" style="animation:fadeIn .2s ease-out">
              <input
                type="text"
                placeholder="Cari nama kos, lokasi…"
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                class="w-full h-10 pl-4 pr-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all"
              />
              <button type="button" onClick={submitSearch} class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-white">
                <Search class="w-4 h-4" />
              </button>
              <Show when={showPreview()}>
                <SearchDropdown items={previews()} loading={loadingPrev()} query={searchQuery()} onClose={() => setPreviews([])} />
              </Show>
            </div>
          </Show>

          <div class="flex items-center gap-2">
            <nav class="hidden lg:flex items-center gap-1">
              <For each={NAV_LINKS.slice(0, 2)}>
                {(link) => (
                  <A
                    href={link.href}
                    class="px-3 py-2 rounded-lg text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                    activeClass="text-white bg-white/10"
                    end={link.href === "/"}
                  >
                    {link.label}
                  </A>
                )}
              </For>
            </nav>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menu"
              class="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <Show when={drawerOpen()}>
        <>
        <div
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          style="animation:fadeIn .2s ease-out"
        />
        <aside
          class="fixed top-0 right-0 bottom-0 z-50 w-72 bg-navy shadow-2xl flex flex-col"
          style="animation:slideLeft .2s ease-out"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-xs font-black text-white">SK</div>
              <span class="font-bold text-white">{SITE.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              class="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
            <For each={NAV_LINKS}>
              {(link) => (
                <A
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  activeClass="text-white bg-white/10"
                  end={link.href === "/"}
                >
                  {link.label}
                </A>
              )}
            </For>
          </nav>

          <div class="px-4 py-5 border-t border-white/10">
            <A
              href="/auth/register-tenant"
              onClick={() => setDrawerOpen(false)}
              class="block w-full text-center bg-accent hover:bg-accent-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Daftarkan Kos Anda
            </A>
          </div>
        </aside>
        </>
      </Show>
    </>
  );
}

function SearchDropdown(props: { items: SearchPreviewItem[]; loading: boolean; query: string; onClose: () => void }) {
  return (
    <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E6F0FA] overflow-hidden z-50">
      <Show
        when={!props.loading}
        fallback={<div class="p-4 text-center text-sm text-navy/40">Mencari…</div>}
      >
        <Show
          when={props.items.length > 0}
          fallback={<div class="p-4 text-sm text-navy/40 text-center">Tidak ada hasil untuk "{props.query}"</div>}
        >
          <ul class="divide-y divide-[#F4F7FA]">
            <For each={props.items}>
              {(item) => (
                <li>
                  <A
                    href={`/kost/${item.slug}`}
                    class="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F7FA] transition-colors"
                    onClick={props.onClose}
                  >
                    <div class="w-10 h-10 bg-[#E6F0FA] rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Building2 class="w-5 h-5 text-accent" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-navy truncate">{item.name}</p>
                      <p class="text-xs text-navy/50 truncate">{item.address}</p>
                    </div>
                    <p class="text-xs font-bold text-accent flex-shrink-0">{fmt(item.minPrice)}/bl</p>
                  </A>
                </li>
              )}
            </For>
          </ul>
          <div class="px-4 py-2.5 bg-[#F4F7FA] border-t border-[#E6F0FA]">
            <A
              href={`/search?q=${encodeURIComponent(props.query)}`}
              onClick={props.onClose}
              class="text-xs text-accent font-semibold hover:underline"
            >
              Lihat semua hasil
            </A>
          </div>
        </Show>
      </Show>
    </div>
  );
}
