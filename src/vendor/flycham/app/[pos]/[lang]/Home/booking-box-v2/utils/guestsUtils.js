'use client';

import { buildPassengerSummaryLabel } from '@/app/[pos]/[lang]/Home/booking-box/utils/passengerSummary';

/**
 * Build the shared "Passengers and class" summary string used
 * in both desktop and mobile booking boxes.
 */
export const buildPassengerSummary = (values = {}, guestsState = {}, copy) =>
  buildPassengerSummaryLabel({ ...values, ...(guestsState || {}) }, copy);
