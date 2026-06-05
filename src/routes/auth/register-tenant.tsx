import { Title, Meta } from "@solidjs/meta";
import { RegisterTenantForm } from "~/features/auth/RegisterTenantForm";
import { SITE } from "~/config/site";

export default function RegisterTenantPage() {
  return (
    <>
      <Title>Daftar sebagai Pemilik Kos - {SITE.name}</Title>
      <Meta name="description" content="Daftarkan kos Anda di SimaKos. Kelola kamar, verifikasi pembayaran, dan raih penyewa lebih mudah." />
      <Meta name="robots" content="noindex, nofollow" />
      <RegisterTenantForm />
    </>
  );
}
