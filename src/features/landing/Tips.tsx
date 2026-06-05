const TIPS = [
  {
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    title: "Cek Lokasi Strategis",
    desc: "Pilih kos yang dekat dengan kampus, kantor, atau akses transportasi umum. Hemat waktu dan ongkos commuting.",
  },
  {
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "Hitung Budget Total",
    desc: "Jangan lupa hitung biaya listrik, air, dan internet. Tanyakan apakah sudah termasuk dalam harga sewa.",
  },
  {
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    title: "Kunjungi Langsung",
    desc: "Sebelum booking, kunjungi kos secara langsung. Cek kondisi kamar, fasilitas, dan lingkungan sekitar.",
  },
  {
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    title: "Tanya Penghuni Lama",
    desc: "Ajak bicara penghuni yang sudah lama. Mereka bisa memberikan informasi jujur tentang kondisi dan pemilik kos.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Baca Peraturan Kos",
    desc: "Pahami aturan kos sebelum tanda tangan kontrak. Jam malam, tamu, hewan peliharaan - semua harus jelas.",
  },
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Minta Kwitansi Pembayaran",
    desc: "Selalu minta bukti pembayaran resmi dari pemilik setiap kali membayar sewa. Simpan sebagai arsip.",
  },
];

export function Tips() {
  return (
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-5">
        <div class="text-center mb-12" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
          <span class="text-xs font-bold text-accent uppercase tracking-widest">Tips & Trik</span>
          <h2 class="text-3xl font-black text-navy mt-1">Tips Cerdas Cari Kos</h2>
          <p class="text-navy/55 mt-2 text-sm max-w-lg mx-auto">
            Panduan praktis agar Anda mendapatkan kos terbaik sesuai kebutuhan.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIPS.map((tip, i) => (
            <div
              class="group p-5 rounded-2xl border border-[#E6F0FA] bg-[#F4F7FA] hover:bg-white hover:border-accent/20 hover:shadow-lg hover:shadow-navy/5 transition-all duration-200"
              style={{ animation: `fadeUp 0.5s ease-out ${0.1 + i * 0.08}s both` }}
            >
              <div class="w-11 h-11 bg-white group-hover:bg-[#E6F0FA] rounded-xl flex items-center justify-center mb-4 shadow-sm transition-colors">
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d={tip.icon} />
                </svg>
              </div>
              <div class="text-[10px] font-black text-navy/20 mb-1">0{i + 1}</div>
              <h3 class="font-bold text-navy mb-2">{tip.title}</h3>
              <p class="text-sm text-navy/55 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
