'use client';

import { CircleNotch } from '@phosphor-icons/react';

/**
 * Inline loading indicator for buttons — matches the Remove-seat spinner style.
 */
export default function ButtonSpinner({ size = 20, className = '' }) {
    return (
        <CircleNotch
            size={size}
            weight="regular"
            className={`animate-spin shrink-0 ${className}`.trim()}
            aria-hidden
        />
    );
}
