import type { FoodLabelRouteStatus } from '@/types/foodLabel';

export function routeFoodImageLabel(confidenceScore: number): FoodLabelRouteStatus {
  if (confidenceScore >= 0.9) {
    return 'auto_approved_candidate';
  }

  if (confidenceScore >= 0.6) {
    return 'needs_admin_review';
  }

  return 'rejected_candidate';
}
