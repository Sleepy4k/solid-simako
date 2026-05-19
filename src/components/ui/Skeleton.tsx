import { JSX, splitProps } from 'solid-js';

interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const ROUNDED: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton(rawProps: SkeletonProps) {
  const [local, rest] = splitProps(rawProps, ['class', 'width', 'height', 'rounded', 'style']);

  const roundedClass = ROUNDED[local.rounded ?? 'xl'];

  return (
    <div
      role="status"
      aria-label="Memuat..."
      class={`animate-pulse bg-slate-200 ${roundedClass} ${local.class ?? ''}`}
      style={{
        width: local.width,
        height: local.height,
        ...(local.style as object),
      }}
      {...rest}
    />
  );
}

// ─── Preset variants ──────────────────────────────────────────────────────────

export function SkeletonText(props: { lines?: number; class?: string }) {
  const lines = () => props.lines ?? 3;
  return (
    <div class={`space-y-2 ${props.class ?? ''}`}>
      {Array.from({ length: lines() }).map((_, i) => (
        <Skeleton
          height="1rem"
          width={i === lines() - 1 ? '60%' : '100%'}
          rounded="md"
        />
      ))}
    </div>
  );
}

export function SkeletonCard(props: { class?: string }) {
  return (
    <div class={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ${props.class ?? ''}`}>
      <Skeleton height="160px" rounded="xl" class="mb-4 w-full" />
      <Skeleton height="1.125rem" width="70%" rounded="md" class="mb-2" />
      <Skeleton height="0.875rem" width="45%" rounded="md" class="mb-3" />
      <Skeleton height="1.5rem" width="35%" rounded="lg" />
    </div>
  );
}

export function SkeletonAvatar(props: { size?: string; class?: string }) {
  return (
    <Skeleton
      width={props.size ?? '2.5rem'}
      height={props.size ?? '2.5rem'}
      rounded="full"
      class={props.class}
    />
  );
}
