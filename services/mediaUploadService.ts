import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { createBackendServiceError, logBackendFallback, sanitizeJsonRecord } from '@/services/serviceHelpers';
import type { FoodImage } from '@/types/foodImage';
import type { Json } from '@/lib/supabase';

export type FoodImageUploadInput = {
  userId: string;
  file: Blob;
  fileName?: string;
  mimeType?: string;
  contentHash?: string;
  regionId?: string;
  foodId?: string;
  postId?: string;
  metadata?: Record<string, Json | undefined>;
};

type FoodImageUploadRow = {
  id: string;
  user_id: string;
  post_id: string | null;
  region_id: string | null;
  food_id: string | null;
  storage_bucket: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  content_hash: string | null;
  review_status: 'pending' | 'ai_labeled' | 'needs_review' | 'approved' | 'rejected';
  created_at: string;
};

const storageBucket = 'kfood-bucket';
const uploadFolder = 'food-images';
const maxImageBytes = 8 * 1024 * 1024;
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const extensionByMimeType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function sanitizeFileName(fileName?: string): string {
  const fallback = 'kfood-photo';
  const baseName = fileName?.split('/').pop()?.split('\\').pop() ?? fallback;
  const sanitized = baseName.toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-');
  return sanitized.slice(0, 80) || fallback;
}

function assertValidUpload(input: FoodImageUploadInput): string {
  const mimeType = input.mimeType ?? input.file.type;

  if (!allowedMimeTypes.has(mimeType)) {
    throw createBackendServiceError('mediaUploadService.validate', 'Only JPEG, PNG, and WebP images are allowed.');
  }

  if (input.file.size <= 0 || input.file.size > maxImageBytes) {
    throw createBackendServiceError('mediaUploadService.validate', `Image size must be between 1 byte and ${maxImageBytes} bytes.`);
  }

  if (input.contentHash && !/^[a-f0-9]{64}$/i.test(input.contentHash)) {
    throw createBackendServiceError('mediaUploadService.validate', 'Invalid image content hash.');
  }

  return mimeType;
}

function buildStoragePath(input: FoodImageUploadInput, mimeType: string): string {
  const extension = extensionByMimeType[mimeType];
  const safeName = sanitizeFileName(input.fileName).replace(/\.[a-z0-9]+$/, '');
  const idempotentPart = input.contentHash ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${input.userId}/${uploadFolder}/${idempotentPart}-${safeName}.${extension}`;
}

function mapUploadRow(row: FoodImageUploadRow): FoodImage {
  return {
    id: row.id,
    localUri: row.storage_path,
    fileName: row.original_filename ?? undefined,
    uploadedByUserId: row.user_id,
    uploadedAt: row.created_at,
    regionId: row.region_id ?? undefined,
    journalId: row.post_id ?? undefined,
    uploadStatus: row.review_status === 'pending' ? 'uploaded' : 'analyzed',
  };
}

function createMockUpload(input: FoodImageUploadInput): FoodImage {
  return {
    id: `mock-upload-${input.contentHash ?? Date.now()}`,
    localUri: input.fileName ?? 'mock-local-food-image',
    fileName: sanitizeFileName(input.fileName),
    uploadedByUserId: input.userId,
    uploadedAt: new Date().toISOString(),
    regionId: input.regionId,
    journalId: input.postId,
    uploadStatus: 'uploaded',
  };
}

export async function uploadFoodImage(input: FoodImageUploadInput): Promise<FoodImage> {
  try {
    const mimeType = assertValidUpload(input);

    if (!isSupabaseConfigured) {
      throw createBackendServiceError('mediaUploadService.uploadFoodImage', 'Supabase environment variables are not configured.');
    }

    const existing = input.contentHash
      ? await supabase.from<FoodImageUploadRow>('food_image_uploads').select('*', {
          params: {
            user_id: `eq.${input.userId}`,
            content_hash: `eq.${input.contentHash}`,
          },
          limit: 1,
        })
      : null;

    if (existing?.error) {
      throw createBackendServiceError('mediaUploadService.uploadFoodImage.lookup', existing.error.message);
    }

    if (existing?.data?.[0]) {
      return mapUploadRow(existing.data[0]);
    }

    const storagePath = buildStoragePath(input, mimeType);
    const upload = await supabase.storage.from(storageBucket).upload(storagePath, input.file, mimeType);

    if (upload.error) {
      throw createBackendServiceError('mediaUploadService.uploadFoodImage.storage', upload.error.message);
    }

    const { data, error } = await supabase.from<FoodImageUploadRow>('food_image_uploads').insert({
      user_id: input.userId,
      post_id: input.postId,
      region_id: input.regionId,
      food_id: input.foodId,
      storage_bucket: storageBucket,
      storage_path: storagePath,
      original_filename: sanitizeFileName(input.fileName),
      mime_type: mimeType,
      file_size: input.file.size,
      content_hash: input.contentHash,
      metadata: sanitizeJsonRecord(input.metadata),
    });

    if (error || !data?.[0]) {
      throw createBackendServiceError('mediaUploadService.uploadFoodImage.record', error?.message);
    }

    return mapUploadRow(data[0]);
  } catch (error) {
    logBackendFallback('mediaUploadService.uploadFoodImage', error instanceof Error ? error.message : null);
    return createMockUpload(input);
  }
}
