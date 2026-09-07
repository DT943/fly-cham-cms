'use client'
import React from 'react';

const CustomDayContent = ({ date, activeModifiers = {} }) => {
    const {
        selected,
        range_start,
        range_end,
        range_middle,
        available,
        outside,
        firstSelectedDeparture,
        previewRangeEnd,
    } = activeModifiers;

    // fixedWeeks pad cells — keep grid height but render no dummy date/dot
    if (outside) {
        return <span aria-hidden="true" className="block w-full h-full" />;
    }

    // Range paint lives on the day cell (continuous caps). Hide the availability
    // dot on solid start/end/hover caps so it does not sit on the secondary fill.
    const isSolidCap =
        range_start ||
        range_end ||
        firstSelectedDeparture ||
        previewRangeEnd ||
        (selected && !range_middle);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-center leading-tight">
            <div className="text-[13px] leading-none">{date.getDate()}</div>
            {available && !isSolidCap && (
                <div className="booking-cal-day-dot h-1 w-1 shrink-0 rounded-full bg-secondary" />
            )}
        </div>
    );
};

export default CustomDayContent;
