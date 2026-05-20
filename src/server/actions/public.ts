import { query } from '@solidjs/router';
import {
  searchKostSchema,
  parseFormData,
  handleZodError,
} from '~/lib/shared/validation';
import {
  listPublicKost,
  getKostBySlug,
  getPopularKost,
  type KostListQuery,
} from '~/server/services/kost.service';
import {
  listActiveBanners,
  listFaqs,
  listPublishedArticles,
  getArticleBySlug,
  listCampuses,
  listFacilities,
} from '~/server/services/master.service';
import { getCurrentUserId } from '~/lib/server/session';

export const popularKostQuery = query(async () => {
  'use server';
  const result = await getPopularKost(8);
  return result.items;
}, 'popularKost');

export const kostSearchQuery = query(
  async (filter: KostListQuery) => {
    'use server';
    return listPublicKost(filter);
  },
  'kostSearch',
);

export const kostDetailQuery = query(async (slug: string) => {
  'use server';
  const userId = await getCurrentUserId();
  return getKostBySlug(slug, userId);
}, 'kostDetail');

export const heroBannersQuery = query(async () => {
  'use server';
  const banners = await listActiveBanners();
  return banners.filter((b) => b.placement === 'HERO');
}, 'heroBanners');

export const faqsQuery = query(async (kategori?: string) => {
  'use server';
  return listFaqs(kategori);
}, 'faqs');

export const articlesQuery = query(async () => {
  'use server';
  return listPublishedArticles();
}, 'articles');

export const articleDetailQuery = query(async (slug: string) => {
  'use server';
  return getArticleBySlug(slug);
}, 'articleDetail');

export const campusesQuery = query(async () => {
  'use server';
  return listCampuses();
}, 'campuses');

export const facilitiesQuery = query(async () => {
  'use server';
  return listFacilities();
}, 'facilities');
