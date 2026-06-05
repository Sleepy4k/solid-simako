import { Title, Meta } from "@solidjs/meta";
import { createSignal, createEffect, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import Eye from "lucide-solid/icons/eye";
import EyeOff from "lucide-solid/icons/eye-off";
import AlertCircle from "lucide-solid/icons/alert-circle";
import CheckCircle from "lucide-solid/icons/check-circle";
import { registerUserAction } from "~/server/actions/auth";
import { registerUserSchema } from "~/lib/shared/validation";
import { Button } from "~/components/ui/Button";
import { AuthLayout } from "~/layouts/AuthLayout";
import { toast } from "~/components/ui/Toast";
import { SITE } from "~/config/site";

type FieldErrors = Record<string, string[] | undefined>;

function FieldMsg(props: { errors?: string[]; valid?: boolean }) {
  return (
    <Show when={props.errors?.[0]}>
      <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle class="w-3 h-3 flex-shrink-0" />
        {props.errors![0]}
      </p>
    </Show>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [name,    setName]    = createSignal("");
  const [email,   setEmail]   = createSignal("");
  const [phone,   setPhone]   = createSignal("");
  const [pwd,     setPwd]     = createSignal("");
  const [confirm, setConfirm] = createSignal("");
  const [showPwd, setShowPwd] = createSignal(false);
  const [errors,  setErrors]  = createSignal<FieldErrors>({});
  const [loading, setLoading] = createSignal(false);

  function debounceField(
    accessor: () => string,
    schemaKey: keyof typeof registerUserSchema.shape,
    field: string,
    delay = 450,
  ) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    createEffect(() => {
      const val = accessor();
      if (timer) clearTimeout(timer);
      if (!val) { setErrors((p) => ({ ...p, [field]: undefined })); return; }
      timer = setTimeout(() => {
        const schema = registerUserSchema.shape[schemaKey] as any;
        if (!schema) return;
        const res = schema.safeParse(val);
        setErrors((p) => ({
          ...p,
          [field]: res.success ? undefined : [res.error?.issues[0]?.message ?? "Tidak valid"],
        }));
      }, delay);
      return () => clearTimeout(timer);
    });
  }

  debounceField(name,  "name",  "name");
  debounceField(email, "email", "email");

  let passwordTimer: ReturnType<typeof setTimeout> | undefined;
  createEffect(() => {
    const val = pwd();
    if (passwordTimer) clearTimeout(passwordTimer);
    if (!val) { setErrors((p) => ({ ...p, password: undefined })); return; }
    passwordTimer = setTimeout(() => {
      const res = registerUserSchema.shape.password.safeParse(val);
      setErrors((p) => ({
        ...p,
        password: res.success ? undefined : [res.error.issues[0]?.message ?? ""],
      }));
    }, 450);
    return () => {
      if (passwordTimer) clearTimeout(passwordTimer);
    };
  });

  let confirmTimer: ReturnType<typeof setTimeout> | undefined;
  createEffect(() => {
    const c = confirm();
    if (confirmTimer) clearTimeout(confirmTimer);
    if (!c) { setErrors((p) => ({ ...p, confirmPassword: undefined })); return; }
    confirmTimer = setTimeout(() => {
      setErrors((p) => ({
        ...p,
        confirmPassword: pwd() !== c ? ["Konfirmasi kata sandi tidak cocok"] : undefined,
      }));
    }, 400);
    return () => {
      if (confirmTimer) clearTimeout(confirmTimer);
    };
  });

  const INP = (field: string) => {
    const hasErr = !!(errors()[field]?.length);
    return `w-full px-4 py-3 rounded-xl border text-sm text-navy bg-white outline-none focus:ring-2 transition-all placeholder-navy/30 ${
      hasErr
        ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100"
        : "border-[#E6F0FA] focus:border-accent focus:ring-accent/20"
    }`;
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const result = await registerUserAction(new FormData(e.currentTarget as HTMLFormElement));
      if (result?.redirectTo) {
        window.location.href = result.redirectTo;
        return;
      }
      if (result?.errors) {
        setErrors(result.errors as FieldErrors);
        toast.error("Periksa kembali data yang Anda masukkan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} class="space-y-4" novalidate>
        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Nama Lengkap <span class="text-red-400">*</span></label>
          <input
            type="text" name="name" placeholder="Ahmad Fauzan" required
            value={name()} onInput={(e) => setName(e.currentTarget.value)}
            class={INP("name")}
          />
          <FieldMsg errors={errors().name} />
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Alamat Email <span class="text-red-400">*</span></label>
          <input
            type="email" name="email" placeholder="email@contoh.com" required autocomplete="email"
            value={email()} onInput={(e) => setEmail(e.currentTarget.value)}
            class={INP("email")}
          />
          <FieldMsg errors={errors().email} />
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">
            Nomor HP <span class="text-navy/40 font-normal text-xs">(opsional)</span>
          </label>
          <input
            type="tel" name="phone" placeholder="08xxxxxxxxxx"
            value={phone()} onInput={(e) => setPhone(e.currentTarget.value)}
            class={INP("phone")}
          />
          <FieldMsg errors={errors().phone} />
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Kata Sandi <span class="text-red-400">*</span></label>
          <div class="relative">
            <input
              type={showPwd() ? "text" : "password"}
              name="password"
              placeholder="Min. 8 karakter, huruf kapital & angka"
              required
              value={pwd()} onInput={(e) => setPwd(e.currentTarget.value)}
              class={`${INP("password")} pr-10`}
            />
            <button type="button" onClick={() => setShowPwd((p) => !p)} class="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy">
              <Show when={showPwd()} fallback={<Eye class="w-4 h-4" />}><EyeOff class="w-4 h-4" /></Show>
            </button>
          </div>
          <FieldMsg errors={errors().password} />
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Konfirmasi Kata Sandi <span class="text-red-400">*</span></label>
          <input
            type="password" name="confirmPassword" placeholder="Ulangi kata sandi" required
            value={confirm()} onInput={(e) => setConfirm(e.currentTarget.value)}
            class={INP("confirmPassword")}
          />
          <FieldMsg errors={errors().confirmPassword} />
        </div>

        <div class="flex items-start gap-3 pt-1">
          <input type="checkbox" name="agreeTerms" id="agreeTerms" value="on" class="mt-0.5 w-4 h-4 accent-accent rounded" required />
          <label for="agreeTerms" class="text-xs text-navy/60 leading-relaxed">
            Saya menyetujui{" "}
            <A href="/terms" class="text-accent hover:underline">Syarat & Ketentuan</A> dan{" "}
            <A href="/privacy" class="text-accent hover:underline">Kebijakan Privasi</A> {SITE.name}.
          </label>
        </div>
        <FieldMsg errors={errors().agreeTerms} />

        <Button type="submit" fullWidth loading={loading()} size="lg" class="mt-2">
          Buat Akun Sekarang
        </Button>
      </form>

      <div class="mt-5 pt-5 border-t border-[#E6F0FA] space-y-3">
        <p class="text-center text-sm text-navy/55">
          Sudah punya akun?{" "}
          <A href="/auth/login" class="text-accent font-semibold hover:underline">Masuk</A>
        </p>
        <p class="text-center text-xs text-navy/40">
          Ingin daftarkan kos Anda?{" "}
          <A href="/auth/register-tenant" class="text-accent hover:underline font-medium">
            Daftar sebagai Pemilik Kos
          </A>
        </p>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Title>Daftar sebagai Penyewa - {SITE.name}</Title>
      <Meta name="description" content={`Daftar gratis di ${SITE.name} dan temukan kos terbaik di Purwokerto.`} />
      <Meta name="robots" content="noindex, nofollow" />
      <AuthLayout title="Daftar sebagai Penyewa" subtitle="Gratis & mudah - temukan kos impian Anda!">
        <RegisterForm />
      </AuthLayout>
    </>
  );
}
