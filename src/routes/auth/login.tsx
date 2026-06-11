import { Title, Meta } from "@solidjs/meta";
import { createSignal, createEffect, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Eye, EyeOff, AlertCircle } from "lucide-solid";
import { loginAction } from "~/server/actions/auth";
import { loginSchema } from "~/lib/shared/validation";
import { Button } from "~/components/ui/Button";
import { AuthLayout } from "~/layouts/AuthLayout";
import { toast } from "~/components/ui/Toast";
import { SITE } from "~/config/site";

function LoginForm() {
  const navigate = useNavigate();
  const [email,    setEmail]    = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error,    setError]    = createSignal<string>("");
  const [loading,  setLoading]  = createSignal(false);
  const [showPwd,  setShowPwd]  = createSignal(false);

  const [emailErr, setEmailErr] = createSignal("");
  let emailDebounce: ReturnType<typeof setTimeout>;

  createEffect(() => {
    const val = email();
    clearTimeout(emailDebounce);
    if (!val) { setEmailErr(""); return; }
    emailDebounce = setTimeout(() => {
      const res = loginSchema.shape.email.safeParse(val);
      setEmailErr(res.success ? "" : (res.error.issues[0]?.message ?? ""));
    }, 500);
    return () => clearTimeout(emailDebounce);
  });

  const INP = (hasErr: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-navy bg-white outline-none focus:ring-2 transition-all placeholder-navy/30 ${
      hasErr
        ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100"
        : "border-[#E6F0FA] focus:border-accent focus:ring-accent/20"
    }`;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    const preCheck = loginSchema.safeParse({ email: email(), password: password() });
    if (!preCheck.success) {
      const msg = preCheck.error.issues[0]?.message ?? "Data tidak valid";
      setError(msg);
      return;
    }
    setLoading(true);
    try {
      const result = await loginAction(new FormData(e.currentTarget as HTMLFormElement));

      if (result?.redirectTo) {
        window.location.href = result.redirectTo;
        return;
      }
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

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
          <label class="block text-sm font-semibold text-navy mb-1.5">Alamat Email</label>
          <input
            type="email"
            name="email"
            placeholder="nama@email.com"
            required
            autocomplete="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class={INP(!!emailErr())}
          />
          <Show when={emailErr()}>
            <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle class="w-3 h-3 flex-shrink-0" />
              {emailErr()}
            </p>
          </Show>
        </div>

        <div>
          <label class="block text-sm font-semibold text-navy mb-1.5">Kata Sandi</label>
          <div class="relative">
            <input
              type={showPwd() ? "text" : "password"}
              name="password"
              placeholder="Masukkan kata sandi"
              required
              autocomplete="current-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class={`${INP(false)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
            >
              <Show when={showPwd()} fallback={<Eye class="w-4 h-4" />}>
                <EyeOff class="w-4 h-4" />
              </Show>
            </button>
          </div>
          <div class="text-right mt-1">
            <A href="/auth/forgot-password" class="text-xs text-accent hover:underline">Lupa kata sandi?</A>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading()} size="lg" class="mt-2">Masuk</Button>
      </form>

      <div class="mt-5 pt-5 border-t border-[#E6F0FA] text-center text-sm text-navy/55">
        Belum punya akun?{" "}
        <A href="/auth/register" class="text-accent font-semibold hover:underline">Daftar sekarang</A>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <>
      <Title>Masuk - {SITE.name}</Title>
      <Meta name="description" content={`Masuk ke akun ${SITE.name} Anda untuk mengelola kos dan booking.`} />
      <Meta name="robots" content="noindex, nofollow" />
      <AuthLayout title="Masuk ke Akun" subtitle="Selamat datang kembali!">
        <LoginForm />
      </AuthLayout>
    </>
  );
}

