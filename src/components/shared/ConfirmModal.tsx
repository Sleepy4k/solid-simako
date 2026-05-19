import { JSX } from 'solid-js';
import { Modal } from '~/components/ui/Modal';
import { Button } from '~/components/ui/Button';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  icon?: JSX.Element;
}

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} size="sm" closeOnBackdrop={!props.loading}>
      <div class="flex flex-col items-center gap-4 text-center">
        {props.icon && (
          <div class="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            {props.icon}
          </div>
        )}
        <div>
          <h3 class="text-base font-semibold text-ink">{props.title}</h3>
          {props.description && (
            <p class="mt-1 text-sm text-slate-500">{props.description}</p>
          )}
        </div>
        <div class="flex w-full gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={props.onClose}
            disabled={props.loading}
          >
            {props.cancelLabel ?? 'Batal'}
          </Button>
          <Button
            variant={props.variant ?? 'danger'}
            fullWidth
            onClick={props.onConfirm}
            loading={props.loading}
          >
            {props.confirmLabel ?? 'Ya, lanjutkan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
