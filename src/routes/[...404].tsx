import { ArrowLeft, House } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { ButtonLink } from '~/components/ui/Button';

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <SEO title="404 — Halaman Tidak Ditemukan" noIndex />

      <div class="flex min-h-[60vh] items-center justify-center px-4">
        <div class="max-w-md text-center">
          <div class="mb-6 text-8xl font-black text-primary/20">404</div>
          <h1 class="mb-2 text-2xl font-bold text-ink">Halaman Tidak Ditemukan</h1>
          <p class="mb-6 text-slate-500">
            Halaman yang kamu cari tidak ada atau telah dipindahkan.
            Mungkin URL-nya salah ketik?
          </p>
          <div class="flex justify-center gap-3">
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink"
              onClick={() => history.back()}
            >
              <ArrowLeft class="size-4" /> Kembali
            </button>
            <ButtonLink href="/" class="gap-1.5">
              <House class="size-4" /> Ke Beranda
            </ButtonLink>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
