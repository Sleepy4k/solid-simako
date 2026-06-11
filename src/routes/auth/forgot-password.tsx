import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createSignal, createEffect, Show } from "solid-js";
import { AlertCircle } from "lucide-solid";
import { forgotPasswordAction } from "~/server/actions/auth";
import { forgotPasswordSchema } from "~/lib/shared/validation";
import { Button } from "~/components/ui/Button";
import { AuthLayout } from "~/layouts/AuthLayout";
import { SITE } from "~/config/site";

function ForgotPasswordForm() {
  const [email,     setEmail]     = createSignal("");
  const [emailErr,  setEmailErr]  = createSignal("");
  const [loading,   setLoading]   = createSignal(false);
  const [success,   setSuccess]   = createSignal(false);
  const [error,     setError]     = createSignal("");

  let debounce: ReturnType<typeof setTimeout>;

  createEffect(() => {
    const val = email();
    clearTimeout(debounce);
    if (!val) { setEmailErr(""); return; }
    debounce = setTimeout(() => {
      const res = forgotPasswordSchema.shape.email.safeParse(val);
      setEmailErr(res.success ? "" : (res.error.issues[0]?.message ?? ""));
    }, 400);
    return () => clearTimeout(debounce);
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const res = forgotPasswordSchema.safeParse({ email: email() });
    if (!res.success) {
      setEmailErr(res.error.issues[0]?.message ?? "Email tidak valid");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await forgotPasswordAction(new FormData(e.currentTarget as HTMLFormElement));
      if (result?.success) setSuccess(true);
      else if (result?.error) setError(result.error);
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
    <Show
      when={!success()}
      fallback={
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-bold text-navy text-lg mb-2">Email Terkirim!</h3>
          <p class="text-sm text-navy/55 mb-6">
            Jika email <strong>{email()}</strong> terdaftar, kami telah mengirim link reset kata sandi. Periksa kotak masuk Anda.
          </p>
          <A href="/auth/login" class="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:underline">
            Kembali ke halaman masuk
          </A>
        </div>
      }
    >
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
            placeholder="email@contoh.com"
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

        <Button type="submit" fullWidth loading={loading()} size="lg">
          Kirim Link Reset
        </Button>
      </form>

      <div class="mt-5 pt-5 border-t border-[#E6F0FA] text-center text-sm text-navy/55">
        Ingat kata sandi?{" "}
        <A href="/auth/login" class="text-accent font-semibold hover:underline">Masuk</A>
      </div>
    </Show>
  );
}

export default function ForgotPasswordPage() {
  return (
    <>
      <Title>Lupa Kata Sandi - {SITE.name}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <AuthLayout title="Lupa Kata Sandi?" subtitle="Masukkan email Anda dan kami akan mengirim link reset.">
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}

