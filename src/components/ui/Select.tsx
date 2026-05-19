import { JSX, Show, splitProps } from 'solid-js';
import { ChevronDown } from 'lucide-solid';

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  wrapperClass?: string;
}

export function Select(rawProps: SelectProps) {
  const [local, rest] = splitProps(rawProps, [
    'label',
    'error',
    'hint',
    'placeholder',
    'wrapperClass',
    'class',
    'id',
    'children',
  ]);

  const id = () => local.id ?? `select-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div class={`flex flex-col gap-1 ${local.wrapperClass ?? ''}`}>
      <Show when={local.label}>
        <label for={id()} class="text-sm font-medium text-ink">
          {local.label}
        </label>
      </Show>
      <div class="relative">
        <select
          {...rest}
          id={id()}
          class={[
            'w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-9 text-sm text-ink',
            'transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            local.error
              ? 'border-danger focus:ring-danger/30 focus:border-danger'
              : 'border-slate-200',
            local.class ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Show when={local.placeholder}>
            <option value="" disabled>
              {local.placeholder}
            </option>
          </Show>
          {local.children}
        </select>
        <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      <Show when={local.error}>
        <p class="text-xs text-danger">{local.error}</p>
      </Show>
      <Show when={local.hint && !local.error}>
        <p class="text-xs text-slate-500">{local.hint}</p>
      </Show>
    </div>
  );
}
