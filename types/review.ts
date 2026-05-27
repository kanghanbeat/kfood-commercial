import type { FoodLabelEditableFields } from './foodLabel';

export type ReviewAction = 'approved' | 'edited' | 'rejected';

export interface FoodLabelReviewLog {
  id: string;
  foodLabelId: string;
  reviewerId: string;
  action: ReviewAction;
  previousData?: FoodLabelEditableFields;
  updatedData?: FoodLabelEditableFields;
  reason?: string;
  createdAt: string;
}
