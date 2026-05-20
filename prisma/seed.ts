import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] mulai…');

  // 1. Roles
  const roles = [
    { name: 'PENYEWA' as const, label: 'Penyewa', description: 'Pencari kost' },
    { name: 'MITRA' as const, label: 'Mitra Owner', description: 'Pemilik kost' },
    { name: 'ADMIN' as const, label: 'Administrator', description: 'Admin platform' },
  ];
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r.name }, update: r, create: r });
  }
  const penyewaRole = await prisma.role.findUniqueOrThrow({ where: { name: 'PENYEWA' } });
  const mitraRole = await prisma.role.findUniqueOrThrow({ where: { name: 'MITRA' } });
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });

  // 2. Master campuses
  const kampus = [
    { nama: 'Institut Teknologi Telkom Purwokerto', singkatan: 'ITTP', kota: 'Purwokerto' },
    { nama: 'Universitas Jenderal Soedirman', singkatan: 'UNSOED', kota: 'Purwokerto' },
    { nama: 'Universitas Muhammadiyah Purwokerto', singkatan: 'UMP', kota: 'Purwokerto' },
    { nama: 'Universitas Negeri Yogyakarta', singkatan: 'UNY', kota: 'Yogyakarta' },
    { nama: 'Universitas Gadjah Mada', singkatan: 'UGM', kota: 'Yogyakarta' },
  ];
  for (const k of kampus) {
    const existing = await prisma.masterCampus.findFirst({ where: { singkatan: k.singkatan } });
    if (!existing) await prisma.masterCampus.create({ data: k });
  }

  // 3. Master banks
  const banks = [
    { nama: 'Bank Central Asia', kode: 'BCA' },
    { nama: 'Bank Rakyat Indonesia', kode: 'BRI' },
    { nama: 'Bank Negara Indonesia', kode: 'BNI' },
    { nama: 'Bank Mandiri', kode: 'MDR' },
    { nama: 'Bank Syariah Indonesia', kode: 'BSI' },
  ];
  for (const b of banks) {
    await prisma.masterBank.upsert({ where: { kode: b.kode }, update: b, create: b });
  }

  // 4. Master facilities
  const facilities = [
    { nama: 'WiFi', icon: 'wifi', kategori: 'Umum' },
    { nama: 'AC', icon: 'air-vent', kategori: 'Kamar' },
    { nama: 'Kasur', icon: 'bed', kategori: 'Kamar' },
    { nama: 'Kamar Mandi Dalam', icon: 'shower-head', kategori: 'Kamar' },
    { nama: 'Lemari', icon: 'archive', kategori: 'Kamar' },
    { nama: 'Meja Belajar', icon: 'desk', kategori: 'Kamar' },
    { nama: 'Parkir Motor', icon: 'parking', kategori: 'Umum' },
    { nama: 'Parkir Mobil', icon: 'car', kategori: 'Umum' },
    { nama: 'Dapur Bersama', icon: 'utensils', kategori: 'Umum' },
    { nama: 'Akses 24 Jam', icon: 'clock', kategori: 'Umum' },
    { nama: 'CCTV', icon: 'camera', kategori: 'Keamanan' },
    { nama: 'Laundry', icon: 'shirt', kategori: 'Layanan' },
  ];
  for (const f of facilities) {
    const exist = await prisma.masterFacility.findFirst({ where: { nama: f.nama } });
    if (!exist) await prisma.masterFacility.create({ data: f });
  }

  // 5. Demo accounts
  const demoPass = await hash('password123', { memoryCost: 19456, timeCost: 2, parallelism: 1 });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@simako.id' },
    update: {},
    create: {
      email: 'admin@simako.id',
      passwordHash: demoPass,
      roleId: adminRole.id,
      isVerified: true,
      profile: { create: { namaLengkap: 'Riska Handayani' } },
      settings: { create: {} },
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@simako.id' },
    update: {},
    create: {
      email: 'owner@simako.id',
      passwordHash: demoPass,
      roleId: mitraRole.id,
      isVerified: true,
      profile: { create: { namaLengkap: 'Pak Slamet Riyadi', telepon: '081288551010' } },
      ownerProfile: {
        create: {
          namaUsaha: 'Kost Pak Slamet',
          namaBank: 'BCA',
          rekeningNo: '2810447791',
          rekeningNama: 'Slamet Riyadi',
          kycStatus: 'DISETUJUI',
          kycVerifiedAt: new Date(),
        },
      },
      settings: { create: {} },
    },
  });

  const penyewa = await prisma.user.upsert({
    where: { email: 'penyewa@simako.id' },
    update: {},
    create: {
      email: 'penyewa@simako.id',
      passwordHash: demoPass,
      roleId: penyewaRole.id,
      isVerified: true,
      profile: { create: { namaLengkap: 'Dewi Ananda', telepon: '081299887766' } },
      settings: { create: {} },
    },
  });

  // 6. Demo kost
  const unsoedKampus = await prisma.masterCampus.findFirst({ where: { singkatan: 'UNSOED' } });
  const ittpKampus = await prisma.masterCampus.findFirst({ where: { singkatan: 'ITTP' } });
  const allFacilities = await prisma.masterFacility.findMany();
  const wifi = allFacilities.find((f) => f.nama === 'WiFi')!;
  const ac = allFacilities.find((f) => f.nama === 'AC')!;
  const kmDalam = allFacilities.find((f) => f.nama === 'Kamar Mandi Dalam')!;

  const kost1 = await prisma.boardingHouse.upsert({
    where: { slug: 'kost-pak-slamet-a-' + 'demo01' },
    update: {},
    create: {
      ownerId: owner.id,
      kampusId: unsoedKampus?.id,
      nama: 'Kost Pak Slamet A',
      slug: 'kost-pak-slamet-a-' + 'demo01',
      deskripsi: 'Kost putra dekat UNSOED, nyaman dan aman dengan akses 24 jam.',
      alamat: 'Jl. Soekarno Hatta No. 12, Purwokerto',
      kota: 'Purwokerto',
      jenisKelamin: 'PUTRA',
      isVerified: true,
      isPublished: true,
      facilities: { createMany: { data: [{ facilityId: wifi.id }, { facilityId: ac.id }] } },
    },
  });

  // Rooms
  await prisma.room.upsert({
    where: { boardingHouseId_nomorKamar: { boardingHouseId: kost1.id, nomorKamar: '101' } },
    update: {},
    create: {
      boardingHouseId: kost1.id,
      nomorKamar: '101',
      lantai: 1,
      hargaBulan: 650000,
      kapasitas: 1,
      status: 'TERSEDIA',
      facilities: { createMany: { data: [{ facilityId: ac.id }, { facilityId: kmDalam.id }] } },
    },
  });
  await prisma.room.upsert({
    where: { boardingHouseId_nomorKamar: { boardingHouseId: kost1.id, nomorKamar: '102' } },
    update: {},
    create: {
      boardingHouseId: kost1.id,
      nomorKamar: '102',
      lantai: 1,
      hargaBulan: 750000,
      kapasitas: 1,
      status: 'TERSEDIA',
      facilities: { createMany: { data: [{ facilityId: ac.id }, { facilityId: kmDalam.id }] } },
    },
  });

  // FAQs
  const faqs = [
    {
      pertanyaan: 'Bagaimana cara memesan kost?',
      jawaban: 'Cari kost yang sesuai, klik Ajukan Sewa, isi durasi, lalu transfer ke rekening owner.',
      kategori: 'Penyewa',
    },
    {
      pertanyaan: 'Bagaimana proses verifikasi KYC owner?',
      jawaban: 'Unggah KTP dan tunggu verifikasi 1×24 jam dari tim admin SIMAKO.',
      kategori: 'Owner',
    },
    {
      pertanyaan: 'Apakah ada biaya platform?',
      jawaban: 'SIMAKO tidak mengenakan biaya kepada penyewa. Owner membayar biaya berlangganan terpisah.',
      kategori: 'Umum',
    },
  ];
  for (const f of faqs) {
    const exist = await prisma.faq.findFirst({ where: { pertanyaan: f.pertanyaan } });
    if (!exist) await prisma.faq.create({ data: f });
  }

  console.log('[seed] selesai. Login demo:');
  console.log('  admin@simako.id / password123');
  console.log('  owner@simako.id / password123');
  console.log('  penyewa@simako.id / password123');
}

main()
  .catch((err) => {
    console.error('[seed] error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
