import { JSX, Show, splitProps } from 'solid-js';

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClass?: string;
}

export function Textarea(rawProps: TextareaProps) {
  const [local, rest] = splitProps(rawProps, [
    'label',
    'error',
    'hint',
    'wrapperClass',
    'class',
    'id',
  ]);

  const id = () => local.id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div class={`flex flex-col gap-1 ${local.wrapperClass ?? ''}`}>
      <Show when={local.label}>
        <label for={id()} class="text-sm font-medium text-ink">
          {local.label}
        </label>
      </Show>
      <textarea
        {...rest}
        id={id()}
        class={[
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink placeholder-slate-400',
          'resize-y transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          local.error
            ? 'border-danger focus:ring-danger/30 focus:border-danger'
            : 'border-slate-200',
          local.class ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <Show when={local.error}>
        <p class="text-xs text-danger">{local.error}</p>
      </Show>
      <Show when={local.hint && !local.error}>
        <p class="text-xs text-slate-500">{local.hint}</p>
      </Show>
    </div>
  );
}
