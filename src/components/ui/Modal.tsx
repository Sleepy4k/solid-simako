import { createEffect, JSX, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { X } from 'lucide-solid';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: JSX.Element;
  footer?: JSX.Element;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal(props: ModalProps) {
  const size = () => SIZES[props.size ?? 'md'];
  const closeOnBackdrop = () => props.closeOnBackdrop ?? true;

  // Lock body scroll when open
  createEffect(() => {
    if (props.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  onCleanup(() => {
    document.body.style.overflow = '';
  });

  // Close on Escape
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.open) props.onClose();
  };
  document.addEventListener('keydown', onKeyDown);
  onCleanup(() => document.removeEventListener('keydown', onKeyDown));

  return (
    <Show when={props.open}>
      <Portal>
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => closeOnBackdrop() && props.onClose()}
          />
          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            class={[
              'relative z-10 w-full rounded-2xl bg-white shadow-xl',
              size(),
            ].join(' ')}
          >
            {/* Header */}
            <Show when={props.title}>
              <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 class="text-base font-semibold text-ink">{props.title}</h2>
                  <Show when={props.description}>
                    <p class="mt-0.5 text-sm text-slate-500">{props.description}</p>
                  </Show>
                </div>
                <button
                  type="button"
                  onClick={props.onClose}
                  class="mt-0.5 shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                >
                  <X class="size-4" />
                </button>
              </div>
            </Show>

            {/* Body */}
            <div class="px-6 py-5">{props.children}</div>

            {/* Footer */}
            <Show when={props.footer}>
              <div class="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                {props.footer}
              </div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
