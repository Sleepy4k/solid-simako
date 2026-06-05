import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { registerTenantAction } from "~/server/actions/auth";
import { Button } from "~/components/ui/Button";
import { SITE } from "~/config/site";

type FieldErrors = Record<string, string[] | undefined>;

const inputCls = (err?: string[]) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-navy bg-white outline-none focus:ring-2 transition-all placeholder-navy/30 ${
    err?.length ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100" : "border-[#E6F0FA] focus:border-accent focus:ring-accent/20"
  }`;

function FieldError(props: { errors?: string[] }) {
  return (
    <Show when={props.errors?.[0]}>
      <p class="text-xs text-red-500 mt-1">{props.errors![0]}</p>
    </Show>
  );
}

export function RegisterTenantForm() {
  const navigate = useNavigate();
  const [errors,  setErrors]  = createSignal<FieldErrors>({});
  const [loading, setLoading] = createSignal(false);
  const [step,    setStep]    = createSignal<1 | 2>(1);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const result   = await registerTenantAction(formData);
      if (result?.redirectTo) {
        window.location.href = result.redirectTo;
        return;
      }
      if (result?.errors) { setErrors(result.errors as FieldErrors); setStep(1); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        <div class="text-center mb-8">
          <A href="/" class="inline-flex items-center gap-2.5 mb-4">
            <div class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center font-black text-white text-sm shadow">SK</div>
            <span class="font-black text-xl text-navy">{SITE.name}</span>
          </A>
          <h1 class="text-2xl font-black text-navy">Daftarkan Kos Anda</h1>
          <p class="text-navy/50 text-sm mt-1">Bergabung dan mulai kelola kos Anda secara digital</p>
        </div>

        <div class="flex items-center justify-center gap-2 mb-6">
          {([1, 2] as const).map((s) => (
            <>
              <div
                class={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step() >= s ? "bg-accent text-white" : "bg-[#E6F0FA] text-navy/40"
                }`}
              >
                {s}
              </div>
              {s === 1 && <div class={`w-12 h-px ${step() >= 2 ? "bg-accent" : "bg-[#E6F0FA]"}`} />}
            </>
          ))}
        </div>
        <div class="flex justify-center gap-12 mb-6 text-xs text-navy/50">
          <span class={step() === 1 ? "text-accent font-semibold" : ""}>Data Diri</span>
          <span class={step() === 2 ? "text-accent font-semibold" : ""}>Info Usaha</span>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E6F0FA] p-7">
          <form onSubmit={handleSubmit} class="space-y-4" novalidate>
            <Show when={step() === 1}>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Nama Lengkap <span class="text-red-400">*</span></label>
                <input type="text" name="name" placeholder="Nama sesuai KTP" required class={inputCls(errors().name)} />
                <FieldError errors={errors().name} />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Alamat Email <span class="text-red-400">*</span></label>
                <input type="email" name="email" placeholder="email@contoh.com" required autocomplete="email" class={inputCls(errors().email)} />
                <FieldError errors={errors().email} />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Nomor HP Aktif <span class="text-red-400">*</span></label>
                <input type="tel" name="phone" placeholder="08xxxxxxxxxx" required class={inputCls(errors().phone)} />
                <p class="text-xs text-navy/40 mt-1">Digunakan untuk komunikasi dengan penyewa</p>
                <FieldError errors={errors().phone} />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Kata Sandi <span class="text-red-400">*</span></label>
                <input type="password" name="password" placeholder="Min. 8 karakter, huruf kapital & angka" required class={inputCls(errors().password)} />
                <FieldError errors={errors().password} />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Konfirmasi Kata Sandi <span class="text-red-400">*</span></label>
                <input type="password" name="confirmPassword" placeholder="Ulangi kata sandi" required class={inputCls(errors().confirmPassword)} />
                <FieldError errors={errors().confirmPassword} />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                class="w-full bg-navy hover:bg-navy-dark text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
              >
                Lanjut ke Info Usaha →
              </button>
            </Show>

            <Show when={step() === 2}>
              <div class="p-3 bg-[#E6F0FA] rounded-xl text-xs text-accent mb-2">
                <strong>Info:</strong> Data berikut akan ditampilkan di profil Pemilik Kos Anda setelah diverifikasi admin.
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Nama Usaha / Kos <span class="text-red-400">*</span></label>
                <input type="text" name="businessName" placeholder="cth: Kos Melati Indah" required class={inputCls(errors().businessName)} />
                <FieldError errors={errors().businessName} />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-semibold text-navy mb-1.5">Bank</label>
                  <select name="bankName" class={inputCls()}>
                    <option value="">Pilih Bank</option>
                    {["BCA", "BNI", "BRI", "Mandiri", "BSI", "CIMB Niaga"].map((b) => (
                      <option value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-navy mb-1.5">Nomor Rekening</label>
                  <input type="text" name="bankAccount" placeholder="1234567890" class={inputCls()} />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-1.5">Nama Pemilik Rekening</label>
                <input type="text" name="bankHolder" placeholder="Sesuai buku tabungan" class={inputCls()} />
              </div>

              <div class="flex items-start gap-3 pt-1">
                <input type="checkbox" name="agreeTerms" id="agreeTermsTenant" value="on" class="mt-0.5 w-4 h-4 accent-accent rounded" required />
                <label for="agreeTermsTenant" class="text-xs text-navy/60 leading-relaxed">
                  Saya menyetujui{" "}
                  <A href="/terms" class="text-accent hover:underline">Syarat & Ketentuan</A>{" "}
                  dan{" "}
                  <A href="/privacy" class="text-accent hover:underline">Kebijakan Privasi</A> SimaKos untuk Mitra Pemilik Kos.
                </label>
              </div>
              <FieldError errors={errors().agreeTerms} />

              <div class="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(1)} class="flex-1 border-2 border-[#E6F0FA] text-navy font-semibold py-3 rounded-xl hover:bg-[#F4F7FA] transition-colors text-sm">
                  ← Kembali
                </button>
                <Button type="submit" loading={loading()} size="md" class="flex-1">
                  Daftar Sekarang
                </Button>
              </div>
            </Show>
          </form>

          <div class="mt-5 pt-5 border-t border-[#E6F0FA] text-center text-sm text-navy/55">
            Sudah punya akun?{" "}
            <A href="/auth/login" class="text-accent font-semibold hover:underline">Masuk</A>
            {" · "}
            <A href="/auth/register" class="text-accent font-semibold hover:underline">Daftar sebagai Penyewa</A>
          </div>
        </div>

        <div class="mt-4 text-center">
          <A href="/" class="text-sm text-navy/40 hover:text-navy transition-colors flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Kembali ke Beranda
          </A>
        </div>
      </div>
    </div>
  );
}
