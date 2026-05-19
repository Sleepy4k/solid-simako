import { createSignal } from 'solid-js';
import { Bell, Shield, Globe, Mail, Smartphone, AlertTriangle } from 'lucide-solid';
import { AdminLayout } from '~/layouts/AdminLayout';
import { SEO } from '~/components/shared/SEO';
import { Toggle } from '~/components/ui/Toggle';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { PageHeader } from '~/components/shared/PageHeader';

export default function AdminPengaturanPage() {
  const [notifKyc, setNotifKyc] = createSignal(true);
  const [notifDispute, setNotifDispute] = createSignal(true);
  const [notifLogin, setNotifLogin] = createSignal(true);
  const [notifReport, setNotifReport] = createSignal(false);
  const [maintenanceMode, setMaintenanceMode] = createSignal(false);
  const [registrasiOwner, setRegistrasiOwner] = createSignal(true);

  return (
    <AdminLayout userName="Riska Handayani">
      <SEO title="Pengaturan Admin" noIndex />

      <PageHeader title="Pengaturan Admin" description="Konfigurasi platform SIMAKO" class="mb-6" />

      <div class="max-w-2xl space-y-4">
        {/* Notifikasi Admin */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Bell class="size-4 text-primary" /> Notifikasi Admin
          </h2>
          <div class="space-y-4">
            {[
              { label: 'KYC baru masuk', desc: 'Notif saat ada pengajuan KYC owner baru', state: notifKyc, set: setNotifKyc },
              { label: 'Dispute baru', desc: 'Notif saat ada dispute yang perlu ditangani', state: notifDispute, set: setNotifDispute },
              { label: 'Login mencurigakan', desc: 'Alert saat ada percobaan login gagal berulang', state: notifLogin, set: setNotifLogin },
              { label: 'Laporan konten', desc: 'Notif saat ada listing yang dilaporkan pengguna', state: notifReport, set: setNotifReport },
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

        {/* Platform */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Globe class="size-4 text-primary" /> Konfigurasi Platform
          </h2>
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-ink">Mode Maintenance</p>
                <p class="text-xs text-slate-500">Nonaktifkan akses publik sementara untuk pemeliharaan</p>
              </div>
              <Toggle checked={maintenanceMode()} onChange={setMaintenanceMode} />
            </div>
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-ink">Pendaftaran Owner Baru</p>
                <p class="text-xs text-slate-500">Izinkan pendaftaran akun owner baru</p>
              </div>
              <Toggle checked={registrasiOwner()} onChange={setRegistrasiOwner} />
            </div>
          </div>
        </Card>

        {/* Email SMTP */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Mail class="size-4 text-primary" /> Konfigurasi Email (SMTP)
          </h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <Input label="SMTP Host" defaultValue="smtp.gmail.com" />
            <Input label="Port" defaultValue="587" />
            <Input label="Username" defaultValue="noreply@simako.id" />
            <Input label="Password" type="password" defaultValue="••••••••••••" />
            <Input label="Nama Pengirim" defaultValue="SIMAKO" wrapperClass="sm:col-span-2" />
          </div>
          <div class="mt-3 flex gap-2">
            <Button variant="secondary" size="sm">Test Koneksi</Button>
            <Button size="sm">Simpan Konfigurasi</Button>
          </div>
        </Card>

        {/* Keamanan */}
        <Card>
          <h2 class="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Shield class="size-4 text-primary" /> Keamanan
          </h2>
          <div class="space-y-3">
            <Button variant="secondary" fullWidth class="justify-start gap-2">
              <Shield class="size-4" /> Ganti Kata Sandi Admin
            </Button>
            <Button variant="secondary" fullWidth class="justify-start gap-2">
              <Smartphone class="size-4" /> Kelola Sesi Aktif
            </Button>
            <div class="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs font-medium text-ink">Batas maksimum percobaan login</p>
              <div class="mt-2 flex items-center gap-2">
                <input type="number" value={5} min={3} max={10} class="h-8 w-20 rounded-lg border border-slate-200 px-2 text-center text-sm focus:border-primary focus:outline-none" />
                <span class="text-xs text-slate-500">kali sebelum akun dikunci sementara</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <h2 class="mb-2 flex items-center gap-2 text-sm font-bold text-danger">
            <AlertTriangle class="size-4" /> Zona Berbahaya
          </h2>
          <p class="mb-3 text-xs text-slate-500">
            Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
          <div class="space-y-2">
            <Button variant="danger" size="sm">Reset Data Dummy</Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
