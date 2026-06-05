import { createSignal, For, Show, createEffect, onCleanup } from "solid-js";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  name?: string;
}

export function CustomSelect(props: CustomSelectProps) {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const selectedLabel = () =>
    props.value
      ? (props.options.find((o) => o.value === props.value)?.label ?? props.placeholder ?? "Pilih...")
      : (props.placeholder ?? "Pilih...");

  createEffect(() => {
    if (!open()) return;
    const handler = (e: MouseEvent) => {
      if (containerRef && !containerRef.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    onCleanup(() => document.removeEventListener("mousedown", handler));
  });

  return (
    <div ref={containerRef} class={`relative ${props.class ?? ""}`}>
      {props.name && (
        <input type="hidden" name={props.name} value={props.value} />
      )}
      <button
        type="button"
        onClick={() => !props.disabled && setOpen((v) => !v)}
        disabled={props.disabled}
        class={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left ${
          open()
            ? "border-accent ring-2 ring-accent/20"
            : "border-[#E6F0FA] hover:border-accent/40"
        }`}
      >
        <span class={props.value ? "text-navy" : "text-navy/40"}>{selectedLabel()}</span>
        <svg
          class={`w-4 h-4 text-navy/40 flex-shrink-0 transition-transform duration-200 ${open() ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={open()}>
        <div
          class="absolute z-[100] left-0 right-0 mt-1.5 bg-white rounded-xl border border-[#E6F0FA] shadow-2xl overflow-hidden"
          style="animation: fadeUp .15s ease-out"
        >
          <div class="max-h-52 overflow-y-auto scrollbar-thin">
            <Show when={props.placeholder}>
              <button
                type="button"
                onClick={() => { props.onChange?.(""); setOpen(false); }}
                class={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between ${
                  !props.value
                    ? "bg-accent/5 text-accent font-semibold"
                    : "text-navy/40 hover:bg-[#F4F7FA]"
                }`}
              >
                <span>{props.placeholder}</span>
                <Show when={!props.value}>
                  <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </Show>
              </button>
            </Show>
            <For each={props.options}>
              {(opt) => (
                <button
                  type="button"
                  onClick={() => { props.onChange?.(opt.value); setOpen(false); }}
                  class={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between ${
                    props.value === opt.value
                      ? "bg-accent/5 text-accent font-semibold"
                      : "text-navy hover:bg-[#F4F7FA]"
                  }`}
                >
                  <span>{opt.label}</span>
                  <Show when={props.value === opt.value}>
                    <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  class?: string;
  disabled?: boolean;
}

export function SearchableSelect(props: SearchableSelectProps) {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  let containerRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const filtered = () => {
    const q = query().toLowerCase().trim();
    if (!q) return props.options;
    return props.options.filter((o) => o.label.toLowerCase().includes(q));
  };

  const selectedLabel = () =>
    props.value
      ? (props.options.find((o) => o.value === props.value)?.label ?? props.placeholder ?? "Pilih...")
      : (props.placeholder ?? "Pilih...");

  const openDropdown = () => {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef?.focus());
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
  };

  createEffect(() => {
    if (!open()) return;
    const handler = (e: MouseEvent) => {
      if (containerRef && !containerRef.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener("mousedown", handler);
    onCleanup(() => document.removeEventListener("mousedown", handler));
  });

  const select = (value: string) => {
    props.onChange(value);
    closeDropdown();
  };

  return (
    <div ref={containerRef} class={`relative ${props.class ?? ""}`}>
      <button
        type="button"
        onClick={() => (open() ? closeDropdown() : openDropdown())}
        disabled={props.disabled}
        class={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left ${
          open()
            ? "border-accent ring-2 ring-accent/20"
            : "border-[#E6F0FA] hover:border-accent/40"
        }`}
      >
        <span class={props.value ? "text-navy" : "text-navy/40"}>{selectedLabel()}</span>
        <svg
          class={`w-4 h-4 text-navy/40 flex-shrink-0 transition-transform duration-200 ${open() ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={open()}>
        <div
          class="absolute z-[100] left-0 right-0 mt-1.5 bg-white rounded-xl border border-[#E6F0FA] shadow-2xl overflow-hidden"
          style="animation: fadeUp .15s ease-out"
        >
          <div class="p-2 border-b border-[#F4F7FA]">
            <div class="relative">
              <svg
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy/30 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder={props.searchPlaceholder ?? "Cari..."}
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                class="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-[#F4F7FA] outline-none text-navy placeholder-navy/30"
              />
            </div>
          </div>

          <div class="max-h-52 overflow-y-auto scrollbar-thin">
            <Show when={props.placeholder}>
              <button
                type="button"
                onClick={() => select("")}
                class={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between ${
                  !props.value
                    ? "bg-accent/5 text-accent font-semibold"
                    : "text-navy/40 hover:bg-[#F4F7FA]"
                }`}
              >
                <span>{props.placeholder}</span>
                <Show when={!props.value}>
                  <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </Show>
              </button>
            </Show>
            <For each={filtered()}>
              {(opt) => (
                <button
                  type="button"
                  onClick={() => select(opt.value)}
                  class={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between ${
                    props.value === opt.value
                      ? "bg-accent/5 text-accent font-semibold"
                      : "text-navy hover:bg-[#F4F7FA]"
                  }`}
                >
                  <span>{opt.label}</span>
                  <Show when={props.value === opt.value}>
                    <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </Show>
                </button>
              )}
            </For>
            <Show when={filtered().length === 0}>
              <p class="px-4 py-4 text-sm text-navy/40 text-center">
                {props.emptyMessage ?? "Tidak ditemukan"}
              </p>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
