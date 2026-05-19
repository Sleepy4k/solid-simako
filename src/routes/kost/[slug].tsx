import { useParams, A } from '@solidjs/router';
import {
  MapPin, Star, BadgeCheck, Heart, Share2, Wifi, AirVent, BedDouble,
  Bath, Clock, Car, ChevronRight, MessageCircle, Calendar,
} from 'lucide-solid';
import { createSignal, Show } from 'solid-js';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Card } from '~/components/ui/Card';
import { ROUTES } from '~/constants/routes';

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(n).replace('IDR', 'Rp');
}

const FASILITAS_UMUM = ['WiFi', 'Parkir Motor', 'R. Tamu', 'CCTV', 'Dapur', 'Jemuran', 'Taman', 'R. Ibadah'];
const PERATURAN = [
  'Tamu lawan jenis dilarang masuk kamar', 'Jam malam 23.00', 'Dilarang membawa hewan peliharaan',
  'Tidak boleh memasak di kamar', 'Harus melapor jika membawa tamu menginap',
];

const TIPE_KAMAR = [
  { id: 'a', tipe: 'Tipe A', lantai: 1, luas: '3×3m', harga: 950000, status: 'tersedia', deskripsi: 'Kamar standar lantai 1 dengan kamar mandi luar.' },
  { id: 'b', tipe: 'Tipe B – Lantai 1', lantai: 1, luas: '3×4m', harga: 1050000, status: 'tersedia', deskripsi: 'Kamar lebih luas, kamar mandi dalam, cocok untuk 1–2 orang.' },
  { id: 'c', tipe: 'Tipe C', lantai: 2, luas: '3×3m', harga: 900000, status: 'penuh', deskripsi: 'Kamar lantai 2 dengan view ke taman.' },
];

