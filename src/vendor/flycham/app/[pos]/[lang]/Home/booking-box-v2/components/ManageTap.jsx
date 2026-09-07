'use client';
/**
 * Port-only replacement for flychamwebsite's `ManageTap`.
 *
 * The real component retrieves a PNR through the manage-booking B2C stack
 * (manageSliceV2 + manageBookingFlowSlice + ~40 `lib/manageBookingB2c/*` modules)
 * and then routes into `/manage-booking`, a page this app does not have. Rather
 * than vendor that whole subsystem for a tab the marketing site cannot complete,
 * the Manage tab hands the traveller over to flycham.com.
 *
 * Copy comes from the same `BookingBoxContent` dictionary as the real tab, so it
 * stays in sync with en/ar.
 */
import React from 'react';
import { Ticket } from '@phosphor-icons/react';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { FLYCHAM_SITE_URL, useFlyChamLocalePrefix } from '@/lib/flychamSite';

const ManageTap = () => {
  const copy = useBookingBoxContentOptional();
  const manageCopy = copy.manage;
  const localePrefix = useFlyChamLocalePrefix();

  return (
    <div className="flex flex-col items-start gap-4 py-6">
      <h3 className="text-lg font-semibold text-main">
        {manageCopy.findBookingTitle}
      </h3>

      <a
        href={`${FLYCHAM_SITE_URL}${localePrefix}/manage-booking`}
        className="inline-flex items-center gap-[10px] h-[56px] px-8 rounded-[8px] bg-[#BAA981] text-btn text-sm font-bold transition hover:bg-[#a89773]"
      >
        <Ticket size={20} weight="regular" className="flex-shrink-0" />
        {manageCopy.search}
      </a>
    </div>
  );
};

export default ManageTap;
