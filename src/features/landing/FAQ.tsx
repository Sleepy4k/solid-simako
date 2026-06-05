import { createSignal, For, onMount } from "solid-js";

const FAQS = [
  {
    q: "Apakah Simako gratis untuk pengguna?",
    a: "Ya, mencari dan melihat informasi kos di Simako sepenuhnya gratis untuk pengguna. Anda hanya perlu membayar sewa langsung ke pemilik kos.",
  },
  {
    q: "Bagaimana cara pembayaran sewa dilakukan?",
    a: "Pembayaran dilakukan secara manual melalui transfer bank langsung ke rekening pemilik kos. Upload bukti transfer, dan pemilik akan mengkonfirmasi dalam 1x24 jam kerja. Tidak ada perantara pembayaran.",
  },
  {
    q: "Apakah kos yang terdaftar sudah diverifikasi?",
    a: "Setiap pemilik kos (tenant) yang mendaftar di Simako melalui proses verifikasi oleh admin kami sebelum listing mereka ditampilkan. Kami memastikan informasi yang ditampilkan akurat dan terpercaya.",
  },
  {
    q: "Bisakah saya membatalkan booking?",
    a: "Kebijakan pembatalan tergantung pada masing-masing pemilik kos. Umumnya, deposit dapat dikembalikan jika pembatalan dilakukan lebih dari 7 hari sebelum tanggal masuk. Cek syarat dan ketentuan masing-masing kos.",
  },
  {
    q: "Apa yang harus dilakukan jika ada masalah dengan kos?",
    a: "Hubungi pemilik kos langsung melalui fitur pesan di aplikasi. Jika masalah tidak terselesaikan, tim Simako siap membantu melalui fitur laporan atau email support kami.",
  },
  {
    q: "Bagaimana cara mendaftarkan kos saya di Simako?",
    a: "Daftar sebagai Tenant melalui halaman Register Tenant. Lengkapi profil dan informasi properti Anda, kemudian tunggu verifikasi admin (1-3 hari kerja). Setelah disetujui, listing Anda langsung tayang.",
  },
  {
    q: "Apakah Simako hanya untuk Purwokerto?",
    a: "Saat ini Simako berfokus pada wilayah Purwokerto dan sekitarnya (termasuk Banyumas, Sokaraja, dan daerah terdekat). Kami berencana memperluas ke kota lain di masa mendatang.",
  },
];

export function FAQ() {
  let sectionRef!: HTMLElement;
  const [openSet, setOpenSet] = createSignal<Set<number>>(new Set());

  onMount(async () => {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(sectionRef.querySelector(".faq-header"), {
      opacity: 0, y: 28, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef, start: "top 82%" },
    });
    gsap.from(sectionRef.querySelectorAll(".faq-item"), {
      opacity: 0, y: 22, duration: 0.5, stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.querySelector(".faq-list"), start: "top 85%" },
    });
  });

  const isOpen  = (i: number) => openSet().has(i);
  const toggle  = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section ref={sectionRef!} class="py-20 bg-[#F4F7FA]">
      <div class="max-w-3xl mx-auto px-5">
        <div class="faq-header text-center mb-10">
          <span class="text-xs font-bold text-accent uppercase tracking-widest">FAQ</span>
          <h2 class="text-3xl font-black text-navy mt-1">Pertanyaan Umum</h2>
          <p class="text-navy/55 mt-2 text-sm">Tidak menemukan jawaban? Hubungi kami langsung.</p>
        </div>

        <div class="faq-list space-y-3">
          <For each={FAQS}>
            {(faq, i) => (
              <div class="faq-item bg-white rounded-2xl border border-[#E6F0FA] shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(i())}
                  class="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-[#F4F7FA] transition-colors"
                  aria-expanded={isOpen(i())}
                >
                  <span class="font-semibold text-navy text-sm leading-snug">{faq.q}</span>
                  <svg
                    class="w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen(i()) ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  class="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    "max-height": isOpen(i()) ? "300px" : "0px",
                    opacity:      isOpen(i()) ? "1" : "0",
                  }}
                >
                  <div class="px-5 pb-4 pt-3 text-sm text-navy/65 leading-relaxed border-t border-[#E6F0FA]">
                    {faq.a}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
