import { useSubmission } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { CheckCircle, Upload, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { ROUTES } from '~/constants/routes';
import { uploadKtpAction } from '~/server/actions/mitra';

export default function UploadKycPage() {
  const [file, setFile] = createSignal<File | null>(null);
  const sub = useSubmission(uploadKtpAction);
  const success = () => sub.result && 'ok' in sub.result && sub.result.ok;

  function handleFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const f = input.files?.[0];
    if (f) setFile(f);
  }

  return (
    <AuthLayout
      headline="Verifikasi sekali, listing kost selamanya."
      subline="Tim kami review dokumen dalam <1 hari kerja."
    >
      <SEO title="Upload Dokumen KYC" noIndex />

      <h1 class="mb-1 text-xl font-bold text-ink">Unggah KTP untuk verifikasi</h1>
      <p class="mb-5 text-sm text-slate-500">
        Ini memastikan bahwa kamu pemilik sah. Dokumen hanya dilihat tim verifikasi kami.
      </p>

      <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
        <div class="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
          {sub.result && 'message' in sub.result ? sub.result.message : 'Upload gagal'}
        </div>
      </Show>

      <Show
        when={success()}
        fallback={
          <form action={uploadKtpAction} method="post" enctype="multipart/form-data" class="space-y-4">
            <div
              class={[
                'rounded-2xl border-2 p-4 transition',
                file() ? 'border-primary/30 bg-primary-light/20' : 'border-dashed border-slate-200',
              ].join(' ')}
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-bold text-slate-500">
                    KTP
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold text-ink">Foto KTP</p>
                      <Show when={file()}>
                        <Badge variant="lunas">✓ Siap</Badge>
                      </Show>
                    </div>
                    <p class="text-xs text-slate-500">
                      {file()
                        ? `${file()!.name} · ${(file()!.size / 1024 / 1024).toFixed(2)} MB`
                        : 'JPG / PNG · maks 5 MB · pastikan nomor terbaca'}
                    </p>
                  </div>
                </div>

                <Show
                  when={file()}
                  fallback={
                    <label class="cursor-pointer">
                      <span class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary">
                        <Upload class="size-3.5" />
                        Pilih file
                      </span>
                      <input
                        type="file"
                        name="file"
                        class="sr-only"
                        accept="image/*"
                        onChange={handleFile}
                      />
                    </label>
                  }
                >
                  <label class="cursor-pointer">
                    <span class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-danger hover:text-danger">
                      <RefreshCw class="size-3.5" /> Ganti
                    </span>
                    <input
                      type="file"
                      name="file"
                      class="sr-only"
                      accept="image/*"
                      onChange={handleFile}
                    />
                  </label>
                </Show>
              </div>
            </div>

            <div class="flex gap-3">
              <ButtonLink href={ROUTES.DASHBOARD_MITRA} variant="ghost" class="gap-1.5">
                <ArrowLeft class="size-4" /> Lewati dulu
              </ButtonLink>
              <Button
                type="submit"
                fullWidth
                class="gap-1.5"
                loading={sub.pending}
                disabled={!file()}
              >
                Kirim KTP <ArrowRight class="size-4" />
              </Button>
            </div>
          </form>
        }
      >
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="flex size-16 items-center justify-center rounded-2xl bg-success-light">
            <CheckCircle class="size-8 text-success" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-ink">KTP berhasil diunggah</h2>
            <p class="mt-1 text-sm text-slate-500">
              Tim verifikasi kami akan meninjau dokumenmu dalam 1×24 jam.
            </p>
          </div>
          <ButtonLink href={ROUTES.DASHBOARD_MITRA}>Lanjut ke Dashboard</ButtonLink>
        </div>
      </Show>
    </AuthLayout>
  );
}
