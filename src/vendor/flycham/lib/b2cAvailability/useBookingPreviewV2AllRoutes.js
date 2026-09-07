'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchB2cAllRoutes } from '@/lib/b2cAvailability/b2cAvailabilityApi';

/**
 * Loads the full B2C route matrix once for booking-box destination filtering.
 */
export function useBookingPreviewV2AllRoutes(enabled) {
  const { lang = 'en' } = useParams();
  const query = useQuery({
    queryKey: ['b2c-all-routes', lang],
    queryFn: () => fetchB2cAllRoutes(lang),
    enabled: Boolean(enabled),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    /** `null` while loading — booking box keeps legacy filter off until routes are ready. */
    routeRows: query.isFetched
      ? Array.isArray(query.data)
        ? query.data
        : []
      : null,
    isRoutesLoading: query.isLoading,
    isRoutesError: query.isError,
    refetchRoutes: query.refetch,
  };
}
