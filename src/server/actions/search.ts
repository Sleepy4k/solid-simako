import { searchSchema } from "~/lib/shared/validation";
import { searchRooms, searchPreview } from "./rooms";
import type { SearchParams, SearchPreviewItem } from "~/types";

export async function searchAction(formData: FormData) {
  "use server";
  const raw    = Object.fromEntries(formData);
  const parsed = searchSchema.safeParse(raw);
  if (!parsed.success) return { error: "Parameter pencarian tidak valid", data: null };
  const result = await searchRooms(parsed.data as SearchParams);
  return { error: null, data: result };
}

export async function liveSearchAction(q: string): Promise<SearchPreviewItem[]> {
  "use server";
  if (!q || q.trim().length < 2) return [];
  return searchPreview(q.trim());
}

export { searchRooms, searchPreview };
