import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';

export default function SyaratPage() {
  return (
    <PublicLayout>
      <SEO title="Syarat & Ketentuan" description="Syarat dan ketentuan penggunaan platform Simako." />

      <article class="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-slate-700">
        <h1 class="text-3xl font-black text-ink">Syarat & Ketentuan</h1>
        <p class="mt-2 text-xs text-slate-400">Terakhir diperbarui: 1 Januari 2026</p>

        <h2 class="mt-8 text-xl font-bold text-ink">1. Tentang Layanan</h2>
        <p class="mt-2">
          Simako adalah platform yang menghubungkan pencari kost dan pemilik kost. Kami tidak menjadi perantara
          pembayaran — seluruh transaksi sewa dilakukan langsung antara penyewa dan pemilik kost via transfer bank.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">2. Akun Pengguna</h2>
        <p class="mt-2">
          Anda bertanggung jawab atas kerahasiaan kata sandi akun. Simako berhak menangguhkan akun yang melanggar
          ketentuan layanan, melakukan penipuan, atau menyalahgunakan platform.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">3. KYC Owner</h2>
        <p class="mt-2">
          Setiap owner wajib menjalani verifikasi identitas (KYC) sebelum listing tayang. Owner bertanggung jawab atas
          keakuratan data properti yang ditampilkan.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">4. Pembayaran</h2>
        <p class="mt-2">
          Pembayaran sewa dilakukan via transfer bank langsung ke rekening owner. Penyewa wajib mengunggah bukti
          transfer; owner berhak mengkonfirmasi atau menolak bukti tersebut.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">5. Sengketa</h2>
        <p class="mt-2">
          Setiap perselisihan antara penyewa dan owner akan ditengahi oleh tim Simako melalui Pusat Resolusi
          Konflik. Putusan tim Simako bersifat final.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">6. Perubahan</h2>
        <p class="mt-2">
          Simako dapat memperbarui syarat & ketentuan ini sewaktu-waktu. Pengguna akan diberi tahu melalui email.
        </p>
      </article>
    </PublicLayout>
  );
}
