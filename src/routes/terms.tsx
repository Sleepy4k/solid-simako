import { Title, Meta } from "@solidjs/meta";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE } from "~/config/site";

export default function TermsPage() {
  return (
    <>
      <Title>Syarat & Ketentuan - {SITE.name}</Title>
      <Meta name="description" content={`Syarat dan ketentuan penggunaan platform ${SITE.name}.`} />
      <Meta name="robots" content="index, follow" />

      <LandingLayout>
        <div class="bg-[#F4F7FA] pt-16 min-h-screen">
          <div class="bg-navy py-12 px-5 text-white">
            <div class="max-w-4xl mx-auto">
              <p class="text-white/50 text-xs mb-2 uppercase tracking-wider">Legal</p>
              <h1 class="text-3xl font-black mb-2">Syarat & Ketentuan</h1>
              <p class="text-white/55 text-sm">Terakhir diperbarui: Juni 2025</p>
            </div>
          </div>

          <div class="max-w-4xl mx-auto px-5 py-12">
            <div class="bg-white rounded-2xl border border-[#E6F0FA] shadow-sm p-8 prose prose-sm max-w-none">

              <Section title="1. Penerimaan Syarat">
                <p>Dengan mengakses dan menggunakan platform {SITE.name}, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami.</p>
              </Section>

              <Section title="2. Deskripsi Layanan">
                <p>{SITE.name} adalah platform digital yang menghubungkan pencari kos dengan pemilik kos di wilayah Purwokerto dan sekitarnya. Kami menyediakan:</p>
                <ul>
                  <li>Layanan pencarian dan penemuan kos</li>
                  <li>Platform komunikasi antara penyewa dan pemilik kos</li>
                  <li>Sistem manajemen pemesanan dan pembayaran</li>
                  <li>Fitur ulasan dan penilaian</li>
                </ul>
              </Section>

              <Section title="3. Akun Pengguna">
                <p>Untuk menggunakan fitur tertentu, Anda wajib membuat akun dengan ketentuan:</p>
                <ul>
                  <li>Memberikan informasi yang akurat dan terkini</li>
                  <li>Menjaga kerahasiaan kata sandi akun Anda</li>
                  <li>Bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
                  <li>Segera memberitahu kami jika terjadi penggunaan tidak sah</li>
                </ul>
              </Section>

              <Section title="4. Kewajiban Pemilik Kos (Tenant)">
                <p>Sebagai pemilik kos yang terdaftar, Anda berkewajiban untuk:</p>
                <ul>
                  <li>Menyediakan informasi properti yang akurat dan tidak menyesatkan</li>
                  <li>Merespons permintaan pemesanan dalam waktu 1×24 jam</li>
                  <li>Menjaga ketersediaan kamar sesuai yang ditampilkan</li>
                  <li>Mematuhi hukum dan peraturan setempat terkait sewa-menyewa</li>
                  <li>Tidak melakukan diskriminasi berdasarkan ras, agama, atau jenis kelamin</li>
                </ul>
              </Section>

              <Section title="5. Kewajiban Penyewa (User)">
                <p>Sebagai penyewa, Anda berkewajiban untuk:</p>
                <ul>
                  <li>Memberikan informasi yang benar saat melakukan pemesanan</li>
                  <li>Melakukan pembayaran tepat waktu sesuai kesepakatan</li>
                  <li>Menjaga dan merawat fasilitas kos dengan baik</li>
                  <li>Mematuhi peraturan yang ditetapkan pemilik kos</li>
                </ul>
              </Section>

              <Section title="6. Pembayaran dan Transaksi">
                <p>Pembayaran dilakukan secara langsung antara penyewa dan pemilik kos melalui transfer bank. {SITE.name} tidak bertindak sebagai perantara pembayaran. {SITE.name} tidak bertanggung jawab atas sengketa pembayaran yang terjadi antara penyewa dan pemilik kos.</p>
              </Section>

              <Section title="7. Larangan Penggunaan">
                <p>Anda dilarang untuk:</p>
                <ul>
                  <li>Menggunakan platform untuk kegiatan ilegal</li>
                  <li>Memposting konten palsu, menyesatkan, atau tidak pantas</li>
                  <li>Melakukan spam atau mengirim komunikasi yang tidak diinginkan</li>
                  <li>Mencoba mengakses sistem atau akun pengguna lain tanpa izin</li>
                  <li>Menggunakan platform untuk tujuan komersial tanpa izin tertulis</li>
                </ul>
              </Section>

              <Section title="8. Batasan Tanggung Jawab">
                <p>{SITE.name} tidak bertanggung jawab atas:</p>
                <ul>
                  <li>Keakuratan informasi yang disediakan oleh pemilik kos</li>
                  <li>Kualitas dan kondisi properti yang terdaftar</li>
                  <li>Sengketa yang timbul antara penyewa dan pemilik kos</li>
                  <li>Kerugian tidak langsung atau konsekuensial dari penggunaan platform</li>
                </ul>
              </Section>

              <Section title="9. Perubahan Syarat">
                <p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan platform setelah perubahan berarti Anda menerima syarat yang baru.</p>
              </Section>

              <Section title="10. Hukum yang Berlaku">
                <p>Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Segala sengketa akan diselesaikan melalui musyawarah mufakat atau pengadilan yang berwenang di Indonesia.</p>
              </Section>

              <Section title="11. Kontak">
                <p>Untuk pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami melalui email: <a href={`mailto:${SITE.contact.email}`} class="text-accent hover:underline">{SITE.contact.email}</a></p>
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
      <div class="text-navy/70 text-sm leading-relaxed space-y-2">{props.children}</div>
    </div>
  );
}
