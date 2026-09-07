'use client'
import React, { useMemo } from 'react';
import { addMonths } from 'date-fns';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { formatCalendarCaption } from '@/util/calendarI18n';

/**
 * Prev/next arrows + month titles on one row (titles align with the chevrons).
 * DayPicker’s own captions are hidden on desktop so they don’t sit below this bar.
 */
const MonthNavigation = ({
  currentMonth,
  minMonth,
  handleMonthChange,
  monthsPerPage = 1,
  visibleMonths = 2,
}) => {
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const PrevIcon = isRtl ? CaretRight : CaretLeft;
  const NextIcon = isRtl ? CaretLeft : CaretRight;

  const viewMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const prevMonth = addMonths(viewMonth, -monthsPerPage);
  const nextMonth = addMonths(viewMonth, monthsPerPage);
  const minAllowedMonth = new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);

  const isPrevDisabled = prevMonth < minAllowedMonth;

  const monthLabels = useMemo(() => {
    const count = Math.max(1, Number(visibleMonths) || 1);
    return Array.from({ length: count }, (_, i) =>
      formatCalendarCaption(addMonths(viewMonth, i), isRtl ? 'ar' : 'en'),
    );
  }, [viewMonth, visibleMonths, isRtl]);

  const prevButtonClass = `absolute start-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 z-20 group ${
    isPrevDisabled
      ? 'bg-100/50 cursor-not-allowed '
      : 'bg-white cursor-pointer border-1 border-gray-200 hover:bg-100 '
  }`;

  const nextButtonClass =
    'absolute end-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white hover:bg-100 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 border-1 border-gray-200 group';

  return (
    <div className="relative flex w-full items-center px-9 min-h-8">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleMonthChange(prevMonth);
        }}
        disabled={isPrevDisabled}
        className={prevButtonClass}
        aria-label="Previous month"
      >
        <PrevIcon size={14} weight="bold" className={isPrevDisabled ? 'text-gray-400' : 'text-gray-700 transition-colors'} />
      </button>

      <div
        className="grid w-full min-w-0 items-center gap-6"
        style={{ gridTemplateColumns: `repeat(${monthLabels.length}, minmax(0, 1fr))` }}
      >
        {monthLabels.map((label) => (
          <p
            key={label}
            className="text-center text-base sm:text-lg font-semibold text-black truncate"
          >
            {label}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleMonthChange(nextMonth);
        }}
        className={nextButtonClass}
        aria-label="Next month"
      >
        <NextIcon size={14} weight="bold" className="text-gray-700 transition-colors" />
      </button>
    </div>
  );
};

export default MonthNavigation;
