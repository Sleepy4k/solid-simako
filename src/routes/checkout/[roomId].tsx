import { useParams } from '@solidjs/router';
import { createSignal, createEffect, onCleanup, Show } from 'solid-js';
import { Calendar, Info, Copy, CheckCircle, Upload, X, FileText } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';

const STEPS = ['Pilih kamar', 'Detail penyewa', 'Pembayaran manual', 'Selesai'];
const DURASI_OPTIONS = [1, 3, 6, 12];

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(n).replace('IDR', 'Rp');
}

function CountdownTimer(props: { seconds: number }) {
  const [remaining, setRemaining] = createSignal(props.seconds);

  const timer = setInterval(() => {
    setRemaining((v) => Math.max(0, v - 1));
  }, 1000);
  onCleanup(() => clearInterval(timer));

  const hh = () => String(Math.floor(remaining() / 3600)).padStart(2, '0');
  const mm = () => String(Math.floor((remaining() % 3600) / 60)).padStart(2, '0');
  const ss = () => String(remaining() % 60).padStart(2, '0');

  return (
    <span class="font-mono font-bold text-ink">{hh()}:{mm()}:{ss()}</span>
  );
}

export default function CheckoutPage() {
  const params = useParams<{ roomId: string }>();
  const [step] = createSignal(2); // 0-indexed, show step 3 (Pembayaran)
  const [durasi, setDurasi] = createSignal(6);
  const [copied, setCopied] = createSignal(false);
  const [file, setFile] = createSignal<File | null>(null);

  const hargaBulan = 950000;
  const deposit = 500000;
  const biayaAdmin = 12000;
  const kodeUnik = 347;
  const totalSewa = () => hargaBulan * durasi();
  const total = () => totalSewa() + deposit + biayaAdmin + kodeUnik;

  function copyRekening() {
    navigator.clipboard.writeText('2810447791');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    if (input.files?.[0]) setFile(input.files[0]);
  }

  return (
    <PublicLayout hideFooter>
      <SEO title="Checkout — Kost Putri Bunga Anggrek" noIndex />

      <div class="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {/* Stepper */}
        <div class="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((label, i) => (
            <>
              <div class="flex items-center gap-2">
                <div
                  class={[
                    'flex size-7 items-center justify-center rounded-full text-xs font-bold',
                    i < step()
                      ? 'bg-success text-white'
                      : i === step()
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-400',
                  ].join(' ')}
                >
                  {i < step() ? <CheckCircle class="size-4" /> : i + 1}
                </div>
                <span
                  class={[
                    'hidden text-sm font-medium sm:block',
                    i === step() ? 'text-ink' : 'text-slate-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div class={`mx-3 h-0.5 w-12 ${i < step() ? 'bg-success' : 'bg-slate-200'}`} />
              )}
            </>
          ))}
        </div>

        <div class="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Left */}
          <div class="space-y-6">
            {/* Tanggal & Durasi */}
            <Card>
              <h2 class="mb-4 text-base font-bold text-ink">Tanggal & Durasi</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-600">Tanggal masuk</label>
                  <div class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                    <Calendar class="size-4 text-slate-400" />
                    <span>1 Juli 2026</span>
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-600">Durasi sewa</label>
                  <div class="flex gap-2">
                    {DURASI_OPTIONS.map((d) => (
                      <button
                        type="button"
                        onClick={() => setDurasi(d)}
                        class={[
                          'flex-1 rounded-xl border py-2 text-sm font-semibold transition',
                          durasi() === d
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary',
                        ].join(' ')}
                      >
                        {d} bln
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Transfer info */}
            <Card class="border-slate-200 bg-slate-50">
              <div class="mb-3 flex items-start gap-2 text-sm text-slate-600">
                <Info class="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <strong>Transfer ke rekening Owner</strong> · SIMAKO tidak menampung dana.
                  Silakan transfer langsung. Bukti akan diverifikasi.
                </span>
              </div>

              {/* Bank detail */}
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="mb-1 inline-flex rounded-lg bg-navy px-2 py-1 text-[10px] font-bold text-white tracking-wide">
                      BCA
                    </div>
                    <p class="text-xl font-bold tracking-wider text-ink">2810 4477 91</p>
                    <p class="text-xs text-slate-500">a/n Slamet Riyadi (Owner)</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyRekening}
                    class={[
                      'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition',
                      copied()
                        ? 'border-success bg-success-light text-success'
                        : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary',
                    ].join(' ')}
                  >
                    {copied() ? <CheckCircle class="size-4" /> : <Copy class="size-4" />}
                    {copied() ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>

              {/* Nominal & countdown */}
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-slate-100 bg-white p-3">
                  <p class="mb-1 text-xs text-slate-500">Nominal transfer</p>
                  <p class="text-lg font-bold text-primary">{formatRp(total())}</p>
                  <p class="text-[10px] text-slate-400">3 angka unik agar mudah diverifikasi</p>
                </div>
                <div class="rounded-xl border border-slate-100 bg-white p-3">
                  <p class="mb-1 text-xs text-slate-500">Batas pembayaran</p>
                  <p class="text-lg font-bold text-ink">
                    <CountdownTimer seconds={85321} />
                  </p>
                  <p class="text-[10px] text-slate-400">Hari ini, sebelum 18.30 WIB</p>
                </div>
              </div>
            </Card>

            {/* Upload bukti */}
            <Card>
              <h2 class="mb-1 text-base font-bold text-ink">Upload Bukti Transfer</h2>
              <p class="mb-4 text-xs text-slate-500">JPG / PNG / PDF · maks 5 MB</p>

              <Show
                when={file()}
                fallback={
                  <label class="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-8 transition hover:border-primary hover:bg-primary-light/30">
                    <Upload class="size-8 text-slate-400" />
                    <div class="text-center">
                      <p class="text-sm font-medium text-ink">Klik untuk upload atau seret file ke sini</p>
                      <p class="text-xs text-slate-400">JPG, PNG, atau PDF</p>
                    </div>
                    <input type="file" class="sr-only" accept="image/*,.pdf" onChange={handleFileChange} />
                  </label>
                }
              >
                {(f) => (
                  <div class="flex items-center gap-3 rounded-2xl border border-success/30 bg-success-light p-4">
                    <FileText class="size-8 text-success" />
                    <div class="flex-1 min-w-0">
                      <p class="truncate text-sm font-semibold text-ink">{f().name}</p>
                      <p class="text-xs text-slate-500">
                        {(f().size / 1024 / 1024).toFixed(1)} MB · Berhasil diunggah
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <button type="button" class="text-xs font-medium text-primary hover:underline">Lihat</button>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        class="text-slate-400 hover:text-danger"
                      >
                        <X class="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Show>
            </Card>

            <Button fullWidth size="lg" disabled={!file()}>
              Kirim untuk Verifikasi
            </Button>
          </div>

          {/* Right: Ringkasan */}
          <div class="lg:sticky lg:top-20 lg:self-start">
            <Card>
              <h3 class="mb-4 text-sm font-bold text-ink">Ringkasan</h3>

              <div class="mb-4 flex items-center gap-3">
                <div class="size-14 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-light to-red-100" />
                <div>
                  <p class="text-sm font-semibold text-ink">Kost Bunga Anggrek</p>
                  <p class="text-xs text-slate-500">Kamar 04 · Tipe A</p>
                  <Badge variant="info">{durasi()} bulan</Badge>
                </div>
              </div>

              <div class="space-y-2 border-t border-slate-100 pt-3 text-sm">
                {[
                  { label: `Sewa ${durasi()} × ${formatRp(hargaBulan)}`, value: formatRp(totalSewa()) },
                  { label: 'Deposit', value: formatRp(deposit) },
                  { label: 'Biaya admin', value: formatRp(biayaAdmin) },
                  { label: 'Kode unik', value: `+${kodeUnik}` },
                ].map((row) => (
                  <div class="flex justify-between">
                    <span class="text-slate-500">{row.label}</span>
                    <span class="font-medium text-ink">{row.value}</span>
                  </div>
                ))}
                <div class="flex justify-between border-t border-slate-100 pt-2 text-base">
                  <span class="font-bold text-ink">Total</span>
                  <span class="font-bold text-primary">{formatRp(total())}</span>
                </div>
              </div>

              <p class="mt-3 text-center text-[10px] text-slate-400">
                Owner akan memverifikasi dalam 1×24 jam
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
