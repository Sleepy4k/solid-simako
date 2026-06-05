import { createAsync } from "@solidjs/router";
import { For, Show, Suspense, onMount } from "solid-js";
import { getRecommendedRooms } from "~/server/actions/rooms";
import { RoomCard } from "./RoomCard";

function RoomSkeleton() {
  return (
    <div class="bg-white rounded-2xl border border-[#E6F0FA] overflow-hidden animate-pulse">
      <div class="h-44 bg-[#E6F0FA]" />
      <div class="p-4 space-y-3">
        <div class="h-4 bg-[#E6F0FA] rounded w-3/4" />
        <div class="h-3 bg-[#E6F0FA] rounded w-1/2" />
        <div class="flex gap-2">
          <div class="h-5 w-12 bg-[#E6F0FA] rounded-full" />
          <div class="h-5 w-10 bg-[#E6F0FA] rounded-full" />
        </div>
        <div class="h-5 bg-[#E6F0FA] rounded w-2/5 mt-auto" />
      </div>
    </div>
  );
}

function RoomsGrid() {
  const rooms = createAsync(() => getRecommendedRooms(8));

  return (
    <Show
      when={(rooms() ?? []).length > 0}
      fallback={
        <p class="text-center text-navy/50 col-span-full py-12">
          Belum ada kamar yang tersedia saat ini.
        </p>
      }
    >
      <For each={rooms()}>
        {(room, idx) => (
          <div style={{ animation: `fadeUp 0.5s ease-out ${idx() * 0.07}s both` }}>
            <RoomCard room={room} index={idx()} />
          </div>
        )}
      </For>
    </Show>
  );
}

export function RecommendedRooms() {
  let sectionRef!: HTMLElement;

  onMount(async () => {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(sectionRef.querySelectorAll(".rec-reveal"), {
      opacity: 0, y: 28, duration: 0.65, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef, start: "top 82%" },
    });
  });

  return (
    <section ref={sectionRef!} class="py-20 bg-[#F4F7FA]">
      <div class="max-w-7xl mx-auto px-5">
        <div class="rec-reveal flex items-end justify-between mb-8 gap-4">
          <div>
            <span class="text-xs font-bold text-accent uppercase tracking-widest">Rekomendasi</span>
            <h2 class="text-3xl font-black text-navy mt-1">Kos Terpopuler</h2>
            <p class="text-navy/55 mt-1.5 text-sm">
              Dipilih berdasarkan popularitas, rating, dan ketersediaan
            </p>
          </div>
          <a
            href="/search"
            class="flex-shrink-0 text-sm font-semibold text-accent hover:text-accent-dark flex items-center gap-1 transition-colors"
          >
            Lihat semua
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="rec-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <Suspense
            fallback={
              <For each={Array.from({ length: 8 })}>
                {() => <RoomSkeleton />}
              </For>
            }
          >
            <RoomsGrid />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
