import { Show, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  size?:    "sm" | "md" | "lg" | "xl";
  children: JSX.Element;
}

const SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

export function Modal(props: ModalProps) {
  return (
    <Show when={props.open}>
      <Portal>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && props.onClose()}
        >
          <div
            class={`bg-white rounded-2xl shadow-2xl w-full ${SIZES[props.size ?? "md"]} overflow-hidden`}
            style="animation: modalIn 0.18s ease-out"
          >
            {props.title && (
              <div class="flex items-center justify-between px-6 py-4 border-b border-[#E6F0FA]">
                <h2 class="text-base font-bold text-navy">{props.title}</h2>
                <button
                  type="button"
                  onClick={props.onClose}
                  class="p-1.5 rounded-lg text-navy/40 hover:text-navy hover:bg-[#E6F0FA] transition-colors"
                  aria-label="Tutup"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            )}
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}

