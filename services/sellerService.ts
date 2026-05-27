import { mockSellerOnboardingStatus } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { SellerOnboardingStatus, ServiceResult } from '@/services/types';

export async function getSellerOnboardingStatus(
  sellerId: string
): Promise<ServiceResult<SellerOnboardingStatus>> {
  return createServiceResult({
    ...mockSellerOnboardingStatus,
    sellerId,
  });
}

