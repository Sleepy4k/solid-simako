import { A } from '@solidjs/router';
import { For } from 'solid-js';
import { Building2, User } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { ButtonLink } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const ROLES = [
  {
    href: ROUTES.DAFTAR_PENYEWA,
    title: 'Daftar sebagai pencari kost',
    desc: 'Cari, simpan, dan booking kost favoritmu. Gratis selamanya.',
    icon: <User class="size-6" />,
    cta: 'Daftar sebagai pencari kost',
    color: 'border-primary-light hover:border-primary',
    iconBg: 'bg-primary-light text-primary',
  },
  {
    href: ROUTES.DAFTAR_MITRA,
    title: 'Daftar sebagai Mitra Owner',
    desc: 'Listing kost gratis, kelola kamar & penyewa dari satu dashboard.',
    icon: <Building2 class="size-6" />,
    cta: 'Daftar sebagai Mitra Owner',
    color: 'border-navy/20 hover:border-navy',
    iconBg: 'bg-navy/10 text-navy',
  },
];

export default function PilihPeranPage() {
  return (
    <AuthLayout headline="Mulai perjalananmu bersama Simako.">
      <SEO title="Daftar" noIndex />

      <h1 class="mb-1 text-2xl font-bold text-ink">Buat akun baru</h1>
      <p class="mb-6 text-sm text-slate-500">Pilih peran yang sesuai denganmu.</p>

      <div class="space-y-4">
        <For each={ROLES}>
          {(role) => (
            <A
              href={role.href}
              class={`flex items-start gap-4 rounded-2xl border-2 bg-white p-5 transition ${role.color}`}
            >
              <div class={`flex size-12 shrink-0 items-center justify-center rounded-xl ${role.iconBg}`}>
                {role.icon}
              </div>
              <div>
                <p class="text-sm font-bold text-ink">{role.title}</p>
                <p class="mt-0.5 text-xs leading-relaxed text-slate-500">{role.desc}</p>
              </div>
            </A>
          )}
        </For>
      </div>

      <p class="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{' '}
        <A href={ROUTES.MASUK} class="font-semibold text-primary hover:underline">
          Masuk
        </A>
      </p>
    </AuthLayout>
  );
}
