import { onMount } from "solid-js";

const STEPS = [
  {
    n: "01",
    title: "Cari & Pilih Kos",
    desc: "Temukan kos yang sesuai dengan kebutuhan dan budget Anda menggunakan fitur pencarian canggih kami.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    color: "bg-blue-50 text-accent",
  },
  {
    n: "02",
    title: "Ajukan Booking",
    desc: "Pilih tanggal masuk dan durasi sewa. Isi formulir booking dengan lengkap dan benar.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "bg-purple-50 text-purple-600",
  },
  {
    n: "03",
    title: "Transfer Pembayaran",
    desc: "Lakukan transfer ke rekening pemilik kos sesuai nominal. Upload bukti transfer melalui aplikasi.",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    color: "bg-green-50 text-green-600",
  },
  {
    n: "04",
    title: "Konfirmasi & Masuk",
    desc: "Setelah pembayaran diverifikasi pemilik (1x24 jam), Anda siap menempati kamar kos!",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-orange-50 text-orange-500",
  },
];

export function BookingGuide() {
  let sectionRef!: HTMLElement;

  onMount(async () => {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef, start: "top 80%" },
    });
    tl.from(sectionRef.querySelector(".guide-header"), {
      opacity: 0, y: 30, duration: 0.6, ease: "power2.out",
    }).from(sectionRef.querySelectorAll(".guide-step"), {
      opacity: 0, y: 40, duration: 0.55, stagger: 0.12, ease: "power2.out",
    }, "-=0.2").from(sectionRef.querySelector(".guide-cta"), {
      opacity: 0, y: 20, duration: 0.4, ease: "power2.out",
    }, "-=0.1");
  });

  return (
    <section ref={sectionRef!} class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-5">
        <div class="guide-header text-center mb-12">
          <span class="text-xs font-bold text-accent uppercase tracking-widest">Panduan</span>
          <h2 class="text-3xl font-black text-navy mt-1">Cara Booking di Simako</h2>
          <p class="text-navy/55 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            Proses booking mudah dan transparan. Tidak ada biaya tersembunyi - langsung dari penyewa ke pemilik.
          </p>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="hidden lg:block absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-accent/30 via-accent to-accent/30 z-0" />

          {STEPS.map((s) => (
            <div class="guide-step relative z-10 flex flex-col items-center text-center group">
              <div class={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={s.icon} />
                </svg>
              </div>
              <div class="text-xs font-black text-navy/25 mb-1">{s.n}</div>
              <h3 class="font-bold text-navy mb-2">{s.title}</h3>
              <p class="text-sm text-navy/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div class="guide-cta mt-12 text-center">
          <a
            href="/search"
            class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg hover:shadow-accent/25"
          >
            Mulai Cari Kos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
