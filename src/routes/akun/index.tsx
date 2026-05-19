import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { Home, Calendar, CreditCard, MessageSquare, ChevronRight } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { StatusBadge } from '~/components/ui/Badge';
import { Card } from '~/components/ui/Card';
import { ButtonLink } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const TAGIHAN = [
  { bulan: 'Jun 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Jun 26', status: 'Menunggu' as const },
  { bulan: 'Mei 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Mei 26', status: 'Lunas' as const },
  { bulan: 'Apr 2026', properti: 'Kost Pak Slamet A – Kamar 3', nominal: 'Rp 650.000', jatuhTempo: '05 Apr 26', status: 'Lunas' as const },
];

const STATUS_VARIANT = {
  Lunas: 'lunas' as const,
  Menunggu: 'menunggu' as const,
  Terlambat: 'telat' as const,
};

export default function AkunPage() {
  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Dashboard Penyewa" noIndex />

      {/* Greeting */}
      <div class="mb-6">
        <h1 class="text-xl font-bold text-ink">Selamat datang, Dewi!</h1>
        <p class="text-sm text-slate-500">Senin, 19 Mei 2026</p>
      </div>

      {/* Sewa aktif */}
      <Card class="mb-4">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Sewa Aktif</p>
            <p class="mt-1 text-base font-bold text-ink">Kost Pak Slamet A</p>
            <p class="text-sm text-slate-500">Kamar 3 · Yogyakarta</p>
          </div>
          <div class="flex size-12 items-center justify-center rounded-2xl bg-primary-light">
            <Home class="size-6 text-primary" />
          </div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
          {[
            { label: 'Mulai Sewa', value: '01 Jun 2026', icon: <Calendar class="size-4 text-slate-400" /> },
            { label: 'Berakhir', value: '31 Des 2026', icon: <Calendar class="size-4 text-slate-400" /> },
            { label: 'Durasi', value: '7 bulan', icon: <CreditCard class="size-4 text-slate-400" /> },
          ].map((d) => (
            <div class="text-center">
              <div class="flex justify-center">{d.icon}</div>
              <p class="mt-0.5 text-xs text-slate-400">{d.label}</p>
              <p class="text-sm font-semibold text-ink">{d.value}</p>
            </div>
          ))}
        </div>
        <div class="mt-3 flex gap-2">
          <ButtonLink href={ROUTES.CARI_KOST} variant="secondary" size="sm" class="flex-1 text-center">Cari Kost Lain</ButtonLink>
          <ButtonLink href="/chat" variant="secondary" size="sm" class="flex-1 gap-1 text-center">
            <MessageSquare class="size-4" /> Chat Owner
          </ButtonLink>
        </div>
      </Card>

      {/* Tagihan */}
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-sm font-bold text-ink">Tagihan Terbaru</h2>
        <A href="/akun/tagihan" class="text-xs font-medium text-primary hover:underline">Lihat semua</A>
      </div>

      <div class="space-y-2">
        <For each={TAGIHAN}>
          {(t) => (
            <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <div>
                <p class="text-sm font-medium text-ink">{t.bulan}</p>
                <p class="text-[10px] text-slate-400">{t.properti}</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-sm font-semibold text-ink">{t.nominal}</p>
                  <p class="text-[10px] text-slate-400">Jatuh tempo {t.jatuhTempo}</p>
                </div>
                <StatusBadge variant={STATUS_VARIANT[t.status]}>{t.status}</StatusBadge>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Quick links */}
      <div class="mt-6 grid grid-cols-2 gap-3">
        {[
          { href: '/akun/tagihan', icon: <CreditCard class="size-5 text-primary" />, label: 'Bayar Tagihan', desc: '1 tagihan menunggu' },
          { href: ROUTES.WISHLIST, icon: <Home class="size-5 text-navy" />, label: 'Wishlist Saya', desc: '3 kost disimpan' },
          { href: ROUTES.KELUHAN_PENYEWA, icon: <MessageSquare class="size-5 text-warn" />, label: 'Tiket & Keluhan', desc: '1 tiket terbuka' },
          { href: ROUTES.PROFIL_PENYEWA, icon: <Home class="size-5 text-success" />, label: 'Profil Saya', desc: 'Update informasi' },
        ].map((link) => (
          <A
            href={link.href}
            class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-primary/30 hover:bg-primary-light/10"
          >
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-xl bg-slate-50">{link.icon}</div>
              <div>
                <p class="text-sm font-semibold text-ink">{link.label}</p>
                <p class="text-[10px] text-slate-400">{link.desc}</p>
              </div>
            </div>
            <ChevronRight class="size-4 text-slate-300" />
          </A>
        ))}
      </div>
    </TenantLayout>
  );
}
