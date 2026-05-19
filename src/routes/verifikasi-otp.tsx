import { A } from '@solidjs/router';
import { createSignal, onCleanup, For } from 'solid-js';
import { Mail } from 'lucide-solid';
import { AuthLayout } from '~/layouts/AuthLayout';
import { SEO } from '~/components/shared/SEO';
import { Button } from '~/components/ui/Button';
import { ROUTES } from '~/constants/routes';

const OTP_LENGTH = 6;

export default function VerifikasiOtpPage() {
  const [otp, setOtp] = createSignal<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = createSignal(false);
  const [countdown, setCountdown] = createSignal(42);

  const timer = setInterval(() => {
    setCountdown((v) => Math.max(0, v - 1));
  }, 1000);
  onCleanup(() => clearInterval(timer));

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/, '').slice(-1);
    const next = [...otp()];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent) {
    if (e.key === 'Backspace' && !otp()[index] && index > 0) {
      (document.getElementById(`otp-${index - 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    if (digits.length) {
      e.preventDefault();
      setOtp([...digits, ...Array(OTP_LENGTH - digits.length).fill('')]);
      (document.getElementById(`otp-${Math.min(digits.length, OTP_LENGTH - 1)}`) as HTMLInputElement)?.focus();
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  const isComplete = () => otp().every((d) => d !== '');
  const mm = () => String(Math.floor(countdown() / 60)).padStart(2, '0');
  const ss = () => String(countdown() % 60).padStart(2, '0');

  return (
    <AuthLayout>
      <SEO title="Verifikasi OTP" noIndex />

      <div class="flex flex-col items-center gap-4 text-center">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-primary-light">
          <Mail class="size-8 text-primary" />
        </div>

        <div>
          <h1 class="text-2xl font-bold text-ink">Cek email kamu</h1>
          <p class="mt-1 text-sm text-slate-500">
            Kami kirim kode 6 digit ke <strong>dewi.ananda@gmail.com</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} class="w-full space-y-5">
          {/* OTP inputs */}
          <div class="flex justify-center gap-3" onPaste={handlePaste}>
            <For each={otp()}>
              {(digit, i) => (
                <input
                  id={`otp-${i()}`}
                  type="text"
                  inputmode="numeric"
                  maxLength={1}
                  value={digit}
                  onInput={(e) => handleInput(i(), e.currentTarget.value)}
                  onKeyDown={(e) => handleKeyDown(i(), e)}
                  class={[
                    'size-12 rounded-xl border-2 text-center text-lg font-bold text-ink transition',
                    'focus:outline-none focus:ring-0',
                    digit
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-slate-200 bg-white hover:border-slate-300 focus:border-primary',
                  ].join(' ')}
                />
              )}
            </For>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading()} disabled={!isComplete()}>
            Verifikasi
          </Button>
        </form>

        <p class="text-sm text-slate-500">
          Tidak menerima?{' '}
          {countdown() > 0 ? (
            <span class="font-semibold text-primary">
              Kirim ulang dalam {mm()}:{ss()}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(60)}
              class="font-semibold text-primary hover:underline"
            >
              Kirim ulang sekarang
            </button>
          )}
        </p>
      </div>
    </AuthLayout>
  );
}
