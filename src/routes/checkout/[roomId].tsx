import {
  useParams,
  useSearchParams,
  createAsync,
  useSubmission,
  type RouteDefinition,
  A,
} from '@solidjs/router';
import { createSignal, For, Show, Suspense } from 'solid-js';
import { Calendar, Info, Copy, CheckCircle, Upload } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Button, ButtonLink } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Badge } from '~/components/ui/Badge';
import { EmptyState } from '~/components/ui/EmptyState';
import { Skeleton } from '~/components/ui/Skeleton';
import { ROUTES } from '~/constants/routes';
import { kostDetailQuery } from '~/server/actions/public';
import { currentUserQuery } from '~/server/actions/auth';
import {
  createBookingAction,
  uploadProofAction,
  userTransactionsQuery,
} from '~/server/actions/penyewa';
import { prisma } from '~/server/db';
import { query } from '@solidjs/router';
import { formatIDR } from '~/lib/shared/slug';

const DURASI_OPTIONS = [1, 3, 6, 12];

// Inline server query: room dengan kost & owner (untuk halaman ini saja)
const roomCheckoutQuery = query(async (roomId: string) => {
  'use server';
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      boardingHouse: {
        select: {
          id: true,
          nama: true,
          slug: true,
          kota: true,
          alamat: true,
          owner: {
            select: {
              email: true,
              profile: { select: { namaLengkap: true } },
              ownerProfile: {
                select: { namaBank: true, rekeningNo: true, rekeningNama: true },
              },
            },
          },
          images: {
            where: { isCover: true },
            take: 1,
            include: { asset: { select: { url: true } } },
          },
        },
      },
    },
  });
  return room;
}, 'roomCheckout');

const transactionByIdQuery = query(async (trxId: string) => {
  'use server';
  return prisma.transaction.findUnique({
    where: { id: trxId },
    include: {
      rental: { include: { room: { include: { boardingHouse: { select: { owner: { select: { ownerProfile: true } } } } } } } },
      buktiAsset: { select: { url: true } },
    },
  });
}, 'transactionById');

export const route = {
  preload({ params, location }) {
    if (params.roomId) roomCheckoutQuery(params.roomId);
    currentUserQuery();
    const trxId = new URLSearchParams(location.search).get('trx');
    if (trxId) transactionByIdQuery(trxId);
  },
} satisfies RouteDefinition;

