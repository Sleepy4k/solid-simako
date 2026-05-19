import { JSX, splitProps } from 'solid-js';

type Variant =
  | 'lunas'
  | 'menunggu'
  | 'telat'
  | 'dibatalkan'
  | 'aktif'
  | 'info'
  | 'default'
  | 'navy'
  | 'verified';

interface BadgeProps {
  variant?: Variant;
  class?: string;
  children: JSX.Element;
  dot?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  lunas: 'bg-success-light text-success',
  menunggu: 'bg-warn-light text-warn',
  telat: 'bg-danger-light text-danger',
  dibatalkan: 'bg-slate-100 text-slate-500',
  aktif: 'bg-success-light text-success',
  info: 'bg-blue-50 text-blue-600',
  default: 'bg-slate-100 text-slate-600',
  navy: 'bg-navy/10 text-navy',
  verified: 'bg-success-light text-success',
};

const DOT_COLORS: Record<Variant, string> = {
  lunas: 'bg-success',
  menunggu: 'bg-warn',
  telat: 'bg-danger',
  dibatalkan: 'bg-slate-400',
  aktif: 'bg-success',
  info: 'bg-blue-500',
  default: 'bg-slate-400',
  navy: 'bg-navy',
  verified: 'bg-success',
};

export function Badge(props: BadgeProps) {
  const variant = () => props.variant ?? 'default';

  return (
    <span
      class={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant()],
        props.class ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {props.dot && <span class={`size-1.5 rounded-full ${DOT_COLORS[variant()]}`} />}
      {props.children}
    </span>
  );
}

/** Kotak status berukuran lebih besar untuk tabel */
export function StatusBadge(props: BadgeProps) {
  return (
    <Badge {...props} class={`px-3 py-1 text-xs font-semibold ${props.class ?? ''}`}>
      {props.children}
    </Badge>
  );
}
