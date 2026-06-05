import { createSignal, onMount, onCleanup } from "solid-js";

const STATS = [
  { value: 500,  suffix: "+", label: "Kamar Terdaftar",   icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { value: 100,  suffix: "+", label: "Pemilik Kos Aktif",  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { value: 1200, suffix: "+", label: "Penyewa Terdaftar",  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { value: 4.8,  suffix: "★", label: "Rating Rata-rata",   icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

function AnimatedNumber(props: { target: number; decimals?: number }) {
  const [val, setVal] = createSignal(0);

  onMount(() => {
    const duration  = 1800;
    const start     = performance.now();
    const startVal  = 0;
    const endVal    = props.target;

    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setVal(startVal + (endVal - startVal) * eased);
      if (progress < 1) requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  });

  return (
    <>{props.decimals ? val().toFixed(props.decimals) : Math.round(val()).toLocaleString("id-ID")}</>
  );
}

export function StatsSection() {
  let ref!: HTMLElement;
  const [visible, setVisible] = createSignal(false);

  onMount(async () => {
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.25 },
    );
    io.observe(ref);
    onCleanup(() => io.disconnect());

    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(ref.querySelector(".stats-header"), {
      opacity: 0, y: 30, duration: 0.65, ease: "power2.out",
      scrollTrigger: { trigger: ref, start: "top 82%" },
    });
    gsap.from(ref.querySelectorAll(".stat-card"), {
      opacity: 0, y: 40, scale: 0.95, duration: 0.55, stagger: 0.1, ease: "back.out(1.5)",
      scrollTrigger: { trigger: ref.querySelector(".stats-grid"), start: "top 85%" },
    });
    gsap.from(ref.querySelector(".stats-cta"), {
      opacity: 0, y: 20, duration: 0.5, ease: "power2.out",
      scrollTrigger: { trigger: ref.querySelector(".stats-cta"), start: "top 90%" },
    });
  });

  return (
    <section
      ref={ref!}
      class="py-20"
      style="background: linear-gradient(135deg, #0A2540 0%, #0d3060 60%, #0073E6 100%)"
    >
      <div class="max-w-7xl mx-auto px-5">
        <div class="stats-header text-center mb-12">
          <span class="text-xs font-bold text-white/50 uppercase tracking-widest">Statistik</span>
          <h2 class="text-3xl font-black text-white mt-1">Simako dalam Angka</h2>
          <p class="text-white/50 mt-2 text-sm">Platform kos terpercaya di Purwokerto</p>
        </div>

        <div class="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s) => (
            <div class="stat-card text-center bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={s.icon} />
                </svg>
              </div>
              <div class="text-3xl font-black text-white mb-1">
                {visible() ? <AnimatedNumber target={s.value} decimals={s.suffix === "★" ? 1 : 0} /> : "0"}
                <span class="text-accent">{s.suffix}</span>
              </div>
              <div class="text-sm text-white/55">{s.label}</div>
            </div>
          ))}
        </div>

        <div class="stats-cta mt-12 text-center">
          <p class="text-white/50 text-sm mb-5">Belum punya akun? Daftar gratis sekarang.</p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/auth/register"
              class="px-6 py-3 bg-white text-navy font-bold rounded-xl hover:bg-[#E6F0FA] transition-colors shadow-sm"
            >
              Daftar sebagai Penyewa
            </a>
            <a
              href="/auth/register-tenant"
              class="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Daftarkan Kos Anda
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
