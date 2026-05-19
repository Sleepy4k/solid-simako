import { JSX, Show, splitProps } from 'solid-js';

interface CheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element;
  error?: string;
  wrapperClass?: string;
}

export function Checkbox(rawProps: CheckboxProps) {
  const [local, rest] = splitProps(rawProps, ['label', 'error', 'wrapperClass', 'class', 'id']);

  const id = () => local.id ?? `cb-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div class={`flex flex-col gap-1 ${local.wrapperClass ?? ''}`}>
      <label for={id()} class="flex cursor-pointer items-start gap-2.5">
        <input
          {...rest}
          id={id()}
          type="checkbox"
          class={[
            'mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 accent-primary',
            'focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 focus:outline-none',
            local.class ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <Show when={local.label}>
          <span class="text-sm text-ink">{local.label}</span>
        </Show>
      </label>
      <Show when={local.error}>
        <p class="pl-6 text-xs text-danger">{local.error}</p>
      </Show>
    </div>
  );
}
