import { JSX, Show } from 'solid-js';
import { Logo } from '~/components/shared/Logo';

interface AuthLayoutProps {
  children: JSX.Element;
  headline?: string;
  subline?: string;
  stats?: { label: string; value: string }[];
}

const DEFAULT_STATS = [
  { value: '1.284 kost aktif', label: 'di 28 kota' },
  { value: '312 owner', label: 'terverifikasi' },
  { value: 'Median verifikasi bukti', label: '< 6 jam' },
];

export function AuthLayout(props: AuthLayoutProps) {
  const headline = () => props.headline ?? 'Cari kost yang pas, kelola tanpa drama.';
  const stats = () => props.stats ?? DEFAULT_STATS;

  return (
    <div class="flex min-h-dvh">
      {/* Left brand panel */}
      <div class="relative hidden w-[340px] shrink-0 flex-col justify-between bg-primary p-10 lg:flex">
        {/* Subtle pattern overlay */}
        <div
          class="pointer-events-none absolute inset-0 opacity-10"
          style={{
            'background-image':
              'radial-gradient(circle at 30% 20%, #fff 0%, transparent 50%), radial-gradient(circle at 70% 80%, #fff 0%, transparent 40%)',
          }}
        />

        {/* Logo */}
        <Logo variant="white" />

        {/* Headline */}
        <div class="space-y-6">
          <h1 class="text-3xl font-black leading-tight text-white">{headline()}</h1>
          <Show when={props.subline}>
            <p class="text-sm leading-relaxed text-white/80">{props.subline}</p>
          </Show>
          <ul class="space-y-2">
            {stats().map((s) => (
              <li class="flex items-center gap-2 text-sm text-white/90">
                <svg class="size-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                </svg>
                <span>
                  <strong>{s.value}</strong> {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p class="text-xs text-white/50">© 2026 SIMAKO · Manajemen kost</p>
      </div>

      {/* Right form panel */}
      <div class="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div class="w-full max-w-md">
          {/* Mobile logo */}
          <div class="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
