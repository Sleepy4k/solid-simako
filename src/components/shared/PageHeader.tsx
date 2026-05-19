import { JSX, Show } from 'solid-js';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: JSX.Element;
  class?: string;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div class={`flex items-start justify-between gap-4 ${props.class ?? ''}`}>
      <div>
        <h1 class="text-2xl font-bold text-ink">{props.title}</h1>
        <Show when={props.description}>
          <p class="mt-0.5 text-sm text-slate-500">{props.description}</p>
        </Show>
      </div>
      <Show when={props.action}>
        <div class="shrink-0">{props.action}</div>
      </Show>
    </div>
  );
}
