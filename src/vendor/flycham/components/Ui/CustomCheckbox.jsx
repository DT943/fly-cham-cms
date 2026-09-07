'use client'
import React from 'react';

const CustomCheckbox = ({
    checked,
    onChange,
    label,
    error,
    disabled = false,
    labelColor = "#1A1A1A",
    fontWeight = "font-medium",
}) => {

    return (

        <label
            className={`flex items-start gap-3 select-none ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
            aria-disabled={disabled || undefined}
        >
            {/* Checkbox box */}
            <div
                className={`flex shrink-0 justify-center items-center w-5 h-5 p-[2px] rounded-[4px] box-border
                ${checked ? 'bg-primary-1' : 'bg-white'} 
                ${Boolean(error) ? 'border border-alert' : 'border border-[#B0B0AE]'}`}
            >
                {checked && (
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>

            {/* Hidden checkbox input */}
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => {
                    if (disabled) return;
                    onChange?.(e);
                }}
                className="hidden"
            />

            {/* Label text */}
            <span className={`flex-1 min-w-0 text-sm sm:text-base leading-snug text-800 ${fontWeight}`}>
                {label}
            </span>
        </label>
    );
}

export default CustomCheckbox;
