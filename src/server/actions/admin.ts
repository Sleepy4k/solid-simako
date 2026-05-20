import { action, query, reload } from '@solidjs/router';
import type { ComplaintStatus, UserRole } from '@prisma/client';
import {
  suspendUserSchema,
  kycDecisionSchema,
  masterCampusSchema,
  masterBankSchema,
  masterFacilitySchema,
  faqSchema,
  parseFormData,
  handleZodError,
  actionOk,
} from '~/lib/shared/validation';
import { requireRole } from '~/lib/server/session';
import {
  getAdminOverview,
  listPendingKyc,
  decideKyc,
  listAllUsers,
  suspendUser,
  unsuspendUser,
  listAuditLogs,
  listAllProperties,
  listAllTransactions,
} from '~/server/services/admin.service';
import {
  listCampuses,
  createCampus,
  updateCampus,
  deleteCampus,
  listBanks,
  createBank,
  deleteBank,
  listFacilities,
  createFacility,
  deleteFacility,
  listAllFaqs,
  upsertFaq,
  deleteFaq,
  listAllBanners,
} from '~/server/services/master.service';
import {
  listAdminDisputes,
  updateComplaintStatus,
} from '~/server/services/complaint.service';

// ─── Overview ──────────────────────────────────────────────────────────────

export const adminOverviewQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return getAdminOverview();
}, 'adminOverview');

// ─── KYC ───────────────────────────────────────────────────────────────────

export const adminKycListQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listPendingKyc('MENUNGGU');
}, 'adminKycList');

export const decideKycAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(kycDecisionSchema, formData);
    await decideKyc(
      user.id,
      input.ownerProfileId,
      input.decision === 'APPROVE',
      input.catatan || undefined,
    );
    throw reload({ revalidate: adminKycListQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'decideKyc');

// ─── Users ─────────────────────────────────────────────────────────────────

export const adminUsersQuery = query(
  async (filter?: { role?: UserRole; q?: string; suspended?: boolean }) => {
    'use server';
    await requireRole('ADMIN');
    return listAllUsers(filter);
  },
  'adminUsers',
);

export const suspendUserAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(suspendUserSchema, formData);
    await suspendUser(user.id, input.userId, input.alasan);
    throw reload({ revalidate: adminUsersQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'suspendUser');

export const unsuspendUserAction = action(async (userId: string) => {
  'use server';
  const user = await requireRole('ADMIN');
  await unsuspendUser(user.id, userId);
  throw reload({ revalidate: adminUsersQuery.key });
}, 'unsuspendUser');

// ─── Properties / Transactions read-only ──────────────────────────────────

export const adminPropertiesQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listAllProperties();
}, 'adminProperties');

export const adminTransactionsQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listAllTransactions();
}, 'adminTransactions');

// ─── Disputes ──────────────────────────────────────────────────────────────

export const adminDisputesQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listAdminDisputes();
}, 'adminDisputes');

export const resolveDisputeAction = action(
  async (complaintId: string, status: ComplaintStatus, resolusi?: string) => {
    'use server';
    const user = await requireRole('ADMIN');
    await updateComplaintStatus(user.id, complaintId, status, resolusi);
    throw reload({ revalidate: adminDisputesQuery.key });
  },
  'resolveDispute',
);

// ─── Audit log ─────────────────────────────────────────────────────────────

export const adminAuditQuery = query(async (limit?: number) => {
  'use server';
  await requireRole('ADMIN');
  return listAuditLogs(limit ?? 100);
}, 'adminAudit');

// ─── Master Data ───────────────────────────────────────────────────────────

export const adminCampusesQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listCampuses();
}, 'adminCampuses');

export const adminBanksQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listBanks();
}, 'adminBanks');

export const adminFacilitiesQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listFacilities();
}, 'adminFacilities');

export const adminFaqsQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listAllFaqs();
}, 'adminFaqs');

export const adminBannersQuery = query(async () => {
  'use server';
  await requireRole('ADMIN');
  return listAllBanners();
}, 'adminBanners');

export const createCampusAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(masterCampusSchema, formData);
    await createCampus(user.id, {
      nama: input.nama,
      singkatan: input.singkatan,
      kota: input.kota,
      alamat: input.alamat || undefined,
    });
    throw reload({ revalidate: adminCampusesQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createCampus');

export const updateCampusAction = action(async (id: number, formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(masterCampusSchema, formData);
    await updateCampus(user.id, id, {
      nama: input.nama,
      singkatan: input.singkatan,
      kota: input.kota,
      alamat: input.alamat || null,
    });
    throw reload({ revalidate: adminCampusesQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'updateCampus');

export const deleteCampusAction = action(async (id: number) => {
  'use server';
  const user = await requireRole('ADMIN');
  await deleteCampus(user.id, id);
  throw reload({ revalidate: adminCampusesQuery.key });
}, 'deleteCampus');

export const createBankAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(masterBankSchema, formData);
    await createBank(user.id, input);
    throw reload({ revalidate: adminBanksQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createBank');

export const deleteBankAction = action(async (id: number) => {
  'use server';
  const user = await requireRole('ADMIN');
  await deleteBank(user.id, id);
  throw reload({ revalidate: adminBanksQuery.key });
}, 'deleteBank');

export const createFacilityAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(masterFacilitySchema, formData);
    await createFacility(user.id, {
      nama: input.nama,
      icon: input.icon || undefined,
      kategori: input.kategori,
    });
    throw reload({ revalidate: adminFacilitiesQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createFacility');

export const deleteFacilityAction = action(async (id: number) => {
  'use server';
  const user = await requireRole('ADMIN');
  await deleteFacility(user.id, id);
  throw reload({ revalidate: adminFacilitiesQuery.key });
}, 'deleteFacility');

export const upsertFaqAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('ADMIN');
    const input = parseFormData(faqSchema, formData);
    const idRaw = formData.get('id');
    await upsertFaq(user.id, {
      id: idRaw ? Number(idRaw) : undefined,
      pertanyaan: input.pertanyaan,
      jawaban: input.jawaban,
      kategori: input.kategori,
      urutan: input.urutan,
    });
    throw reload({ revalidate: adminFaqsQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'upsertFaq');

export const deleteFaqAction = action(async (id: number) => {
  'use server';
  const user = await requireRole('ADMIN');
  await deleteFaq(user.id, id);
  throw reload({ revalidate: adminFaqsQuery.key });
}, 'deleteFaq');
