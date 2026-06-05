import { Title, Meta } from "@solidjs/meta";
import { For } from "solid-js";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE } from "~/config/site";

const TENANT_STEPS = [
  {
    num: "01",
    title: "Daftar / Masuk",
    desc: "Buat akun gratis sebagai pencari kos. Lengkapi profil untuk pengalaman terbaik.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Cari & Filter",
    desc: "Gunakan filter lokasi, harga, tipe, dan jenis penghuni untuk menemukan kos impian.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Pesan Kamar",
    desc: "Pilih kamar yang cocok dan ajukan pemesanan. Sertakan tanggal mulai tinggal.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Bayar",
    desc: "Upload bukti transfer setelah melakukan pembayaran. Kami verifikasi dalam 1x24 jam.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Tinggal",
    desc: "Setelah pembayaran dikonfirmasi, Anda resmi menjadi penghuni. Selamat tinggal di kos baru!",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

const OWNER_STEPS = [
  {
    num: "01",
    title: "Daftar Tenant",
    desc: "Daftarkan diri sebagai pemilik kos. Lengkapi data KTP dan informasi rekening bank.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Input Properti",
    desc: "Tambahkan data kos: nama, lokasi, tipe, fasilitas, dan foto yang menarik.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Kelola Kamar",
    desc: "Tambahkan data kamar per unit: nomor, tipe, harga, ukuran, dan status tersedia.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Terima Booking",
    desc: "Notifikasi masuk saat ada penyewa yang memesan kamar Anda. Review profil penyewa.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Konfirmasi Bayar",
    desc: "Verifikasi bukti pembayaran dari penyewa dan konfirmasi booking untuk menyelesaikan proses.",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const FAQ_ITEMS = [
  {
    q: "Apakah layanan ini gratis?",
    a: "Ya, untuk mencari dan memesan kos sepenuhnya gratis. Pemilik kos mendaftarkan properti mereka tanpa biaya.",
  },
  {
    q: "Apakah kamar yang ditampilkan sudah diverifikasi?",
    a: "Setiap properti yang terdaftar akan melewati proses review oleh tim kami sebelum ditampilkan.",
  },
  {
    q: "Bagaimana proses pembayaran?",
    a: "Penyewa melakukan transfer langsung ke rekening pemilik kos, kemudian upload bukti transfer di platform kami untuk dikonfirmasi.",
  },
  {
    q: "Apa yang terjadi jika pembayaran ditolak?",
    a: "Jika bukti pembayaran tidak valid, Anda akan mendapat notifikasi dan dapat mengupload ulang bukti yang benar.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Title>Cara Kerja - {SITE.name}</Title>
      <Meta name="description" content={`Pelajari cara menggunakan ${SITE.name} untuk mencari kos atau mendaftarkan properti kos Anda di ${SITE.city}.`} />

      <LandingLayout>
        <div class="bg-[#F4F7FA] min-h-screen pt-16">
          <div class="bg-navy py-12 px-5 text-white">
            <div class="max-w-4xl mx-auto text-center">
              <p class="text-white/50 text-xs mb-2 uppercase tracking-wider">{SITE.name}</p>
              <h1 class="text-3xl font-black mb-3">Cara Kerja {SITE.name}</h1>
              <p class="text-white/60 text-sm max-w-lg mx-auto">
                Platform mudah untuk mencari kos impian atau mendaftarkan properti kos Anda di {SITE.city}.
              </p>
            </div>
          </div>

          <div class="max-w-5xl mx-auto px-5 py-12 space-y-14">
            <section>
              <div class="text-center mb-8">
                <span class="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-3">Pencari Kos</span>
                <h2 class="text-2xl font-black text-navy">Untuk Pencari Kos</h2>
                <p class="text-navy/50 text-sm mt-2">Temukan dan huni kos impian Anda dalam 5 langkah mudah</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <For each={TENANT_STEPS}>
                  {(step, i) => (
                    <div class="relative bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md transition-shadow">
                      <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-3">
                        {step.icon}
                      </div>
                      <span class="text-[10px] font-black text-accent/60 tracking-widest uppercase">Langkah {step.num}</span>
                      <h3 class="font-black text-navy text-sm mt-1 mb-1.5">{step.title}</h3>
                      <p class="text-xs text-navy/55 leading-relaxed">{step.desc}</p>
                      {i() < TENANT_STEPS.length - 1 && (
                        <div class="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                          <svg class="w-4 h-4 text-navy/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </For>
              </div>
              <div class="text-center mt-6">
                <a href="/search" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-black px-6 py-3 rounded-xl text-sm transition-colors">
                  Mulai Cari Kos
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>

            <section>
              <div class="text-center mb-8">
                <span class="inline-block px-3 py-1 bg-navy/10 text-navy text-xs font-bold rounded-full uppercase tracking-wider mb-3">Pemilik Kos</span>
                <h2 class="text-2xl font-black text-navy">Untuk Pemilik Kos</h2>
                <p class="text-navy/50 text-sm mt-2">Kelola properti kos Anda dengan mudah dan efisien</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <For each={OWNER_STEPS}>
                  {(step, i) => (
                    <div class="relative bg-white rounded-2xl border border-[#E6F0FA] p-5 hover:shadow-md transition-shadow">
                      <div class="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center text-navy mb-3">
                        {step.icon}
                      </div>
                      <span class="text-[10px] font-black text-navy/40 tracking-widest uppercase">Langkah {step.num}</span>
                      <h3 class="font-black text-navy text-sm mt-1 mb-1.5">{step.title}</h3>
                      <p class="text-xs text-navy/55 leading-relaxed">{step.desc}</p>
                      {i() < OWNER_STEPS.length - 1 && (
                        <div class="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                          <svg class="w-4 h-4 text-navy/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </For>
              </div>
              <div class="text-center mt-6">
                <a href="/auth/register-tenant" class="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white font-black px-6 py-3 rounded-xl text-sm transition-colors">
                  Daftar Sebagai Pemilik
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>

            <section>
              <div class="text-center mb-8">
                <h2 class="text-2xl font-black text-navy">Pertanyaan Umum</h2>
                <p class="text-navy/50 text-sm mt-2">
                  Ada pertanyaan lain? Baca <a href="/terms" class="text-accent hover:underline">Syarat & Ketentuan</a> atau <a href="/contact" class="text-accent hover:underline">hubungi kami</a>.
                </p>
              </div>
              <div class="space-y-3 max-w-2xl mx-auto">
                <For each={FAQ_ITEMS}>
                  {(item) => (
                    <div class="bg-white rounded-2xl border border-[#E6F0FA] p-5">
                      <h3 class="font-black text-navy text-sm mb-2 flex items-start gap-2">
                        <span class="text-accent flex-shrink-0 mt-0.5">?</span>
                        {item.q}
                      </h3>
                      <p class="text-sm text-navy/60 leading-relaxed ml-5">{item.a}</p>
                    </div>
                  )}
                </For>
              </div>
            </section>
          </div>
        </div>
      </LandingLayout>
    </>
  );
}
