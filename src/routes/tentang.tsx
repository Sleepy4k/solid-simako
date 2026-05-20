import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';

export default function TentangPage() {
  return (
    <PublicLayout>
      <SEO
        title="Tentang Kami"
        description="Simako adalah platform manajemen kost yang menyederhanakan pencarian dan pengelolaan kost di Purwokerto."
      />

      <article class="mx-auto max-w-3xl px-4 py-12">
        <h1 class="text-3xl font-black text-ink">Tentang Simako</h1>
        <p class="mt-4 text-base text-slate-600">
          <strong>Simako</strong> (Sistem Manajemen Kost) adalah platform yang lahir dari kebutuhan nyata pemilik kost
          dan pencari kost di Purwokerto. Kami percaya bahwa transaksi kos-kosan tidak harus melalui pihak ketiga yang
          memungut komisi — cukup hubungkan kedua belah pihak dan verifikasi pembayaran secara <em>human-checked</em>.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">Misi kami</h2>
        <p class="mt-2 text-sm text-slate-600">
          Menyederhanakan pencarian dan pengelolaan kost di Purwokerto, dengan transparansi penuh dan tanpa biaya tersembunyi.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">Nilai kami</h2>
        <ul class="mt-2 space-y-2 text-sm text-slate-600">
          <li>• <strong>Transparan</strong> — listing wajib verified, bayar langsung ke owner.</li>
          <li>• <strong>Manusiawi</strong> — setiap KYC dan dispute ditinjau tim, bukan algoritma.</li>
          <li>• <strong>Lokal</strong> — fokus di Purwokerto, paham karakter pasar dan komunitas mahasiswa.</li>
        </ul>

        <h2 class="mt-8 text-xl font-bold text-ink">Tim kami</h2>
        <p class="mt-2 text-sm text-slate-600">
          Simako dikembangkan oleh tim kecil yang bersemangat soal teknologi dan pendidikan tinggi.
          Kami bekerja dari Purwokerto.
        </p>
      </article>
    </PublicLayout>
  );
}
