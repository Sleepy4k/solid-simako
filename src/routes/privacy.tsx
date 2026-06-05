import { Title, Meta } from "@solidjs/meta";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE } from "~/config/site";

export default function PrivacyPage() {
  return (
    <>
      <Title>Kebijakan Privasi - {SITE.name}</Title>
      <Meta name="description" content={`Kebijakan privasi dan perlindungan data pengguna platform ${SITE.name}.`} />
      <Meta name="robots" content="index, follow" />

      <LandingLayout>
        <div class="bg-[#F4F7FA] pt-16 min-h-screen">
          <div class="bg-navy py-12 px-5 text-white">
            <div class="max-w-4xl mx-auto">
              <p class="text-white/50 text-xs mb-2 uppercase tracking-wider">Legal</p>
              <h1 class="text-3xl font-black mb-2">Kebijakan Privasi</h1>
              <p class="text-white/55 text-sm">Terakhir diperbarui: Juni 2025</p>
            </div>
          </div>

          <div class="max-w-4xl mx-auto px-5 py-12">
            <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-8">

              <div class="bg-[#E6F0FA] rounded-xl p-4 mb-8 flex gap-3">
                <svg class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p class="text-sm text-navy/70 leading-relaxed">
                  Privasi Anda adalah prioritas kami. Dokumen ini menjelaskan bagaimana {SITE.name} mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                </p>
              </div>

              <Section title="1. Informasi yang Kami Kumpulkan">
                <p>Kami mengumpulkan beberapa jenis informasi untuk menyediakan layanan terbaik:</p>
                <h4>Informasi yang Anda Berikan</h4>
                <ul>
                  <li>Nama lengkap dan alamat email saat pendaftaran</li>
                  <li>Nomor telepon (opsional)</li>
                  <li>Informasi properti untuk pemilik kos</li>
                  <li>Foto dan dokumen yang Anda unggah</li>
                </ul>
                <h4>Informasi yang Dikumpulkan Otomatis</h4>
                <ul>
                  <li>Data penggunaan dan navigasi di platform</li>
                  <li>Alamat IP dan informasi browser</li>
                  <li>Cookie dan teknologi pelacakan serupa</li>
                </ul>
              </Section>

              <Section title="2. Penggunaan Informasi">
                <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                <ul>
                  <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
                  <li>Memproses transaksi dan mengelola akun Anda</li>
                  <li>Mengirimkan notifikasi penting terkait layanan</li>
                  <li>Merespons pertanyaan dan permintaan dukungan</li>
                  <li>Mendeteksi dan mencegah penipuan atau aktivitas mencurigakan</li>
                  <li>Mematuhi kewajiban hukum yang berlaku</li>
                </ul>
              </Section>

              <Section title="3. Berbagi Informasi">
                <p>Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Informasi Anda dapat dibagikan dalam kondisi:</p>
                <ul>
                  <li><strong>Antar pengguna platform:</strong> Informasi profil dasar Anda terlihat oleh pengguna lain sesuai fitur platform</li>
                  <li><strong>Penyedia layanan:</strong> Pihak ketiga yang membantu operasional kami (seperti layanan email) dengan perjanjian kerahasiaan</li>
                  <li><strong>Hukum:</strong> Jika diwajibkan oleh undang-undang atau perintah pengadilan</li>
                </ul>
              </Section>

              <Section title="4. Keamanan Data">
                <p>Kami menggunakan langkah-langkah keamanan industri standar untuk melindungi data Anda:</p>
                <ul>
                  <li>Enkripsi HTTPS untuk semua transmisi data</li>
                  <li>Kata sandi di-hash menggunakan algoritma Argon2id</li>
                  <li>Autentikasi berbasis token JWT yang aman</li>
                  <li>Akses database terbatas dan termonitor</li>
                </ul>
              </Section>

              <Section title="5. Cookie">
                <p>{SITE.name} menggunakan cookie sesi (HttpOnly) untuk autentikasi. Cookie ini tidak digunakan untuk pelacakan iklan. Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi optimal.</p>
              </Section>

              <Section title="6. Hak Anda">
                <p>Anda memiliki hak untuk:</p>
                <ul>
                  <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda</li>
                  <li><strong>Koreksi:</strong> Memperbarui informasi yang tidak akurat melalui pengaturan akun</li>
                  <li><strong>Penghapusan:</strong> Meminta penghapusan akun dan data pribadi Anda</li>
                  <li><strong>Portabilitas:</strong> Meminta ekspor data Anda dalam format yang dapat dibaca</li>
                </ul>
              </Section>

              <Section title="7. Retensi Data">
                <p>Kami menyimpan data Anda selama akun aktif atau sesuai kebutuhan penyediaan layanan. Setelah penghapusan akun, data akan dihapus dalam 30 hari, kecuali data yang wajib disimpan oleh hukum.</p>
              </Section>

              <Section title="8. Perubahan Kebijakan">
                <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email terdaftar. Tanggal "Terakhir diperbarui" di atas menunjukkan kapan kebijakan ini terakhir direvisi.</p>
              </Section>

              <Section title="9. Hubungi Kami">
                <p>Untuk pertanyaan tentang kebijakan privasi ini atau untuk menggunakan hak-hak Anda, hubungi tim privasi kami:</p>
                <p class="mt-2">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${SITE.contact.email}`} class="text-accent hover:underline">{SITE.contact.email}</a>
                </p>
                <p class="text-navy/50 text-xs mt-3">
                  {SITE.name} - {SITE.city}, {SITE.province}, Indonesia
                </p>
              </Section>

            </div>
          </div>
        </div>
      </LandingLayout>
    </>
  );
}

function Section(props: { title: string; children: any }) {
  return (
    <div class="mb-8">
      <h2 class="text-lg font-black text-navy mb-3 pb-2 border-b border-[#E6F0FA]">{props.title}</h2>
      <div class="text-navy/70 text-sm leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_h4]:font-bold [&_h4]:text-navy [&_h4]:mt-3 [&_h4]:mb-1">{props.children}</div>
    </div>
  );
}
