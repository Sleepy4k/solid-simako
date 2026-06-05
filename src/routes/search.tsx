import { Title, Meta } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SearchFilters } from "~/features/search/SearchFilters";
import { SearchResults } from "~/features/search/SearchResults";
import { SITE } from "~/config/site";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const title = sp.q
    ? `Hasil pencarian "${sp.q}" - ${SITE.name}`
    : `Cari Kos di Purwokerto - ${SITE.name}`;

  let headerRef!: HTMLDivElement;

  onMount(async () => {
    const { gsap } = await import("gsap");
    gsap.from(headerRef, { opacity: 0, y: -20, duration: 0.55, ease: "power2.out" });
  });

  return (
    <>
      <Title>{title}</Title>
      <Meta
        name="description"
        content={`Temukan kos terbaik di Purwokerto${sp.q ? ` untuk "${sp.q}"` : ""}. Harga terjangkau, lokasi strategis.`}
      />
      <Meta name="robots" content="noindex, follow" />

      <LandingLayout>
        <div class="bg-[#F4F7FA] pt-16 min-h-screen">
          <div ref={headerRef!} class="bg-navy py-8 px-5 text-white">
            <div class="max-w-7xl mx-auto">
              <p class="text-white/50 text-xs mb-1 uppercase tracking-wider">{SITE.name}</p>
              <h1 class="text-2xl font-black mb-1">
                {sp.q ? `Hasil untuk "${sp.q}"` : "Semua Kos di Purwokerto"}
              </h1>
              <p class="text-white/55 text-sm">Purwokerto & sekitarnya</p>
            </div>
          </div>

          <div class="max-w-7xl mx-auto px-5 py-6">
            <SearchFilters />
            <SearchResults />
          </div>
        </div>
      </LandingLayout>
    </>
  );
}
