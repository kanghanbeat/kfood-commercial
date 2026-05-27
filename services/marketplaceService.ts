import { mockMarketplaceItems } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { MarketplaceItem, ServiceResult } from '@/services/types';

export async function listMarketplaceItems(
  region?: string
): Promise<ServiceResult<MarketplaceItem[]>> {
  const items = region
    ? mockMarketplaceItems.filter((item) => item.region === region)
    : mockMarketplaceItems;

  return createServiceResult(items);
}

