import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

// Campuses
export async function listCampuses() {
  return prisma.masterCampus.findMany({ where: { isActive: true }, orderBy: { nama: 'asc' } });
}
export async function createCampus(
  adminId: string,
  data: { nama: string; singkatan: string; kota: string; alamat?: string },
) {
  const c = await prisma.masterCampus.create({ data });
  await recordAudit({
    userId: adminId,
    action: 'CREATE',
    targetModel: 'MasterCampus',
    targetId: String(c.id),
  });
  return c;
}
export async function updateCampus(
  adminId: string,
  id: number,
  data: { nama: string; singkatan: string; kota: string; alamat?: string | null },
) {
  const c = await prisma.masterCampus.update({ where: { id }, data });
  await recordAudit({
    userId: adminId,
    action: 'UPDATE',
    targetModel: 'MasterCampus',
    targetId: String(id),
  });
  return c;
}
export async function deleteCampus(adminId: string, id: number) {
  await prisma.masterCampus.update({ where: { id }, data: { isActive: false } });
  await recordAudit({
    userId: adminId,
    action: 'DELETE',
    targetModel: 'MasterCampus',
    targetId: String(id),
  });
}

// Banks
export async function listBanks() {
  return prisma.masterBank.findMany({ where: { isActive: true }, orderBy: { nama: 'asc' } });
}
export async function createBank(adminId: string, data: { nama: string; kode: string }) {
  const b = await prisma.masterBank.create({ data });
  await recordAudit({
    userId: adminId,
    action: 'CREATE',
    targetModel: 'MasterBank',
    targetId: String(b.id),
  });
  return b;
}
export async function deleteBank(adminId: string, id: number) {
  await prisma.masterBank.update({ where: { id }, data: { isActive: false } });
  await recordAudit({
    userId: adminId,
    action: 'DELETE',
    targetModel: 'MasterBank',
    targetId: String(id),
  });
}

// Facilities
export async function listFacilities() {
  return prisma.masterFacility.findMany({
    where: { isActive: true },
    orderBy: [{ kategori: 'asc' }, { nama: 'asc' }],
  });
}
export async function createFacility(
  adminId: string,
  data: { nama: string; icon?: string; kategori: string },
) {
  const f = await prisma.masterFacility.create({ data });
  await recordAudit({
    userId: adminId,
    action: 'CREATE',
    targetModel: 'MasterFacility',
    targetId: String(f.id),
  });
  return f;
}
export async function deleteFacility(adminId: string, id: number) {
  await prisma.masterFacility.update({ where: { id }, data: { isActive: false } });
  await recordAudit({
    userId: adminId,
    action: 'DELETE',
    targetModel: 'MasterFacility',
    targetId: String(id),
  });
}

// FAQs
export async function listFaqs(kategori?: string) {
  return prisma.faq.findMany({
    where: { isActive: true, ...(kategori && { kategori }) },
    orderBy: [{ kategori: 'asc' }, { urutan: 'asc' }],
  });
}
export async function listAllFaqs() {
  return prisma.faq.findMany({ orderBy: [{ kategori: 'asc' }, { urutan: 'asc' }] });
}
export async function upsertFaq(
  adminId: string,
  data: { id?: number; pertanyaan: string; jawaban: string; kategori: string; urutan: number },
) {
  if (data.id) {
    const f = await prisma.faq.update({
      where: { id: data.id },
      data: {
        pertanyaan: data.pertanyaan,
        jawaban: data.jawaban,
        kategori: data.kategori,
        urutan: data.urutan,
      },
    });
    await recordAudit({
      userId: adminId,
      action: 'UPDATE',
      targetModel: 'Faq',
      targetId: String(f.id),
    });
    return f;
  }
  const f = await prisma.faq.create({
    data: {
      pertanyaan: data.pertanyaan,
      jawaban: data.jawaban,
      kategori: data.kategori,
      urutan: data.urutan,
    },
  });
  await recordAudit({
    userId: adminId,
    action: 'CREATE',
    targetModel: 'Faq',
    targetId: String(f.id),
  });
  return f;
}
export async function deleteFaq(adminId: string, id: number) {
  await prisma.faq.update({ where: { id }, data: { isActive: false } });
  await recordAudit({ userId: adminId, action: 'DELETE', targetModel: 'Faq', targetId: String(id) });
}

// CMS Banners
export async function listActiveBanners() {
  const now = new Date();
  return prisma.cmsBanner.findMany({
    where: {
      isActive: true,
      OR: [
        { mulaiAt: null, berakhirAt: null },
        { mulaiAt: { lte: now }, berakhirAt: { gte: now } },
      ],
    },
    include: { imageAsset: { select: { url: true } } },
    orderBy: { urutan: 'asc' },
  });
}
export async function listAllBanners() {
  return prisma.cmsBanner.findMany({
    include: { imageAsset: { select: { url: true } } },
    orderBy: [{ placement: 'asc' }, { urutan: 'asc' }],
  });
}

// Articles
export async function listPublishedArticles() {
  return prisma.article.findMany({
    where: { isPublished: true },
    include: {
      author: { select: { profile: { select: { namaLengkap: true } } } },
      coverAsset: { select: { url: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          profile: { select: { namaLengkap: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      coverAsset: { select: { url: true } },
    },
  });
  if (article && article.isPublished) {
    await prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } });
  }
  return article;
}
