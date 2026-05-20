import { PublicLayout } from '~/layouts/PublicLayout';
import { SEO } from '~/components/shared/SEO';

export default function PrivasiPage() {
  return (
    <PublicLayout>
      <SEO title="Kebijakan Privasi" description="Kebijakan privasi platform Simako." />

      <article class="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-slate-700">
        <h1 class="text-3xl font-black text-ink">Kebijakan Privasi</h1>
        <p class="mt-2 text-xs text-slate-400">Terakhir diperbarui: 1 Januari 2026</p>

        <h2 class="mt-8 text-xl font-bold text-ink">Data yang Kami Kumpulkan</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li>Data akun: email, kata sandi terenkripsi, nama lengkap.</li>
          <li>Data kontak: nomor HP / WhatsApp.</li>
          <li>Data KYC (untuk owner): foto KTP, alamat.</li>
          <li>Data transaksi: riwayat sewa dan pembayaran.</li>
          <li>Data teknis: alamat IP, user agent, log aktivitas.</li>
        </ul>

        <h2 class="mt-8 text-xl font-bold text-ink">Bagaimana Kami Menggunakan Data</h2>
        <p class="mt-2">
          Data digunakan untuk: menyediakan layanan, memverifikasi identitas owner, memproses transaksi,
          komunikasi notifikasi, dan keamanan platform. Kami <strong>tidak menjual data</strong> kepada pihak ketiga.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">Keamanan</h2>
        <p class="mt-2">
          Kata sandi disimpan terenkripsi (argon2). Komunikasi server menggunakan HTTPS. Akses ke data KYC dibatasi
          hanya untuk tim verifikasi dengan jejak audit.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">Hak Pengguna</h2>
        <p class="mt-2">
          Anda berhak mengakses, memperbarui, atau menghapus data Anda. Hubungi tim kami melalui halaman Kontak.
        </p>

        <h2 class="mt-8 text-xl font-bold text-ink">Cookie & Session</h2>
        <p class="mt-2">
          Kami menggunakan cookie httpOnly untuk session login. Cookie ini tidak dapat diakses oleh JavaScript untuk
          mencegah serangan XSS.
        </p>
      </article>
    </PublicLayout>
  );
}
