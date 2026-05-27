export type FoodImageUploadStatus = 'idle' | 'uploaded' | 'analyzing' | 'analyzed' | 'failed';

export interface FoodImage {
  id: string;
  localUri: string;
  fileName?: string;
  uploadedByUserId: string;
  uploadedAt: string;
  regionId?: string;
  placeId?: string;
  journalId?: string;
  uploadStatus: FoodImageUploadStatus;
}
