import { TrendingUp, ShieldCheck, Users } from 'lucide-solid';
import { For } from 'solid-js';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { ButtonLink } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const CARA_KERJA = [
  { step: 1, title: 'Daftar gratis', desc: 'Isi data diri + unggah KTP' },
  { step: 2, title: 'Verifikasi KYC', desc: 'Tim review <1 hari kerja' },
  { step: 3, title: 'Listing kost', desc: 'Foto, harga, fasilitas — siap tayang' },
  { step: 4, title: 'Terima sewa', desc: 'Bayar langsung via transfer' },
];

const BENEFITS = [
  {
    icon: <TrendingUp class="size-6" />,
    title: 'Listing gratis, tanpa komisi',
    desc: 'Kamu tidak membayar biaya apapun ke Simako. Pendapatan langsung masuk ke rekening kamu.',
  },
  {
    icon: <ShieldCheck class="size-6" />,
    title: 'Verifikasi calon penyewa',
    desc: 'Setiap pendaftar tervalidasi email. Kamu yang putuskan terima atau tolak booking.',
  },
  {
    icon: <Users class="size-6" />,
    title: 'Manajemen penyewa lengkap',
    desc: 'Dashboard, broadcast, tagihan bulanan, dan keluhan — semua dalam satu tempat.',
  },
];

const TESTIMONIALS = [
  {
    nama: 'Pak Slamet',
    kost: 'Kost Pak Slamet, Yogyakarta',
    teks: 'Saya hanya perlu unggah KTP sekali, dan listing langsung tayang. Penyewa makin mudah cari saya.',
  },
  {
    nama: 'Bu Lia',
    kost: 'Kost Dahlia, Bandung',
    teks: 'Verifikasi bukti transfer jauh lebih cepat dibanding manual lewat WA. Hemat waktu banyak.',
  },
];

export default function UntukMitraPage() {
  return (
    <PublicLayout>
      <SEO
        title="Untuk Pemilik Kost"
        description="Bergabung jadi Mitra Owner SIMAKO. Listing gratis, tanpa komisi, dashboard lengkap."
      />

      <section class="bg-gradient-to-br from-navy via-navy to-ink px-4 py-20 text-white lg:px-8">
        <div class="mx-auto max-w-5xl text-center">
          <p class="text-xs font-bold uppercase tracking-widest text-white/60">
            Untuk Pemilik Kost
          </p>
          <h1 class="mt-3 text-4xl font-black leading-tight lg:text-5xl">
            Listing kost <span class="text-primary">gratis selamanya</span>.
            <br />
            Pendapatan langsung ke rekeningmu.
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-base text-white/70">
            Simako mempertemukan kostmu dengan ribuan pencari kost dekat kampus. Tanpa biaya
            komisi. Pembayaran transfer langsung antara kamu dan penyewa.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href={ROUTES.DAFTAR_MITRA} size="lg">
              Daftar sebagai Mitra Owner
            </ButtonLink>
            <ButtonLink
              href={ROUTES.MASUK}
              variant="ghost"
              size="lg"
              class="text-white hover:bg-white/10"
            >
              Sudah punya akun? Masuk
            </ButtonLink>
          </div>
        </div>
      </section>

      <section class="bg-white px-4 py-16 lg:px-8">
        <div class="mx-auto max-w-5xl">
          <h2 class="mb-8 text-center text-2xl font-bold text-ink">
            Kenapa pilih Simako?
          </h2>
          <div class="grid gap-6 sm:grid-cols-3">
            <For each={BENEFITS}>
              {(b) => (
                <div class="rounded-2xl border border-slate-100 p-6">
                  <div class="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                    {b.icon}
                  </div>
                  <h3 class="text-base font-bold text-ink">{b.title}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <section class="bg-slate-50 px-4 py-16 lg:px-8">
        <div class="mx-auto max-w-5xl">
          <h2 class="mb-8 text-center text-2xl font-bold text-ink">Bagaimana cara kerjanya?</h2>
          <ol class="grid gap-4 sm:grid-cols-4">
            <For each={CARA_KERJA}>
              {(s) => (
                <li class="rounded-2xl border border-slate-100 bg-white p-5 text-center">
                  <div class="mx-auto flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <p class="mt-3 text-sm font-bold text-ink">{s.title}</p>
                  <p class="mt-1 text-xs text-slate-500">{s.desc}</p>
                </li>
              )}
            </For>
          </ol>
        </div>
      </section>

      <section class="bg-white px-4 py-16 lg:px-8">
        <div class="mx-auto max-w-5xl">
          <h2 class="mb-8 text-center text-2xl font-bold text-ink">Apa kata owner kami</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <For each={TESTIMONIALS}>
              {(t) => (
                <div class="rounded-2xl border border-slate-100 bg-white p-6">
                  <p class="text-sm leading-relaxed text-slate-700">"{t.teks}"</p>
                  <div class="mt-4 border-t border-slate-100 pt-3">
                    <p class="text-sm font-bold text-ink">{t.nama}</p>
                    <p class="text-xs text-slate-400">{t.kost}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <section class="bg-primary px-4 py-12 text-center text-white lg:px-8">
        <h2 class="text-2xl font-black">Siap mulai listing?</h2>
        <p class="mt-2 text-sm text-white/80">
          Hanya butuh 5 menit untuk mendaftar. Gratis.
        </p>
        <div class="mt-5">
          <ButtonLink
            href={ROUTES.DAFTAR_MITRA}
            size="lg"
            class="bg-white text-primary hover:bg-white/90"
          >
            Daftar Sekarang
          </ButtonLink>
        </div>
      </section>
    </PublicLayout>
  );
}
