import { createSignal, For, Show } from "solid-js";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id:      string;
  message: string;
  type:    ToastType;
}

const [toasts, setToasts] = createSignal<ToastItem[]>([]);

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function addToast(message: string, type: ToastType, duration = 4000) {
  const id = genId();
  setToasts((prev) => [...prev, { id, message, type }]);
  setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  return id;
}

export const toast = {
  success: (msg: string, ms?: number) => addToast(msg, "success", ms),
  error:   (msg: string, ms?: number) => addToast(msg, "error",   ms),
  info:    (msg: string, ms?: number) => addToast(msg, "info",    ms),
  warning: (msg: string, ms?: number) => addToast(msg, "warning", ms),
  dismiss: (id: string)               => setToasts((p) => p.filter((t) => t.id !== id)),
};

const ICONS: Record<ToastType, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error:   "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
};

const STYLES: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

const ICON_COLORS: Record<ToastType, string> = {
  success: "text-green-500",
  error:   "text-red-500",
  info:    "text-blue-500",
  warning: "text-amber-500",
};

export function ToastContainer() {
  return (
    <div
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      style="max-width: min(380px, calc(100vw - 32px))"
      aria-live="polite"
    >
      <For each={toasts()}>
        {(t) => (
          <div
            class={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${STYLES[t.type]}`}
            style="animation: fadeIn .2s ease-out, slideLeft .2s ease-out"
          >
            <svg class={`w-5 h-5 flex-shrink-0 mt-0.5 ${ICON_COLORS[t.type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS[t.type]} />
            </svg>
            <p class="text-sm font-medium flex-1 leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
              aria-label="Tutup"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </For>
    </div>
  );
}
