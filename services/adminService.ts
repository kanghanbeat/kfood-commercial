import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockAdminDashboardSummary } from '@/services/mockData';
import { createServiceResult } from '@/services/serviceHelpers';
import type { AdminDashboardSummary, ServiceResult } from '@/services/types';

type PostModerationRow = {
  id: string;
  status: 'draft' | 'published' | 'hidden' | 'deleted';
};

function warnAndFallback(message: string, error?: string | null): void {
  console.warn(`[Supabase Admin] ${message}${error ? ` ${error}` : ''}`);
}

export async function getAdminDashboardSummary(): Promise<
  ServiceResult<AdminDashboardSummary>
> {
  if (!isSupabaseConfigured) {
    warnAndFallback('Missing environment variables. Returning mock admin summary.');
    return createServiceResult(mockAdminDashboardSummary);
  }

  const hiddenPosts = await supabase.from<PostModerationRow>('posts').select('id,status', {
    params: {
      status: 'eq.hidden',
    },
  });

  if (hiddenPosts.error) {
    warnAndFallback('Admin summary query failed. Returning mock admin summary.', hiddenPosts.error.message);
    return createServiceResult(mockAdminDashboardSummary, hiddenPosts.error.message);
  }

  return createServiceResult(
    {
      pendingSellerCount: mockAdminDashboardSummary.pendingSellerCount,
      reportedPostCount: hiddenPosts.data?.length ?? 0,
      activeMarketplaceItemCount: mockAdminDashboardSummary.activeMarketplaceItemCount,
    },
    null,
    'supabase-ready',
  );
}
