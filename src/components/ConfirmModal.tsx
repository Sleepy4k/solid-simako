import { Modal } from "~/components/ui/Modal";
import { Button } from "~/components/ui/Button";

interface ConfirmModalProps {
  open:            boolean;
  onClose:         () => void;
  onConfirm:       () => void;
  title?:          string;
  description?:    string;
  confirmLabel?:   string;
  confirmVariant?: "primary" | "danger";
  loading?:        boolean;
}

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.title ?? "Konfirmasi"} size="sm">
      <div class="p-6">
        <p class="text-sm text-navy/70 leading-relaxed mb-6">
          {props.description ?? "Apakah Anda yakin ingin melanjutkan tindakan ini?"}
        </p>
        <div class="flex items-center gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={props.onClose} disabled={props.loading}>
            Batal
          </Button>
          <Button
            variant={props.confirmVariant ?? "danger"}
            size="sm"
            onClick={props.onConfirm}
            loading={props.loading}
          >
            {props.confirmLabel ?? "Ya, Lanjutkan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
