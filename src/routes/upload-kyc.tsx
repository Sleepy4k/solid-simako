import { createSignal, Show, For } from 'solid-js';
import { CheckCircle, Upload, RefreshCw, FileText, ArrowLeft, ArrowRight } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';

const STEPS = ['Data diri', 'Unggah dokumen', 'Selfie + KTP', 'Properti pertama', 'Review'];

interface DocSlot {
  id: string;
  label: string;
  hint: string;
  required: boolean;
}

const DOCS: DocSlot[] = [
  { id: 'ktp', label: 'KTP', hint: 'JPG / PNG · maks 5 MB · pastikan nomor terbaca', required: true },
  { id: 'selfie', label: 'Selfie memegang KTP', hint: 'JPG / PNG · maks 5 MB · pastikan wajah & nomor KTP terbaca', required: true },
  { id: 'npwp', label: 'NPWP', hint: 'Bantu mempercepat verifikasi & pelaporan pajak.', required: false },
];

export default function UploadKycPage() {
  const [currentStep] = createSignal(1); // 0-indexed
  const [files, setFiles] = createSignal<Record<string, File>>({});
  const [loading, setLoading] = createSignal(false);

  function handleFile(id: string, e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const f = input.files?.[0];
    if (f) setFiles((prev) => ({ ...prev, [id]: f }));
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <AuthLayout
      headline="Cari kost yang pas, kelola tanpa drama."
      subline="Verifikasi sekali, listing kost selamanya. Tim kami review dokumen dalam <1 hari kerja."
    >
      <SEO title="Upload Dokumen KYC" noIndex />

      {/* Step indicator */}
      <div class="mb-6 flex items-center gap-0">
        <For each={STEPS}>
          {(label, i) => (
            <>
              <div class="flex flex-col items-center gap-1">
                <div
                  class={[
                    'flex size-6 items-center justify-center rounded-full text-[10px] font-bold',
                    i() < currentStep()
                      ? 'bg-success text-white'
                      : i() === currentStep()
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-400',
                  ].join(' ')}
                >
                  {i() < currentStep() ? <CheckCircle class="size-3.5" /> : i() + 1}
                </div>
                <span class="hidden text-[10px] text-slate-400 sm:block">{label}</span>
              </div>
              {i() < STEPS.length - 1 && (
                <div class={`mx-1 h-0.5 w-8 ${i() < currentStep() ? 'bg-success' : 'bg-slate-200'}`} />
              )}
            </>
          )}
        </For>
      </div>

      <h1 class="mb-1 text-xl font-bold text-ink">Unggah dokumen identitas</h1>
      <p class="mb-5 text-sm text-slate-500">
        Ini untuk verifikasi bahwa kamu pemilik sah. Dokumen hanya dilihat tim verifikasi kami.
      </p>

      <div class="space-y-3">
        <For each={DOCS}>
          {(doc) => {
            const uploaded = () => files()[doc.id];
            return (
              <div
                class={[
                  'rounded-2xl border-2 p-4 transition',
                  uploaded() ? 'border-primary/30 bg-primary-light/20' : 'border-slate-200',
                ].join(' ')}
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-bold text-slate-500">
                      {doc.label.slice(0, 4).toUpperCase()}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-ink">{doc.label}</p>
                        <Show when={uploaded()}>
                          <Badge variant="lunas">✓ Terunggah</Badge>
                        </Show>
                        <Show when={!doc.required}>
                          <Badge variant="default">Opsional</Badge>
                        </Show>
                      </div>
                      <Show when={uploaded()}>
                        <p class="text-xs text-slate-500">
                          {uploaded()!.name} · {(uploaded()!.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </Show>
                      <Show when={!uploaded()}>
                        <p class="text-xs text-slate-500">{doc.hint}</p>
                      </Show>
                    </div>
                  </div>

                  <Show
                    when={uploaded()}
                    fallback={
                      <label class="cursor-pointer">
                        <span class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary">
                          <Upload class="size-3.5" />
                          Pilih file
                        </span>
                        <input
                          type="file"
                          class="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFile(doc.id, e)}
                        />
                      </label>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => removeFile(doc.id)}
                      class="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-danger hover:text-danger"
                    >
                      <RefreshCw class="size-3.5" />
                      Ganti
                    </button>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="mt-6 flex gap-3">
        <Button variant="secondary" class="gap-1.5">
          <ArrowLeft class="size-4" /> Kembali
        </Button>
        <Button
          fullWidth
          class="gap-1.5"
          loading={loading()}
          disabled={!files()['ktp'] || !files()['selfie']}
          onClick={() => setLoading(true)}
        >
          Lanjut <ArrowRight class="size-4" />
        </Button>
        <Button variant="ghost" class="shrink-0 text-slate-500">
          Simpan & lanjut nanti
        </Button>
      </div>
    </AuthLayout>
  );
}
