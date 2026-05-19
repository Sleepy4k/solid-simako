import { A } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

export default function LupaSandiPage() {
  const [loading, setLoading] = createSignal(false);
  const [sent, setSent] = createSignal(false);
  const [email, setEmail] = createSignal('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  }

  return (
    <AuthLayout>
      <SEO title="Lupa Kata Sandi" noIndex />

      <A href={ROUTES.MASUK} class="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary">
        <ArrowLeft class="size-3.5" /> Kembali ke halaman masuk
      </A>

      <Show
        when={sent()}
        fallback={
          <>
            <h1 class="mb-1 text-2xl font-bold text-ink">Lupa kata sandi?</h1>
            <p class="mb-6 text-sm text-slate-500">
              Masukkan email akunmu. Kami akan kirim tautan reset kata sandi.
            </p>
            <form onSubmit={handleSubmit} class="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="dewi.ananda@gmail.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                prefix={<Mail class="size-4" />}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={loading()}>
                Kirim tautan reset
              </Button>
            </form>
          </>
        }
      >
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="flex size-16 items-center justify-center rounded-2xl bg-success-light">
            <CheckCircle class="size-8 text-success" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-ink">Email terkirim!</h1>
            <p class="mt-1 text-sm text-slate-500">
              Cek kotak masuk <strong>{email()}</strong>. Tautan reset berlaku 15 menit.
            </p>
          </div>
          <A href={ROUTES.MASUK} class="text-sm font-semibold text-primary hover:underline">
            Kembali ke halaman masuk
          </A>
        </div>
      </Show>
    </AuthLayout>
  );
}