export default function CheckoutPage() {
  const params = useParams<{ roomId: string }>();
  const [search] = useSearchParams();
  const trxId = () => (typeof search.trx === 'string' ? search.trx : undefined);

  const room = createAsync(() => roomCheckoutQuery(params.roomId));
  const user = createAsync(() => currentUserQuery());
  const trx = createAsync(() => (trxId() ? transactionByIdQuery(trxId()!) : Promise.resolve(null)));

  const [durasi, setDurasi] = createSignal(6);
  const [tanggalMulai, setTanggalMulai] = createSignal(
    new Date().toISOString().slice(0, 10),
  );
  const [copied, setCopied] = createSignal(false);
  const [proofFile, setProofFile] = createSignal<File | null>(null);

  const bookSub = useSubmission(createBookingAction);
  const proofSub = useSubmission(uploadProofAction);

  const total = () => (room()?.hargaBulan ?? 0) * durasi();

  function copyRekening(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <PublicLayout>
      <SEO title="Ajukan Sewa" noIndex />

      <div class="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Suspense fallback={<Skeleton class="h-96" />}>
          <Show when={!user()}>
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p class="font-semibold text-amber-800">Anda belum masuk</p>
              <p class="mt-1 text-sm text-amber-700">
                Silakan masuk atau daftar dulu untuk mengajukan sewa.
              </p>
              <div class="mt-3 flex gap-2">
                <ButtonLink
                  href={`${ROUTES.MASUK}?redirect=${encodeURIComponent(ROUTES.CHECKOUT(params.roomId))}`}
                >
                  Masuk
                </ButtonLink>
                <ButtonLink href={ROUTES.DAFTAR_PENYEWA} variant="secondary">
                  Daftar
                </ButtonLink>
              </div>
            </div>
          </Show>

          <Show
            when={room()}
            fallback={
              <EmptyState
                title="Kamar tidak ditemukan"
                description="Kamar yang kamu pilih mungkin sudah tidak tersedia."
                action={<ButtonLink href={ROUTES.CARI_KOST}>Cari kamar lain</ButtonLink>}
              />
            }
          >
            {(r) => {
              const bank = () => r().boardingHouse.owner.ownerProfile;
              return (
                <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
                  {/* Main */}
                  <div class="space-y-6">
                    {/* Step 1: Booking form */}
                    <Show when={!trxId()}>
                      <Card>
                        <h2 class="mb-3 text-sm font-bold text-ink">1. Pilih durasi & tanggal masuk</h2>
                        <Show when={bookSub.result && 'ok' in bookSub.result && !bookSub.result.ok}>
                          <div class="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                            {bookSub.result && 'message' in bookSub.result
                              ? bookSub.result.message
                              : 'Pengajuan gagal'}
                          </div>
                        </Show>
                        <form action={createBookingAction} method="post" class="space-y-4">
                          <input type="hidden" name="roomId" value={r().id} />

                          <div>
                            <label class="mb-2 block text-xs font-semibold text-slate-500">
                              Durasi sewa
                            </label>
                            <div class="grid grid-cols-4 gap-2">
                              <For each={DURASI_OPTIONS}>
                                {(d) => (
                                  <label
                                    class={[
                                      'cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition',
                                      durasi() === d
                                        ? 'border-primary bg-primary-light text-primary'
                                        : 'border-slate-200 text-slate-600 hover:border-primary/40',
                                    ].join(' ')}
                                  >
                                    <input
                                      type="radio"
                                      name="durasiBulan"
                                      value={d}
                                      checked={durasi() === d}
                                      onChange={() => setDurasi(d)}
                                      class="sr-only"
                                    />
                                    {d} bln
                                  </label>
                                )}
                              </For>
                            </div>
                          </div>

                          <div>
                            <label class="mb-1 block text-xs font-semibold text-slate-500">
                              Tanggal masuk
                            </label>
                            <input
                              type="date"
                              name="tanggalMulai"
                              value={tanggalMulai()}
                              onInput={(e) => setTanggalMulai(e.currentTarget.value)}
                              min={new Date().toISOString().slice(0, 10)}
                              required
                              class="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          <div>
                            <label class="mb-1 block text-xs font-semibold text-slate-500">
                              Catatan untuk owner (opsional)
                            </label>
                            <textarea
                              name="catatan"
                              rows={2}
                              placeholder="Misal: rencana masuk siang hari"
                              class="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={bookSub.pending}
                            disabled={!user()}
                          >
                            Buat Pengajuan & Lanjut Bayar
                          </Button>
                        </form>
                      </Card>
                    </Show>

                    {/* Step 2: Payment */}
                    <Show when={trxId() && trx()}>
                      <Card>
                        <div class="mb-2 flex items-center gap-2">
                          <Badge variant="menunggu" dot>Menunggu bukti transfer</Badge>
                          <span class="text-xs text-slate-400">
                            Batas: {trx()?.batasTransfer
                              ? new Date(trx()!.batasTransfer!).toLocaleString('id-ID')
                              : '—'}
                          </span>
                        </div>
                        <h2 class="mb-3 text-sm font-bold text-ink">2. Transfer ke rekening owner</h2>

                        <Show
                          when={bank()?.namaBank && bank()?.rekeningNo}
                          fallback={
                            <div class="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                              Owner belum menyetel rekening bank. Hubungi owner via chat.
                            </div>
                          }
                        >
                          <div class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                            <div class="flex items-center justify-between">
                              <span class="text-slate-500">Bank</span>
                              <span class="font-semibold">{bank()!.namaBank}</span>
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-slate-500">No. Rekening</span>
                              <div class="flex items-center gap-2">
                                <span class="font-mono font-bold">{bank()!.rekeningNo}</span>
                                <button
                                  type="button"
                                  onClick={() => copyRekening(bank()!.rekeningNo!)}
                                  class="rounded bg-white px-2 py-0.5 text-[10px] text-slate-600 hover:text-primary"
                                >
                                  {copied() ? (
                                    <>
                                      <CheckCircle class="inline size-3" /> Tersalin
                                    </>
                                  ) : (
                                    <>
                                      <Copy class="inline size-3" /> Salin
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-slate-500">Atas nama</span>
                              <span class="font-semibold">{bank()!.rekeningNama}</span>
                            </div>
                            <div class="flex items-center justify-between border-t border-slate-200 pt-2">
                              <span class="text-slate-500">Jumlah transfer</span>
                              <span class="text-lg font-bold text-primary">
                                {formatIDR(trx()!.nominal)}
                              </span>
                            </div>
                          </div>
                        </Show>

                        <div class="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                          <Info class="mt-0.5 size-3.5 shrink-0" />
                          <span>
                            Transfer sesuai jumlah persis. Setelah transfer, unggah bukti di
                            bawah agar owner dapat memverifikasi.
                          </span>
                        </div>
                      </Card>

                      <Card>
                        <h2 class="mb-3 text-sm font-bold text-ink">3. Unggah bukti transfer</h2>
                        <Show when={proofSub.result && 'ok' in proofSub.result && !proofSub.result.ok}>
                          <div class="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                            {proofSub.result && 'message' in proofSub.result
                              ? proofSub.result.message
                              : 'Upload gagal'}
                          </div>
                        </Show>
                        <form
                          action={uploadProofAction}
                          method="post"
                          enctype="multipart/form-data"
                          class="space-y-3"
                        >
                          <input type="hidden" name="transactionId" value={trxId()!} />

                          <label class="block">
                            <span class="mb-1 block text-xs font-semibold text-slate-500">
                              Bukti transfer (JPG/PNG/PDF)
                            </span>
                            <div
                              class={[
                                'flex aspect-[16/8] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-4 transition',
                                proofFile()
                                  ? 'border-primary/40 bg-primary-light/30'
                                  : 'border-slate-200 hover:border-primary/30',
                              ].join(' ')}
                            >
                              <div class="text-center">
                                <Upload class="mx-auto size-6 text-slate-400" />
                                <p class="mt-1 text-sm font-medium text-slate-600">
                                  {proofFile()
                                    ? `${proofFile()!.name} (${(proofFile()!.size / 1024 / 1024).toFixed(2)} MB)`
                                    : 'Klik untuk pilih file'}
                                </p>
                                <p class="text-[10px] text-slate-400">Maks 5MB</p>
                              </div>
                              <input
                                type="file"
                                name="file"
                                accept="image/*,application/pdf"
                                class="sr-only"
                                onChange={(e) => {
                                  const f = e.currentTarget.files?.[0];
                                  if (f) setProofFile(f);
                                }}
                              />
                            </div>
                          </label>

                          <div class="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              name="namaBank"
                              placeholder="Bank pengirim (opsional)"
                              class="h-9 rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                            />
                            <input
                              type="text"
                              name="nomorReferensi"
                              placeholder="No. referensi (opsional)"
                              class="h-9 rounded-xl border border-slate-200 px-3 text-sm focus:border-primary focus:outline-none"
                            />
                          </div>

                          <Button
                            type="submit"
                            fullWidth
                            loading={proofSub.pending}
                            disabled={!proofFile()}
                          >
                            Kirim Bukti Transfer
                          </Button>
                        </form>
                      </Card>
                    </Show>
                  </div>

                  {/* Sidebar: ringkasan */}
                  <div class="lg:sticky lg:top-20 lg:self-start">
                    <Card>
                      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ringkasan
                      </p>
                      <div class="mt-3 aspect-video overflow-hidden rounded-xl bg-slate-100">
                        <Show when={r().boardingHouse.images[0]}>
                          <img
                            src={r().boardingHouse.images[0].asset.url}
                            class="size-full object-cover"
                            alt={r().boardingHouse.nama}
                          />
                        </Show>
                      </div>
                      <p class="mt-3 text-sm font-bold text-ink">{r().boardingHouse.nama}</p>
                      <p class="text-xs text-slate-500">
                        Kamar {r().nomorKamar} · {r().boardingHouse.kota}
                      </p>

                      <div class="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                        <div class="flex justify-between">
                          <span class="text-slate-500">Harga/bulan</span>
                          <span class="font-semibold">{formatIDR(r().hargaBulan)}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-500">Durasi</span>
                          <span class="font-semibold">{durasi()} bulan</span>
                        </div>
                        <div class="flex justify-between border-t border-slate-100 pt-2 text-sm">
                          <span class="font-semibold text-ink">Total</span>
                          <span class="font-bold text-primary">{formatIDR(total())}</span>
                        </div>
                      </div>

                      <A
                        href={ROUTES.DETAIL_KOST(r().boardingHouse.slug)}
                        class="mt-3 block text-center text-xs text-primary hover:underline"
                      >
                        ← Kembali ke detail kost
                      </A>
                    </Card>
                  </div>
                </div>
              );
            }}
          </Show>
        </Suspense>
      </div>
    </PublicLayout>
  );
}
