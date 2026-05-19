import { createSignal, For, JSX, Show } from 'solid-js';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  content?: JSX.Element;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'pill';
  class?: string;
}

export function Tabs(props: TabsProps) {
  const [active, setActive] = createSignal(props.defaultTab ?? props.items[0]?.id ?? '');

  const variant = () => props.variant ?? 'underline';

  function select(id: string) {
    setActive(id);
    props.onChange?.(id);
  }

  const tabBase = () =>
    variant() === 'underline'
      ? 'relative pb-3 text-sm font-medium transition-colors border-b-2'
      : 'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors';

  const tabActive = () =>
    variant() === 'underline'
      ? 'border-primary text-primary'
      : 'bg-primary text-white shadow-sm';

  const tabInactive = () =>
    variant() === 'underline'
      ? 'border-transparent text-slate-500 hover:text-ink hover:border-slate-300'
      : 'text-slate-500 hover:bg-slate-100 hover:text-ink';

  const wrapperClass = () =>
    variant() === 'underline'
      ? 'flex gap-6 border-b border-slate-100'
      : 'flex gap-1 rounded-xl bg-slate-100 p-1';

  const activeItem = () => props.items.find((t) => t.id === active());

  return (
    <div class={props.class}>
      <div class={wrapperClass()} role="tablist">
        <For each={props.items}>
          {(tab) => (
            <button
              role="tab"
              aria-selected={active() === tab.id}
              type="button"
              onClick={() => select(tab.id)}
              class={[tabBase(), active() === tab.id ? tabActive() : tabInactive()].join(' ')}
            >
              {tab.label}
              <Show when={tab.badge !== undefined}>
                <span
                  class={[
                    'ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                    active() === tab.id
                      ? variant() === 'underline'
                        ? 'bg-primary text-white'
                        : 'bg-white text-primary'
                      : 'bg-slate-200 text-slate-600',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              </Show>
            </button>
          )}
        </For>
      </div>
      <Show when={activeItem()?.content}>
        <div role="tabpanel">{activeItem()?.content}</div>
      </Show>
    </div>
  );
}
