import { A, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';
import { forgotPasswordAction } from '~/server/actions/auth';

export default function LupaSandiPage() {
  const sub = useSubmission(forgotPasswordAction);
  const success = () => sub.result && 'ok' in sub.result && sub.result.ok;

  return (
    <AuthLayout>
      <SEO title="Lupa Kata Sandi" noIndex />

      <A
        href={ROUTES.MASUK}
        class="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary"
      >
        <ArrowLeft class="size-3.5" /> Kembali ke halaman masuk
      </A>

      <Show
        when={success()}
        fallback={
          <>
            <h1 class="mb-1 text-2xl font-bold text-ink">Lupa kata sandi?</h1>
            <p class="mb-6 text-sm text-slate-500">
              Masukkan email akunmu. Kami akan kirim tautan reset kata sandi.
            </p>

            <Show when={sub.result && 'ok' in sub.result && !sub.result.ok}>
              <div class="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                {sub.result && 'message' in sub.result ? sub.result.message : 'Gagal mengirim'}
              </div>
            </Show>

            <form action={forgotPasswordAction} method="post" class="space-y-4">
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="dewi.ananda@gmail.com"
                prefix={<Mail class="size-4" />}
                required
              />
              <Button type="submit" fullWidth size="lg" loading={sub.pending}>
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
              {sub.result && 'message' in sub.result
                ? sub.result.message
                : 'Periksa kotak masuk email kamu.'}{' '}
              Tautan berlaku 30 menit.
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
