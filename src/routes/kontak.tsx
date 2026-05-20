import { Mail, MessageSquare, MapPin } from 'lucide-solid';
import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Button } from '~/components/ui/Button';

export default function KontakPage() {
  return (
    <PublicLayout>
      <SEO title="Kontak" description="Hubungi tim Simako untuk pertanyaan, kerjasama, atau dukungan." />

      <div class="mx-auto max-w-5xl px-4 py-12">
        <h1 class="text-3xl font-black text-ink">Hubungi Kami</h1>
        <p class="mt-2 text-sm text-slate-500">
          Tim kami akan merespons dalam 1×24 jam pada hari kerja.
        </p>

        <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <form class="space-y-4">
            <Input label="Nama" required />
            <Input label="Email" type="email" required />
            <Input label="Subjek" required />
            <Textarea label="Pesan" rows={5} required />
            <Button>Kirim Pesan</Button>
          </form>

          <div class="space-y-4">
            <div class="rounded-2xl border border-slate-100 bg-white p-4">
              <Mail class="size-5 text-primary" />
              <p class="mt-2 text-xs font-semibold text-ink">Email</p>
              <a
                href="mailto:halo@simako.id"
                class="text-sm text-slate-600 hover:text-primary"
              >
                halo@simako.id
              </a>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-white p-4">
              <MessageSquare class="size-5 text-primary" />
              <p class="mt-2 text-xs font-semibold text-ink">WhatsApp</p>
              <p class="text-sm text-slate-600">0812 0000 0000</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-white p-4">
              <MapPin class="size-5 text-primary" />
              <p class="mt-2 text-xs font-semibold text-ink">Alamat</p>
              <p class="text-sm text-slate-600">
                Purwokerto, Banyumas, Jawa Tengah
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
