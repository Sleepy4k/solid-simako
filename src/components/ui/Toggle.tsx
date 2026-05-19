import { JSX, splitProps } from 'solid-js';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  class?: string;
}

export function Toggle(props: ToggleProps) {
  const size = () => props.size ?? 'md';

  const trackClass = () =>
    size() === 'sm'
      ? 'h-5 w-9'
      : 'h-6 w-11';

  const thumbClass = () =>
    size() === 'sm'
      ? 'size-3.5 translate-x-0.5 peer-checked:translate-x-[18px]'
      : 'size-4 translate-x-1 peer-checked:translate-x-[22px]';

  return (
    <label
      class={`inline-flex cursor-pointer items-center gap-2.5 ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${props.class ?? ''}`}
    >
      <div class="relative">
        <input
          type="checkbox"
          class="peer sr-only"
          checked={props.checked}
          disabled={props.disabled}
          onChange={(e) => props.onChange?.(e.currentTarget.checked)}
        />
        <div
          class={[
            'rounded-full transition-colors duration-200',
            'bg-slate-200 peer-checked:bg-primary',
            trackClass(),
          ].join(' ')}
        />
        <div
          class={[
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200',
            thumbClass(),
          ].join(' ')}
        />
      </div>
      {props.label && <span class="text-sm text-ink">{props.label}</span>}
    </label>
  );
}
