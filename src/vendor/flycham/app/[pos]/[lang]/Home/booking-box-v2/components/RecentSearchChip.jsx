'use client';

import React, { useCallback, useMemo, useTransition } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowRight, ArrowsLeftRight, Trash, User } from '@phosphor-icons/react';
import { formatDateReadbleCompact } from '@/util/formatDateReadble';
import { buildSearchResultsHref } from '@/util/recentSearchNavigation';
import { isSearchDateUpcoming } from '@/util/recentSearchStorage';
import { getRecentSearchCityLabel } from '@/util/getRecentSearchCityLabel';
import useIsArabic from '@/hooks/useIsArabic';
import { useRecentSearchesSync } from '../hooks/useRecentSearchesSync';

function getTotalPax(data) {
  return (Number(data.adults) || 1) + (Number(data.children) || 0) + (Number(data.infants) || 0);
}

export default function RecentSearchChip() {
  const isArabic = useIsArabic();
  const { lang: langParam } = useParams() || {};
  const dateLocale = isArabic ? 'ar' : 'en';
  const languageCode = String(langParam || (isArabic ? 'ar' : 'en')).toLowerCase();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { searches, removeAt } = useRecentSearchesSync();
  const airportItems = useSelector((s) => s.flights?.airPorts?.items) ?? [];

  const ordered = useMemo(
    () =>
      searches
        .map((data, storageIndex) => ({ data, storageIndex }))
        .filter(({ data }) => {
          if (!data.origin_id || !data.destination_id || !data.date) return false;
          if (!formatDateReadbleCompact(data.date, dateLocale)) return false;
          return isSearchDateUpcoming(data);
        })
        .reverse(),
    [searches, dateLocale],
  );

  const handleSelect = useCallback(
    (data) => {
      const href = buildSearchResultsHref(pathname, data);
      if (!href) return;
      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router, startTransition],
  );

  if (!ordered.length) return null;

  const title = isArabic ? 'عمليات البحث الأخيرة' : 'Recent searches';

  return (
    <div className="mt-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <p className="mb-2 text-xs md:text-sm font-semibold text-600">{title}</p>
      <div className="flex flex-wrap gap-2">
        {ordered.map(({ data, storageIndex }, i) => {
          const originCity = getRecentSearchCityLabel(
            airportItems,
            data.origin_id,
            languageCode,
            data.origin_city,
          );
          const destinationCity = getRecentSearchCityLabel(
            airportItems,
            data.destination_id,
            languageCode,
            data.destination_city,
          );
          const depLabel = formatDateReadbleCompact(data.date, dateLocale);

          const retLabel =
            data.flighttype === 'Return' && data.date_return
              ? formatDateReadbleCompact(data.date_return, dateLocale)
              : null;
          const dateText = retLabel ? `${depLabel} - ${retLabel}` : depLabel;
          const totalPax = getTotalPax(data);

          const handleDismiss = (e) => {
            e.stopPropagation();
            removeAt(storageIndex);
          };

          return (
            <div
              key={`${data.origin_id}-${data.destination_id}-${data.date}-${data.savedAt ?? i}`}
              className="inline-flex max-w-full items-center gap-1"
            >
              <button
                type="button"
                onClick={() => handleSelect(data)}
                className="group inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-primary-1/35 bg-white px-4 py-2 text-left text-xs md:text-sm font-medium text-primary-1 shadow-sm transition-colors hover:!border-[var(--primary-1)] hover:!bg-[var(--primary-1)] hover:!text-white"
              >
                <span className="flex min-w-0 flex-wrap items-center gap-1">
                  <span className="truncate">{originCity}</span>
                  {data.flighttype === 'Return' ? (
                    <ArrowsLeftRight
                      size={12}
                      weight="bold"
                      className="shrink-0 text-inherit"
                      aria-hidden
                    />
                  ) : (
                    <ArrowRight
                      size={12}
                      weight="bold"
                      className="shrink-0 text-inherit"
                      aria-hidden
                    />
                  )}
                  <span className="truncate">{destinationCity}</span>
                </span>
                <span className="shrink-0 text-primary-1/50 group-hover:!text-white/80" aria-hidden>
                  |
                </span>
                <span className="shrink-0 whitespace-nowrap">{dateText}</span>
                <span className="shrink-0 text-primary-1/50 group-hover:!text-white/80" aria-hidden>
                  |
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5">
                  <User size={12} className="shrink-0 text-inherit" weight="bold" aria-hidden />
                  {totalPax}
                </span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="shrink-0 rounded-full p-1 text-alert  "
                aria-label={isArabic ? 'إزالة من السجل' : 'Remove from recent searches'}
              >
                <Trash size={18} weight="bold" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
