import { Title, Meta } from "@solidjs/meta";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE } from "~/config/site";

export default function AboutPage() {
  return (
    <>
      <Title>Tentang SimaKos - {SITE.name}</Title>
      <Meta name="description" content="SimaKos adalah platform pencarian dan manajemen kos terpercaya di Purwokerto. Ketahui lebih lanjut tentang kami." />
      <Meta name="robots" content="index, follow" />

      <LandingLayout>
        <div class="bg-[#F4F7FA] pt-16">
          <div class="bg-navy py-12 px-5 text-white">
            <div class="max-w-4xl mx-auto text-center">
              <span class="text-xs font-bold text-white/40 uppercase tracking-widest">Tentang Kami</span>
              <h1 class="text-3xl sm:text-4xl font-black mt-2 mb-3">Selamat Datang di {SITE.name}</h1>
              <p class="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
                Platform pencarian dan manajemen kos terpercaya di Purwokerto & Banyumas
              </p>
            </div>
          </div>

          <div class="max-w-4xl mx-auto px-5 py-16 space-y-16">
            <section class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span class="text-xs font-bold text-accent uppercase tracking-widest">Misi Kami</span>
                <h2 class="text-2xl font-black text-navy mt-2 mb-4">Menghubungkan Penyewa dan Pemilik Kos</h2>
                <p class="text-navy/65 leading-relaxed text-sm">
                  SimaKos hadir untuk mempermudah pencarian kos di Purwokerto. Kami percaya bahwa setiap orang berhak
                  mendapatkan hunian yang nyaman dan sesuai kebutuhan, dengan proses yang transparan dan mudah.
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                {[
                  { label: "Kamar Terdaftar", value: "500+" },
                  { label: "Pemilik Kos",     value: "100+" },
                  { label: "Kota",            value: "Purwokerto" },
                  { label: "Tahun Berdiri",   value: "2024" },
                ].map((s) => (
                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-5 text-center">
                    <p class="text-2xl font-black text-accent">{s.value}</p>
                    <p class="text-xs text-navy/50 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section class="text-center">
              <span class="text-xs font-bold text-accent uppercase tracking-widest">Keunggulan</span>
              <h2 class="text-2xl font-black text-navy mt-2 mb-8">Mengapa Memilih SimaKos?</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                    title: "Terverifikasi",
                    desc:  "Semua properti diverifikasi oleh tim kami untuk memastikan kualitas dan keamanan.",
                  },
                  {
                    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                    title: "Mudah Dicari",
                    desc:  "Filter berdasarkan lokasi, harga, tipe, dan fasilitas untuk menemukan kos impian Anda.",
                  },
                  {
                    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                    title: "Langsung dari Pemilik",
                    desc:  "Tidak ada perantara. Negosiasi langsung dengan pemilik kos untuk harga terbaik.",
                  },
                ].map((f) => (
                  <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6 text-left">
                    <div class="w-12 h-12 bg-[#E6F0FA] rounded-xl flex items-center justify-center mb-4">
                      <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={f.icon} />
                      </svg>
                    </div>
                    <h3 class="font-bold text-navy mb-2">{f.title}</h3>
                    <p class="text-sm text-navy/60 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section class="bg-navy rounded-3xl p-10 text-center text-white">
              <h2 class="text-2xl font-black mb-3">Hubungi Kami</h2>
              <p class="text-white/60 text-sm mb-6">Ada pertanyaan? Kami siap membantu Anda.</p>
              <div class="flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:${SITE.contact.email}`}
                  class="px-6 py-3 bg-white text-navy font-bold rounded-xl hover:bg-[#E6F0FA] transition-colors text-sm"
                >
                  {SITE.contact.email}
                </a>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </section>
          </div>
        </div>
      </LandingLayout>
    </>
  );
}
