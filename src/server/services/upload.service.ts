import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { AssetCategory } from '@prisma/client';
import { nanoid } from 'nanoid';
import { prisma } from '~/server/db';
import { serverEnv } from '~/config/env';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

const MIME_BY_CATEGORY: Record<AssetCategory, RegExp> = {
  AVATAR: /^image\//,
  KTP: /^image\//,
  FOTO_KOST: /^image\//,
  FOTO_KAMAR: /^image\//,
  BUKTI_BAYAR: /^image\/|^application\/pdf$/,
  BANNER: /^image\//,
  LAINNYA: /.*/,
};

export interface UploadedAsset {
  id: string;
  url: string;
}

export async function saveAsset(
  file: File,
  category: AssetCategory,
  uploadedBy?: string,
): Promise<UploadedAsset> {
  const maxBytes = serverEnv.UPLOAD_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Ukuran file maks ${serverEnv.UPLOAD_MAX_MB}MB`);
  }
  if (!MIME_BY_CATEGORY[category].test(file.type)) {
    throw new Error(`Format file tidak didukung untuk kategori ${category}`);
  }

  const ext = file.name.split('.').pop() ?? 'bin';
  const safeName = `${Date.now()}-${nanoid(8)}.${ext}`;
  const subDir = category.toLowerCase();
  const targetDir = join(UPLOAD_DIR, subDir);
  await mkdir(targetDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fullPath = join(targetDir, safeName);
  await writeFile(fullPath, buffer);

  const relPath = `/uploads/${subDir}/${safeName}`;
  const asset = await prisma.asset.create({
    data: {
      category,
      originalName: file.name,
      storagePath: fullPath,
      mimeType: file.type,
      sizeBytes: file.size,
      url: relPath,
      uploadedBy: uploadedBy ?? null,
    },
  });
  return { id: asset.id, url: asset.url };
}
