import { createSignal, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { CustomSelect } from "~/components/ui/Select";

interface FormState {
  senderBank: string;
  accountHolder: string;
  transferDate: string;
  notes: string;
}

const ROOM = {
  number: "05",
  type: "Standard Plus",
  floor: "Lantai 2",
  size: "4 × 4 m²",
  amenities: ["AC", "WiFi", "K. Mandi Dalam", "Lemari", "Meja Belajar"],
  monthlyRent: 1_500_000,
  deposit: 1_500_000,
};

const DURATION_OPTIONS = [
  { value: "1",  label: "1 Bulan",   discount: 0 },
  { value: "3",  label: "3 Bulan",   discount: 0 },
  { value: "6",  label: "6 Bulan",   discount: 5 },
  { value: "12", label: "12 Bulan",  discount: 10 },
];

const BANK = {
  name: "BCA",
  fullName: "Bank Central Asia",
  accountNumber: "1234 5678 90",
  holder: "Budi Santoso",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

type Errors = Partial<Record<keyof FormState | "file", string>>;

export default function CheckoutPage() {
  const [duration, setDuration] = createSignal(1);
  const discountPct = () => DURATION_OPTIONS.find((d) => d.value === String(duration()))?.discount ?? 0;
  const subtotal = () => ROOM.monthlyRent * duration();
  const discountAmt = () => Math.round(subtotal() * discountPct() / 100);
  const total = () => subtotal() - discountAmt() + ROOM.deposit;

  const [form, setForm] = createSignal<FormState>({
    senderBank: "",
    accountHolder: "",
    transferDate: "",
    notes: "",
  });
  const [file, setFile] = createSignal<File | null>(null);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [dragOver, setDragOver] = createSignal(false);
  const [errors, setErrors] = createSignal<Errors>({});
  const [submitted, setSubmitted] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  const field = <K extends keyof FormState>(key: K) => (
    (e: Event) => setForm((p) => ({ ...p, [key]: (e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value }))
  );

  const handleFile = (f: File) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(f.type)) {
      setErrors((p) => ({ ...p, file: "Format tidak didukung. Gunakan PNG atau JPG." }));
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, file: "Ukuran file melebihi 5 MB." }));
      return;
    }
    setFile(f);
    setErrors((p) => { const e = { ...p }; delete e.file; return e; });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files[0];
    if (f) handleFile(f);
  };

  const validate = (): boolean => {
    const f = form();
    const errs: Errors = {};
    if (!f.senderBank) errs.senderBank = "Bank pengirim wajib dipilih.";
    if (!f.accountHolder.trim()) errs.accountHolder = "Nama pemilik rekening wajib diisi.";
    if (!f.transferDate) errs.transferDate = "Tanggal transfer wajib diisi.";
    if (!file()) errs.file = "Bukti transfer wajib diunggah.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const copyAccount = async () => {
    await navigator.clipboard.writeText(BANK.accountNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent hover:border-accent/40";
  const inputOk = "border-[#E6F0FA]";
  const inputErr = "border-red-300 bg-red-50/50";

  return (
    <div class="flex-1 overflow-auto bg-ice-gray">
      <div class="bg-white border-b border-ice sticky top-0 z-10 shadow-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <A
              href="/dashboard"
              class="p-2 rounded-xl hover:bg-ice transition-colors text-navy/50 hover:text-navy"
              aria-label="Kembali"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </A>
            <div>
              <h1 class="text-xl font-bold text-navy">Pembayaran Kamar</h1>
              <p class="text-sm text-navy/50">Kamar {ROOM.number} - {ROOM.type}</p>
            </div>
          </div>

          <ol class="hidden md:flex items-center gap-2 text-sm" aria-label="Progress checkout">
            <li class="flex items-center gap-2 opacity-50">
              <span class="w-7 h-7 rounded-full bg-ice border border-navy/20 text-navy/50 flex items-center justify-center text-xs font-bold">✓</span>
              <span class="text-navy/50 text-xs">Pilih Kamar</span>
            </li>
            <li class="w-8 h-px bg-navy/15" />
            <li class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shadow-sm">2</span>
              <span class="text-accent font-semibold text-xs">Bukti Bayar</span>
            </li>
            <li class="w-8 h-px bg-navy/15" />
            <li class="flex items-center gap-2 opacity-40">
              <span class="w-7 h-7 rounded-full bg-ice border border-navy/20 text-navy/50 flex items-center justify-center text-xs font-bold">3</span>
              <span class="text-navy/50 text-xs">Konfirmasi</span>
            </li>
          </ol>
        </div>
      </div>

      <Show when={submitted()}>
        <div class="max-w-md mx-auto px-6 py-20 text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-navy mb-2">Bukti Berhasil Dikirim!</h2>
          <p class="text-navy/55 leading-relaxed mb-8">
            Pemilik kos akan memverifikasi bukti transfer Anda. Proses verifikasi berlangsung dalam&nbsp;
            <strong class="text-navy">1×24 jam kerja</strong>.
          </p>

          <div class="bg-white rounded-2xl border border-ice shadow-sm text-left mb-6 overflow-hidden">
            <div class="bg-navy px-5 py-3">
              <p class="text-white/60 text-xs uppercase tracking-wider font-medium">Ringkasan Pengiriman</p>
            </div>
            <div class="divide-y divide-ice">
              {[
                ["Kamar", `${ROOM.number} - ${ROOM.type}`],
                ["Durasi Sewa", `${duration()} Bulan`],
                ["Bank Pengirim", form().senderBank],
                ["Pemilik Rekening", form().accountHolder],
                ["Total Transfer", fmt(total())],
              ].map(([label, val]) => (
                <div class="flex justify-between px-5 py-3">
                  <span class="text-sm text-navy/50">{label}</span>
                  <span class="text-sm font-semibold text-navy">{val}</span>
                </div>
              ))}
              <div class="flex justify-between px-5 py-3">
                <span class="text-sm text-navy/50">Status</span>
                <span class="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                  Menunggu Verifikasi
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setForm({ senderBank: "", accountHolder: "", transferDate: "", notes: "" }); }}
            class="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg hover:shadow-accent/25"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </Show>

      <Show when={!submitted()}>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            <div class="lg:col-span-2 space-y-5 lg:sticky lg:top-[73px]">

              <div class="bg-white rounded-2xl border border-ice shadow-sm overflow-hidden">
                <div class="bg-navy px-6 py-5">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-white/45 text-[11px] uppercase tracking-wider font-semibold mb-1.5">Ringkasan Kamar</p>
                      <h2 class="text-white font-black text-2xl leading-none">Kamar {ROOM.number}</h2>
                      <p class="text-white/60 text-sm mt-1">{ROOM.type}</p>
                    </div>
                    <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 flex-shrink-0">
                      <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="px-6 py-4">
                  <div class="flex flex-wrap gap-3 text-sm text-navy/60 mb-4">
                    <span class="flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {ROOM.floor}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {ROOM.size}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-4">
                    {ROOM.amenities.map((a) => (
                      <span class="text-xs px-2.5 py-1 bg-ice text-accent rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    <span class="text-sm text-accent font-semibold">Kamar Tersedia</span>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-ice shadow-sm p-6">
                <h3 class="text-[11px] font-bold text-navy/45 uppercase tracking-wider mb-4">Durasi & Rincian Pembayaran</h3>

                <div class="mb-5">
                  <p class="text-xs font-semibold text-navy/50 mb-2">Pilih Durasi Sewa</p>
                  <div class="grid grid-cols-2 gap-2">
                    <For each={DURATION_OPTIONS}>
                      {(opt) => (
                        <button
                          type="button"
                          onClick={() => setDuration(Number(opt.value))}
                          class={`flex flex-col items-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                            duration() === Number(opt.value)
                              ? "bg-accent text-white border-accent shadow-sm"
                              : "border-[#E6F0FA] text-navy/60 hover:border-accent/40 hover:text-navy"
                          }`}
                        >
                          <span class="font-black text-sm">{opt.label}</span>
                          <Show when={opt.discount > 0}>
                            <span class={`text-[10px] mt-0.5 font-bold ${duration() === Number(opt.value) ? "text-white/80" : "text-green-600"}`}>
                              Hemat {opt.discount}%
                            </span>
                          </Show>
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-navy/65">Sewa ({duration()} bulan × {fmt(ROOM.monthlyRent)})</span>
                    <span class="text-sm font-semibold text-navy">{fmt(subtotal())}</span>
                  </div>
                  <Show when={discountPct() > 0}>
                    <div class="flex justify-between items-center text-green-600">
                      <span class="text-sm">Diskon {discountPct()}%</span>
                      <span class="text-sm font-semibold">-{fmt(discountAmt())}</span>
                    </div>
                  </Show>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-navy/65">Deposit (refundable)</span>
                    <span class="text-sm font-semibold text-navy">{fmt(ROOM.deposit)}</span>
                  </div>
                  <div class="border-t-2 border-dashed border-ice pt-3 mt-1">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-navy">Total Transfer</span>
                      <span class="font-black text-lg text-accent">{fmt(total())}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-4 p-3 bg-ice rounded-xl text-xs text-accent leading-relaxed">
                  <strong>Catatan:</strong> Deposit dikembalikan di akhir masa sewa setelah dikurangi biaya kerusakan (jika ada).
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-ice shadow-sm p-6">
                <h3 class="text-[11px] font-bold text-navy/45 uppercase tracking-wider mb-4">Rekening Tujuan Transfer</h3>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm">
                    {BANK.name}
                  </div>
                  <div>
                    <div class="font-bold text-navy text-sm">{BANK.fullName}</div>
                    <div class="text-xs text-navy/40">{BANK.name}</div>
                  </div>
                </div>

                <div class="bg-ice-gray rounded-xl p-4 mb-3">
                  <p class="text-[11px] text-navy/40 font-medium uppercase tracking-wider mb-1.5">Nomor Rekening</p>
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-xl font-black text-navy tracking-[0.15em]">{BANK.accountNumber}</span>
                    <button
                      type="button"
                      onClick={copyAccount}
                      class={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                        copied()
                          ? "bg-green-100 text-green-600 border border-green-200"
                          : "bg-ice text-accent border border-accent/20 hover:bg-accent hover:text-white"
                      }`}
                    >
                      <Show
                        when={copied()}
                        fallback={
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        }
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </Show>
                      {copied() ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                </div>

                <div>
                  <p class="text-[11px] text-navy/40 font-medium uppercase tracking-wider mb-1">Atas Nama</p>
                  <p class="font-bold text-navy">{BANK.holder}</p>
                </div>

                <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
                  <strong>Penting:</strong> Transfer tepat sejumlah total di atas untuk mempercepat verifikasi.
                </div>
              </div>
            </div>

            <div class="lg:col-span-3">
              <form onSubmit={handleSubmit} novalidate>
                <div class="bg-white rounded-2xl border border-ice shadow-sm overflow-hidden">
                  <div class="px-6 py-5 border-b border-ice">
                    <h2 class="text-lg font-bold text-navy">Upload Bukti Transfer</h2>
                    <p class="text-sm text-navy/50 mt-0.5">Isi formulir berikut setelah melakukan transfer ke rekening tujuan.</p>
                  </div>

                  <div class="p-6 space-y-5">
                    <div>
                      <label class="block text-sm font-semibold text-navy mb-1.5">
                        Nama Bank Pengirim <span class="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={form().senderBank}
                        onChange={(v) => setForm((p) => ({ ...p, senderBank: v }))}
                        placeholder="Pilih Bank Pengirim"
                        class={errors().senderBank ? "ring-2 ring-red-300 rounded-xl" : ""}
                        options={[
                          { value: "BCA (Bank Central Asia)",      label: "BCA (Bank Central Asia)" },
                          { value: "BNI (Bank Negara Indonesia)",  label: "BNI (Bank Negara Indonesia)" },
                          { value: "BRI (Bank Rakyat Indonesia)",  label: "BRI (Bank Rakyat Indonesia)" },
                          { value: "Mandiri",                      label: "Mandiri" },
                          { value: "CIMB Niaga",                   label: "CIMB Niaga" },
                          { value: "BSI (Bank Syariah Indonesia)", label: "BSI (Bank Syariah Indonesia)" },
                          { value: "GoPay / OVO / Dana",           label: "GoPay / OVO / Dana (E-Wallet)" },
                          { value: "Lainnya",                      label: "Lainnya" },
                        ]}
                      />
                      <Show when={errors().senderBank}>
                        <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                          {errors().senderBank}
                        </p>
                      </Show>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-navy mb-1.5">
                        Nama Pemilik Rekening Pengirim <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ahmad Fauzan"
                        value={form().accountHolder}
                        onInput={field("accountHolder")}
                        class={`${inputBase} ${errors().accountHolder ? inputErr : inputOk}`}
                      />
                      <Show when={errors().accountHolder}>
                        <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                          {errors().accountHolder}
                        </p>
                      </Show>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-navy mb-1.5">
                        Tanggal Transfer <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form().transferDate}
                        onInput={field("transferDate")}
                        max={new Date().toISOString().split("T")[0]}
                        class={`${inputBase} ${errors().transferDate ? inputErr : inputOk}`}
                      />
                      <Show when={errors().transferDate}>
                        <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                          {errors().transferDate}
                        </p>
                      </Show>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-navy mb-1.5">
                        Foto Bukti Transfer <span class="text-red-500">*</span>
                      </label>

                      <Show
                        when={file()}
                        fallback={
                          <div
                            role="button"
                            tabindex="0"
                            aria-label="Unggah bukti transfer"
                            class={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${
                              dragOver()
                                ? "border-accent bg-ice scale-[1.01] shadow-inner"
                                : errors().file
                                ? "border-red-300 bg-red-50/40 hover:border-red-400"
                                : "border-ice bg-ice-gray hover:border-accent/40 hover:bg-ice/60"
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => (document.getElementById("file-upload") as HTMLInputElement).click()}
                            onKeyDown={(e) => e.key === "Enter" && (document.getElementById("file-upload") as HTMLInputElement).click()}
                          >
                            <div class={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${dragOver() ? "bg-accent shadow-lg" : "bg-ice"}`}>
                              <svg class={`w-8 h-8 transition-colors ${dragOver() ? "text-white" : "text-accent"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p class="text-sm font-bold text-navy mb-1">
                              {dragOver() ? "Lepaskan file di sini…" : "Seret & lepas file di sini"}
                            </p>
                            <p class="text-xs text-navy/45 mb-4">atau klik area ini untuk memilih file</p>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-ice rounded-lg text-xs text-navy/50 shadow-sm">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              PNG, JPG - Maksimum 5 MB
                            </span>
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              class="hidden"
                              onChange={(e) => { const f = (e.currentTarget as HTMLInputElement).files?.[0]; if (f) handleFile(f); }}
                            />
                          </div>
                        }
                      >
                        <div class="border-2 border-accent rounded-xl p-4 bg-ice/50">
                          <div class="flex items-center gap-4">
                            <img
                              src={preview()!}
                              alt="Preview bukti transfer"
                              class="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md flex-shrink-0"
                            />
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-bold text-navy truncate">{file()?.name}</p>
                              <p class="text-xs text-navy/45 mt-0.5">{((file()?.size ?? 0) / 1024).toFixed(1)} KB</p>
                              <div class="flex items-center gap-1.5 mt-2">
                                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-xs text-green-600 font-semibold">Siap diunggah</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setFile(null); setPreview(null); }}
                              class="p-2 rounded-lg text-navy/30 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                              aria-label="Hapus file"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Show>

                      <Show when={errors().file}>
                        <p class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                          {errors().file}
                        </p>
                      </Show>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-navy mb-1.5">
                        Catatan Tambahan{" "}
                        <span class="text-navy/35 font-normal">(opsional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Contoh: Transfer melalui mobile banking, mohon dikonfirmasi…"
                        value={form().notes}
                        onInput={field("notes")}
                        class={`${inputBase} resize-none`}
                      />
                    </div>
                  </div>

                  <div class="px-6 py-5 border-t border-ice bg-ice-gray rounded-b-2xl">
                    <div class="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-200/70 rounded-xl mb-4">
                      <svg class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-xs text-accent leading-relaxed">
                        Bukti transfer akan diverifikasi pemilik kos dalam{" "}
                        <strong>1×24 jam kerja</strong>. Notifikasi akan dikirim setelah verifikasi selesai.
                      </p>
                    </div>

                    <button
                      type="submit"
                      class="w-full bg-accent hover:bg-accent-dark active:scale-[0.99] text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-accent/30 flex items-center justify-center gap-3 text-base tracking-wide"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Kirim Bukti Pembayaran
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
