import { JSX, splitProps } from 'solid-js';
import { A } from '@solidjs/router';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft' | 'navy';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-2 active:bg-primary-2 focus-visible:ring-primary/40 shadow-sm',
  secondary:
    'bg-white text-ink border border-slate-200 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300',
  ghost:
    'bg-transparent text-ink hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-300',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-danger/40 shadow-sm',
  soft: 'bg-primary-light text-primary hover:bg-red-100 active:bg-red-200 focus-visible:ring-primary/30',
  navy: 'bg-navy text-white hover:bg-navy-2 active:bg-navy-2 focus-visible:ring-navy/40 shadow-sm',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

// ─── Shared class builder ──────────────────────────────────────────────────

export function btnClass(
  variant: Variant = 'primary',
  size: Size = 'md',
  fullWidth = false,
  extra = '',
) {
  return [
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

// ─── Link variant (renders <a>) ────────────────────────────────────────────

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  class?: string;
  children: JSX.Element;
  external?: boolean;
}

export function ButtonLink(props: ButtonLinkProps) {
  const cls = () => btnClass(props.variant, props.size, props.fullWidth, props.class);
  if (props.external) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" class={cls()}>
        {props.children}
      </a>
    );
  }
  return (
    <A href={props.href} class={cls()}>
      {props.children}
    </A>
  );
}

// ─── Button (renders <button>) ─────────────────────────────────────────────

export function Button(rawProps: ButtonProps) {
  const [local, rest] = splitProps(rawProps, [
    'variant',
    'size',
    'loading',
    'fullWidth',
    'class',
    'children',
    'disabled',
  ]);

  const variant = () => local.variant ?? 'primary';
  const size = () => local.size ?? 'md';
  const isDisabled = () => local.disabled || local.loading;

  return (
    <button
      {...rest}
      disabled={isDisabled()}
      class={[
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant()],
        SIZES[size()],
        local.fullWidth ? 'w-full' : '',
        local.class ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {local.loading && (
        <svg class="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {local.children}
    </button>
  );
}
