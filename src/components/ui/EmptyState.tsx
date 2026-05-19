import { JSX, Show } from 'solid-js';

interface EmptyStateProps {
  icon?: JSX.Element;
  title: string;
  description?: string;
  action?: JSX.Element;
  class?: string;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div
      class={[
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center',
        props.class ?? '',
      ].join(' ')}
    >
      <Show when={props.icon}>
        <div class="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          {props.icon}
        </div>
      </Show>
      <div>
        <p class="text-sm font-semibold text-ink">{props.title}</p>
        <Show when={props.description}>
          <p class="mt-1 text-sm text-slate-500">{props.description}</p>
        </Show>
      </div>
      <Show when={props.action}>
        <div class="mt-1">{props.action}</div>
      </Show>
    </div>
  );
}
