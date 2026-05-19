import {
  createContext,
  createSignal,
  For,
  JSX,
  onCleanup,
  Show,
  useContext,
} from 'solid-js';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-solid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warn' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warn: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>();

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider(props: { children: JSX.Element }) {
  const [toasts, setToasts] = createSignal<ToastItem[]>([]);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function toast(message: string, variant: ToastVariant = 'info', duration = 4000) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    const timer = setTimeout(() => dismiss(id), duration);
    onCleanup(() => clearTimeout(timer));
  }

  const ctx: ToastContextValue = {
    toast,
    success: (m, d) => toast(m, 'success', d),
    error: (m, d) => toast(m, 'error', d),
    warn: (m, d) => toast(m, 'warn', d),
    info: (m, d) => toast(m, 'info', d),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {props.children}
      <ToastContainer toasts={toasts()} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { wrapper: string; icon: () => JSX.Element }> = {
  success: {
    wrapper: 'border-success/20 bg-success-light text-success',
    icon: () => <CheckCircle class="size-5 shrink-0" />,
  },
  error: {
    wrapper: 'border-danger/20 bg-danger-light text-danger',
    icon: () => <XCircle class="size-5 shrink-0" />,
  },
  warn: {
    wrapper: 'border-warn/20 bg-warn-light text-warn',
    icon: () => <AlertCircle class="size-5 shrink-0" />,
  },
  info: {
    wrapper: 'border-navy/20 bg-navy/5 text-navy',
    icon: () => <Info class="size-5 shrink-0" />,
  },
};

function ToastContainer(props: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      class="fixed bottom-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2"
    >
      <For each={props.toasts}>
        {(item) => {
          const styles = VARIANT_STYLES[item.variant];
          return (
            <div
              role="alert"
              class={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${styles.wrapper}`}
            >
              {styles.icon()}
              <p class="flex-1 text-sm font-medium leading-5">{item.message}</p>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => props.onDismiss(item.id)}
                class="mt-0.5 shrink-0 opacity-60 transition hover:opacity-100"
              >
                <X class="size-4" />
              </button>
            </div>
          );
        }}
      </For>
    </div>
  );
}
