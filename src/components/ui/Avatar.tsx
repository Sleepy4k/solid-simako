import { Show } from 'solid-js';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

const SIZES = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

const BG_COLORS = [
  'bg-red-100 text-red-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600',
  'bg-cyan-100 text-cyan-600',
  'bg-blue-100 text-blue-600',
  'bg-violet-100 text-violet-600',
  'bg-pink-100 text-pink-600',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getColorIndex(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(hash) % BG_COLORS.length;
}

export function Avatar(props: AvatarProps) {
  const size = () => SIZES[props.size ?? 'md'];
  const colorClass = () => BG_COLORS[getColorIndex(props.name ?? '?')];

  return (
    <div
      class={[
        'shrink-0 overflow-hidden rounded-full',
        size(),
        !props.src ? colorClass() : '',
        props.class ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Show
        when={props.src}
        fallback={
          <span class="flex size-full items-center justify-center font-semibold">
            {getInitials(props.name ?? '?')}
          </span>
        }
      >
        <img src={props.src!} alt={props.name ?? 'avatar'} class="size-full object-cover" />
      </Show>
    </div>
  );
}
