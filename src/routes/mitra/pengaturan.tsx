import { createSignal } from 'solid-js';
import { Bell, Shield, Smartphone } from 'lucide-solid';
import { MitraLayout } from '~/layouts/MitraLayout';
import { SEO } from '~/components/shared/SEO';
import { Toggle } from '~/components/ui/Toggle';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { PageHeader } from '~/components/shared/PageHeader';

export default function PengaturanMitraPage() {
  const [notifEmail, setNotifEmail] = createSignal(true);
  const [notifWa, setNotifWa] = createSignal(true);
  const [notifBooking, setNotifBooking] = createSignal(true);
  const [notifTagihan, setNotifTagihan] = createSignal(true);
  const [notifKeluhan, setNotifKeluhan] = createSignal(false);

  return (
    <MitraLayout userName="Pak Slamet" propertiCount={3}>
      <SEO title="Pengaturan" noIndex />

      <PageHeader title="Pengaturan" description="Konfigurasi notifikasi dan keamanan akun" class="mb-6" />

      <div class="max-w-xl space-y-4">
        {/* Notifikasi */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Bell class="size-4 text-primary" /> Notifikasi
          </h2>
          <div class="space-y-4">
            {[
              { label: 'Email notifikasi', desc: 'Terima update via email', state: notifEmail, set: setNotifEmail },
              { label: 'WhatsApp notifikasi', desc: 'Terima pesan di WA (pastikan nomor aktif)', state: notifWa, set: setNotifWa },
              { label: 'Booking & verifikasi', desc: 'Notif saat ada booking/pembayaran masuk', state: notifBooking, set: setNotifBooking },
              { label: 'Pengingat tagihan', desc: 'Reminder H-3 sebelum jatuh tempo', state: notifTagihan, set: setNotifTagihan },
              { label: 'Keluhan penyewa', desc: 'Notif saat ada keluhan baru', state: notifKeluhan, set: setNotifKeluhan },
            ].map((item) => (
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-ink">{item.label}</p>
                  <p class="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle checked={item.state()} onChange={item.set} />
              </div>
            ))}
          </div>
        </Card>

        {/* Keamanan */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Shield class="size-4 text-primary" /> Keamanan
          </h2>
          <div class="space-y-3">
            <Button variant="secondary" fullWidth class="justify-start gap-2">
              <Shield class="size-4" /> Ganti kata sandi
            </Button>
            <Button variant="secondary" fullWidth class="justify-start gap-2">
              <Smartphone class="size-4" /> Aktifkan verifikasi 2 langkah
            </Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <h2 class="mb-2 text-sm font-bold text-danger">Zona Berbahaya</h2>
          <p class="mb-3 text-xs text-slate-500">
            Hapus akun akan menghapus semua data properti dan tidak bisa dipulihkan.
          </p>
          <Button variant="danger" size="sm">Hapus Akun</Button>
        </Card>
      </div>
    </MitraLayout>
  );
}
