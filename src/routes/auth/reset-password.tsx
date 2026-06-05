import { Title, Meta } from "@solidjs/meta";
import { A, useSearchParams, useNavigate } from "@solidjs/router";
import { createSignal, createEffect, Show } from "solid-js";
import AlertCircle from "lucide-solid/icons/alert-circle";
import Eye from "lucide-solid/icons/eye";
import EyeOff from "lucide-solid/icons/eye-off";
import { resetPasswordAction } from "~/server/actions/auth";
import { resetPasswordSchema } from "~/lib/shared/validation";
import { Button } from "~/components/ui/Button";
import { AuthLayout } from "~/layouts/AuthLayout";
import { toast } from "~/components/ui/Toast";
import { SITE } from "~/config/site";

type FieldErrors = Record<string, string[] | undefined>;

function ResetPasswordForm(props: { token: string }) {
  const navigate = useNavigate();

  const [password,    setPassword]    = createSignal("");
  const [confirm,     setConfirm]     = createSignal("");
  const [showPwd,     setShowPwd]     = createSignal(false);
  const [showConfirm, setShowConfirm] = createSignal(false);
  const [errors,      setErrors]      = createSignal<FieldErrors>({});
  const [loading,     setLoading]     = createSignal(false);
  const [error,       setError]       = createSignal("");

  let pwdDebounce:  ReturnType<typeof setTimeout>;
  let cfmDebounce:  ReturnType<typeof setTimeout>;

  createEffect(() => {
    const val = password();
    clearTimeout(pwdDebounce);
    if (!val) { setErrors((p) => ({ ...p, password: undefined })); return; }
    pwdDebounce = setTimeout(() => {
      const res = resetPasswordSchema.shape.password.safeParse(val);
      setErrors((p) => ({ ...p, password: res.success ? undefined : [res.error.issues[0]?.message ?? ""] }));
    }, 400);
    return () => clearTimeout(pwdDebounce);
  });

  createEffect(() => {
    const pwd = password();
    const cfm = confirm();
    clearTimeout(cfmDebounce);
    if (!cfm) { setErrors((p) => ({ ...p, confirmPassword: undefined })); return; }
    cfmDebounce = setTimeout(() => {
      setErrors((p) => ({
        ...p,
        confirmPassword: pwd !== cfm ? ["Konfirmasi kata sandi tidak cocok"] : undefined,
      }));
    }, 400);
    return () => clearTimeout(cfmDebounce);
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      fd.set("token", props.token);
      const result = await resetPasswordAction(fd);
      if (result?.errors) { setErrors(result.errors as FieldErrors); return; }
      if (result?.error)  { setError(result.error); return; }
      if (result?.success) {
        toast.success("Kata sandi berhasil diubah! Silakan masuk.");
        navigate("/auth/login");
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const INP = (hasErr: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-navy bg-white outline-none focus:ring-2 transition-all placeholder-navy/30 ${
      hasErr
        ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100"
        : "border-[#E6F0FA] focus:border-accent focus:ring-accent/20"
    }`;

  return (
    <>
      <Show when={error()}>
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {error()}
        </div>
      </Show>

      <form onSubmit={handleSubmit} class="space-y-4" novalidate>
        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Kata Sandi Baru <span class="text-red-400">*</span></label>
          <div class="relative">
            <input
              type={showPwd() ? "text" : "password"}
              name="password"
              placeholder="Min. 8 karakter, huruf kapital & angka"
              required
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class={`${INP(!!errors().password?.length)} pr-10`}
            />
            <button type="button" onClick={() => setShowPwd((p) => !p)} class="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy">
              <Show when={showPwd()} fallback={<Eye class="w-4 h-4" />}><EyeOff class="w-4 h-4" /></Show>
            </button>
          </div>
          <Show when={errors().password?.[0]}>
            <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle class="w-3 h-3 flex-shrink-0" />
              {errors().password![0]}
            </p>
          </Show>
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Konfirmasi Kata Sandi <span class="text-red-400">*</span></label>
          <div class="relative">
            <input
              type={showConfirm() ? "text" : "password"}
              name="confirmPassword"
              placeholder="Ulangi kata sandi baru"
              required
              value={confirm()}
              onInput={(e) => setConfirm(e.currentTarget.value)}
              class={`${INP(!!errors().confirmPassword?.length)} pr-10`}
            />
            <button type="button" onClick={() => setShowConfirm((p) => !p)} class="absolute right-3 top-1/2 -translate-y-1/2 text-navy/35 hover:text-navy">
              <Show when={showConfirm()} fallback={<Eye class="w-4 h-4" />}><EyeOff class="w-4 h-4" /></Show>
            </button>
          </div>
          <Show when={errors().confirmPassword?.[0]}>
            <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle class="w-3 h-3 flex-shrink-0" />
              {errors().confirmPassword![0]}
            </p>
          </Show>
        </div>

        <Button type="submit" fullWidth loading={loading()} size="lg">
          Simpan Kata Sandi Baru
        </Button>
      </form>

      <div class="mt-5 pt-5 border-t border-[#E6F0FA] text-center text-sm text-navy/55">
        <A href="/auth/login" class="text-accent font-semibold hover:underline">Kembali ke Halaman Masuk</A>
      </div>
    </>
  );
}

function InvalidToken() {
  return (
    <div class="text-center">
      <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8 text-red-500" />
      </div>
      <h3 class="font-bold text-navy text-lg mb-2">Link Tidak Valid</h3>
      <p class="text-sm text-navy/55 mb-6">Link reset kata sandi tidak valid atau sudah kedaluwarsa. Minta link baru.</p>
      <A href="/auth/forgot-password" class="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
        Minta Link Baru
      </A>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams<{ token?: string }>();
  const token = () => params.token ?? "";

  return (
    <>
      <Title>Reset Kata Sandi - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <AuthLayout title="Buat Kata Sandi Baru" subtitle="Pastikan kata sandi baru Anda kuat dan mudah diingat.">
        <Show when={token()} fallback={<InvalidToken />}>
          <ResetPasswordForm token={token()} />
        </Show>
      </AuthLayout>
    </>
  );
}
