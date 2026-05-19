import { JSX, Show, splitProps } from 'solid-js';

interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  wrapperClass?: string;
  defaultValue?: string | number;
}

export function Input(rawProps: InputProps) {
  const [local, rest] = splitProps(rawProps, [
    'label',
    'error',
    'hint',
    'prefix',
    'suffix',
    'wrapperClass',
    'class',
    'id',
    'defaultValue',
  ]);

  const id = () => local.id ?? `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div class={`flex flex-col gap-1 ${local.wrapperClass ?? ''}`}>
      <Show when={local.label}>
        <label for={id()} class="text-sm font-medium text-ink">
          {local.label}
        </label>
      </Show>
      <div class="relative flex items-center">
        <Show when={local.prefix}>
          <span class="pointer-events-none absolute left-3 text-slate-400">{local.prefix}</span>
        </Show>
        <input
          {...rest}
          id={id()}
          value={rest.value !== undefined ? rest.value : (local.defaultValue ?? '')}
          class={[
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink placeholder-slate-400',
            'transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            local.error
              ? 'border-danger focus:ring-danger/30 focus:border-danger'
              : 'border-slate-200',
            local.prefix ? 'pl-9' : '',
            local.suffix ? 'pr-9' : '',
            local.class ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <Show when={local.suffix}>
          <span class="absolute right-3 text-slate-400">{local.suffix}</span>
        </Show>
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
