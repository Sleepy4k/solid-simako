import { A } from '@solidjs/router';
import { Search, MapPin, ArrowRight, Shield, Star, Building2 } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { KostCard } from '~/components/shared/KostCard';
import { Button, ButtonLink } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const KAMPUS = [
  { id: 'ittp', nama: 'ITTP', kota: 'Purbalingga', jumlah: 52 },
  { id: 'unsoed', nama: 'UNSOED', kota: 'Grendeng', jumlah: 143 },
  { id: 'ump', nama: 'UMP', kota: 'Dukuhwaluh', jumlah: 71 },
  { id: 'un-saku', nama: 'UN Saku', kota: 'Karangwangkal', jumlah: 38 },
  { id: 'amikom', nama: 'Amikom', kota: 'Purwokerto', jumlah: 24 },
];

const KOST_POPULER = [
  { slug: 'kost-putri-bunga-anggrek', nama: 'Kost Putri Bunga Anggrek', lokasi: 'Bobosan', kampus: 'ITTP', jarak: '400m', harga: 950000, rating: 4.8, isVerified: true, jenis: 'Putri' },
  { slug: 'wisma-permana-unsoed', nama: 'Wisma Permana UNSOED', lokasi: 'Grendeng', kampus: 'UNSOED', jarak: '150m', harga: 1200000, rating: 4.6, isVerified: true, jenis: 'Campur' },
  { slug: 'griya-soka-boarding', nama: 'Griya Soka Boarding', lokasi: 'Watumas', kampus: 'ITTP', jarak: '1,1km', harga: 1300000, rating: 4.7, isVerified: true, jenis: 'Campur' },
  { slug: 'kost-bu-tini-karangwangkal', nama: 'Kost Bu Tini Karangwangkal', lokasi: 'Karangwangkal', kampus: 'UN Saku', jarak: '800m', harga: 650000, rating: 4.4, isVerified: true, jenis: 'Putri' },
];

export default function BerandaPage() {
  return (
    <PublicLayout>
      <SEO
        title="Cari Kost dekat Kampus di Purwokerto"
        description="Simako — marketplace kost terpercaya di Purwokerto. Transfer manual, verifikasi human-checked, dekat kampus UNSOED, ITTP, UMP."
      />

      {/* Hero */}
      <section class="relative overflow-hidden bg-white px-4 pb-16 pt-12 lg:px-8">
        <div class="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div class="relative mx-auto max-w-7xl">
          <p class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            <MapPin class="size-3" />
            Khusus Purwokerto & sekitarnya
          </p>
          <h1 class="max-w-2xl text-4xl font-black leading-tight text-ink lg:text-5xl">
            Cari kost dekat kampus di{' '}
            <span class="text-primary">Purwokerto</span>, tanpa drama.
          </h1>
          <p class="mt-4 max-w-xl text-base text-slate-500">
            Listing diverifikasi, transfer langsung ke owner, bukti bayar dicek tim kami. Sederhana, manusiawi.
          </p>

          {/* Search box */}
          <div class="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
            <select class="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>IT Telkom Purwokerto</option>
              <option>UNSOED</option>
              <option>UMP</option>
              <option>UN Saku</option>
              <option>Amikom</option>
            </select>
            <input
              type="text"
              placeholder="Tipe kamar / fasilitas"
              class="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button class="shrink-0 gap-2">
              <Search class="size-4" />
              Cari Kost
            </Button>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            {['ITTP', 'UNSOED', 'UMP', 'UN Saku'].map((k) => (
              <A
                href={`${ROUTES.CARI_KOST}?kampus=${k.toLowerCase()}`}
                class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-primary hover:text-primary"
              >
                {k}
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* Kost Populer */}
      <section class="bg-slate-50 px-4 py-12 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="mb-6 flex items-end justify-between">
            <div>
              <h2 class="text-xl font-bold text-ink">Kost populer di Purwokerto</h2>
              <p class="text-sm text-slate-500">148 kost aktif · 312 owner terverifikasi</p>
            </div>
            <A href={ROUTES.CARI_KOST} class="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Lihat semua <ArrowRight class="size-4" />
            </A>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KOST_POPULER.map((k) => <KostCard {...k} />)}
          </div>
        </div>
      </section>

      {/* Kampus */}
      <section class="bg-white px-4 py-12 lg:px-8" id="kampus">
        <div class="mx-auto max-w-7xl">
          <h2 class="mb-2 text-xl font-bold text-ink">Cari berdasarkan kampus</h2>
          <p class="mb-6 text-sm text-slate-500">Temukan kost di sekitar kampus favoritmu</p>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {KAMPUS.map((k) => (
              <A
                href={`${ROUTES.CARI_KOST}?kampus=${k.id}`}
                class="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center transition hover:border-primary/30 hover:bg-primary-light"
              >
                <div class="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Building2 class="size-5 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-bold text-ink">{k.nama}</p>
                  <p class="text-xs text-slate-400">{k.kota}</p>
                  <p class="text-xs font-medium text-primary">{k.jumlah} kost</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Mitra */}
      <section class="bg-navy px-4 py-16 lg:px-8" id="mitra">
        <div class="mx-auto flex max-w-7xl flex-col items-start gap-10 lg:flex-row lg:items-center">
          <div class="flex-1">
            <p class="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">Untuk pemilik kost</p>
            <h2 class="text-2xl font-black leading-tight text-white lg:text-3xl">
              Jadi Mitra Owner SIMAKO.<br />Kelola kostmu tanpa ribet.
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-white/70">
              Listing gratis selamanya, dashboard manajemen kamar, dari tiket sewa hingga verifikasi pembayaran.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={ROUTES.DAFTAR_MITRA} size="lg">Daftar Mitra Owner</ButtonLink>
              <Button variant="ghost" class="text-white hover:bg-white/10">Pelajari dulu</Button>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 lg:w-64 lg:grid-cols-1">
            {[{ value: '67', label: 'Mitra aktif' }, { value: '248', label: 'Kamar terdaftar' }, { value: 'Rp 1,2M', label: 'Transaksi/bulan' }].map((s) => (
              <div class="rounded-2xl bg-white/10 p-4 text-center">
                <p class="text-2xl font-black text-white">{s.value}</p>
                <p class="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section class="bg-white px-4 py-12 lg:px-8" id="bantuan">
        <div class="mx-auto max-w-7xl">
          <div class="mb-8 flex items-end justify-between">
            <h2 class="text-xl font-bold text-ink">Bantuan & cara kerja</h2>
            <A href="/#faq" class="text-sm font-semibold text-primary hover:underline">Pusat bantuan →</A>
          </div>
          <div class="grid gap-6 sm:grid-cols-3">
            {[
              { icon: <Search class="size-6" />, title: 'Cara menyewa kost', desc: 'Cari, filter, dan booking kost favoritmu. Transfer langsung ke owner — tidak ada pihak ketiga.' },
              { icon: <Shield class="size-6" />, title: 'Pembayaran manual aman?', desc: 'Upload bukti transfer, tim kami verifikasi dalam ≤6 jam. Tidak ada dana yang kami pegang.' },
              { icon: <Star class="size-6" />, title: 'Owner palsu bagaimana?', desc: 'Setiap owner wajib KYC: foto KTP + selfie. Properti yang listed sudah dicek admin.' },
            ].map((item) => (
              <div class="rounded-2xl border border-slate-100 p-6">
                <div class="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-light text-primary">{item.icon}</div>
                <h3 class="mb-1.5 text-sm font-bold text-ink">{item.title}</h3>
                <p class="text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