export default function DetailKostPage() {
  const params = useParams<{ slug: string }>();
  const [wishlisted, setWishlisted] = createSignal(false);
  const [activePhoto, setActivePhoto] = createSignal(0);

  return (
    <PublicLayout>
      <SEO title="Kost Putri Bunga Anggrek" description="Kost putri dekat ITTP Purwokerto. Kamar bersih, AC, WiFi, kamar mandi dalam." />

      <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav class="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
          <A href={ROUTES.BERANDA} class="hover:text-primary">Beranda</A>
          <ChevronRight class="size-3" />
          <A href={ROUTES.CARI_KOST} class="hover:text-primary">Cari Kost</A>
          <ChevronRight class="size-3" />
          <span class="text-ink">Kost Putri Bunga Anggrek</span>
        </nav>

        {/* Photo gallery */}
        <div class="mb-6 grid aspect-[16/7] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
          <div class="col-span-2 row-span-2 bg-gradient-to-br from-primary-light to-red-100" />
          <div class="bg-slate-100" />
          <div class="bg-slate-200" />
          <div class="bg-slate-100" />
          <div class="relative cursor-pointer bg-slate-200">
            <div class="absolute inset-0 flex items-center justify-center bg-ink/40">
              <span class="text-sm font-semibold text-white">+12 foto</span>
            </div>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div class="space-y-8">
            {/* Header */}
            <div>
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="verified" dot>VERIFIED</Badge>
                <Badge variant="default">Putri</Badge>
                <Badge variant="default">4,5 ★ terbaik</Badge>
              </div>
              <h1 class="text-2xl font-bold text-ink">Kost Putri Bunga Anggrek</h1>
              <div class="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin class="size-4 shrink-0" />
                <span>Bobosan, Purwokerto Utara</span>
                <span class="text-slate-300">·</span>
                <span>400m dari ITTP</span>
              </div>

              {/* Quick specs */}
              <div class="mt-4 flex flex-wrap gap-4 text-sm">
                {[
                  { icon: <BedDouble class="size-4" />, label: '2,5×3m – 3×4m' },
                  { icon: <Bath class="size-4" />, label: 'Kamar mandi dalam' },
                  { icon: <Wifi class="size-4" />, label: 'WiFi 20Mbps' },
                  { icon: <Clock class="size-4" />, label: 'Akses 24 jam' },
                ].map((s) => (
                  <div class="flex items-center gap-1.5 text-slate-600">
                    <span class="text-primary">{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tipe Kamar */}
            <div>
              <h2 class="mb-3 text-base font-bold text-ink">Tipe kamar tersedia</h2>
              <div class="grid gap-3 sm:grid-cols-2">
                {TIPE_KAMAR.map((t) => (
                  <Card
                    class={[
                      'transition',
                      t.status === 'penuh' ? 'opacity-60' : 'hover:border-primary/30 cursor-pointer',
                    ].join(' ')}
                    padding="md"
                  >
                    <div class="mb-2 aspect-video rounded-xl bg-slate-100" />
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="text-sm font-semibold text-ink">{t.tipe}</p>
                        <p class="text-xs text-slate-400">Lantai {t.lantai} · {t.luas}</p>
                      </div>
                      <Badge variant={t.status === 'penuh' ? 'dibatalkan' : 'lunas'}>
                        {t.status === 'penuh' ? 'Penuh' : 'Tersedia'}
                      </Badge>
                    </div>
                    <p class="mt-1 text-sm text-slate-500">{t.deskripsi}</p>
                    <div class="mt-3 flex items-center justify-between">
                      <div>
                        <span class="text-base font-bold text-ink">{formatRp(t.harga)}</span>
                        <span class="text-xs text-slate-400">/bulan</span>
                      </div>
                      <Show when={t.status !== 'penuh'}>
                        <ButtonLink href={ROUTES.CHECKOUT(t.id)} size="sm">Booking</ButtonLink>
                      </Show>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Fasilitas umum */}
            <div>
              <h2 class="mb-3 text-base font-bold text-ink">Fasilitas umum</h2>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FASILITAS_UMUM.map((f) => (
                  <div class="flex items-center gap-2 text-sm text-slate-600">
                    <span class="text-success">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Peraturan */}
            <div>
              <h2 class="mb-3 text-base font-bold text-ink">Peraturan khusus</h2>
              <ul class="space-y-1.5">
                {PERATURAN.map((p) => (
                  <li class="flex items-start gap-2 text-sm text-slate-600">
                    <span class="mt-0.5 text-primary">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lokasi */}
            <div>
              <h2 class="mb-3 text-base font-bold text-ink">Lokasi & sekitar</h2>
              <div class="aspect-[16/6] overflow-hidden rounded-2xl bg-slate-100">
                <div class="flex size-full items-center justify-center text-sm text-slate-400">
                  <MapPin class="mr-1.5 size-4" /> Peta lokasi (Google Maps)
                </div>
              </div>
            </div>
          </div>

          {/* Right: sticky booking card */}
          <div class="lg:sticky lg:top-20 lg:self-start">
            <Card>
              <div class="mb-1 text-2xl font-bold text-ink">
                {formatRp(950000)}
                <span class="text-sm font-normal text-slate-400">/bulan</span>
              </div>
              <p class="mb-4 text-xs text-slate-500">
                Kamar masih tersedia · Verif. dalam 1×24 jam
              </p>

              {/* Date */}
              <div class="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm">
                <Calendar class="size-4 text-primary" />
                <span class="text-slate-600">Tanggal masuk</span>
                <span class="ml-auto font-semibold">1 Juli 2026</span>
              </div>

              <Button fullWidth size="lg" class="mb-2">Booking Sekarang</Button>
              <Button fullWidth variant="secondary" class="gap-2">
                <MessageCircle class="size-4" /> Chat Owner
              </Button>

              <div class="mt-4 rounded-xl bg-success-light p-3 text-xs text-success">
                ✓ Owner akan merespons dalam 1×24 jam
              </div>

              <div class="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 p-3 text-xs text-slate-500">
                <Star class="mt-0.5 size-3.5 shrink-0 text-amber-400" fill="currentColor" />
                <span>
                  <strong class="text-ink">4,8</strong> · Tipe Owner Responsif · 312 owner terverifikasi
                </span>
              </div>
            </Card>

            {/* Actions */}
            <div class="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                class={[
                  'flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition',
                  wishlisted()
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary',
                ].join(' ')}
              >
                <Heart class="size-4" fill={wishlisted() ? 'currentColor' : 'none'} />
                {wishlisted() ? 'Tersimpan' : 'Simpan'}
              </button>
              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
              >
                <Share2 class="size-4" /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
