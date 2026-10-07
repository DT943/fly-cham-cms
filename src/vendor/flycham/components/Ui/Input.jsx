'use client';
import React from 'react';

const Input = ({
  id = 'floating-input',
  type = 'text',
  label = 'Input',
  placeholder = ' ',
  value,
  onChange,
  name,
  className = '',
  error,
  rows,
  transparentBg = false,
  ...props
}) => {
  const hasError = Boolean(error);
  const isTextarea = rows !== undefined;
  
  // Use #F5F5F4 background color with 60% opacity and backdrop blur for contact-us page, otherwise use bg-100
  const bgClass = transparentBg ? 'bg-[#F5F5F4]/60 backdrop-blur-sm' : 'bg-100';
  
  // Inline style for backdrop blur and background color when transparentBg is true
  const inputStyle = transparentBg ? {
    backgroundColor: 'rgba(245, 245, 244, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  } : {};

  const inputClasses = `peer block w-full ${bgClass} rounded-md px-3 sm:px-4 pt-6 pb-2 text-xs sm:text-sm placeholder-transparent focus:outline-none focus:ring-0
    ${hasError
      ? 'border border-alert text-alert focus:!border-alert'
      : 'border-gray-300 text-gray-600 focus:!border-[var(--primary-1)]'}
    ${isTextarea ? '' : 'h-14 md:h-auto'}
    ${className}`;

  const labelClasses = `absolute top-0 start-0 px-4 pt-[18px] text-sm pointer-events-none transition duration-100 ease-in-out origin-[0_0]  w-full 
    overflow-hidden text-ellipsis whitespace-nowrap
    peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:scale-90 peer-focus:-translate-y-2
    peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-2
    ${hasError ? 'text-alert' : 'text-gray-600'}
    peer-focus:text-[var(--primary-1)]
    peer-focus:text-xs peer-not-placeholder-shown:text-xs
    peer-not-placeholder-shown:text-[var(--primary-1)]`;

  if (isTextarea) {
    const wrapperClasses = `relative w-full ${bgClass} rounded-md
      ${hasError
        ? 'border border-alert'
        : 'border-gray-300 focus-within:!border-[var(--primary-1)]'}`;

    return (
      <div className={wrapperClasses} style={inputStyle}>
        <label
          htmlFor={id}
          className={`block px-3 sm:px-4 pt-3 pb-1 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none transition duration-100 ease-in-out origin-[0_0]
            ${value ? 'scale-90 -translate-y-1 text-xs text-[var(--primary-1)]' : ''}
            ${hasError ? 'text-alert' : 'text-gray-600'}
          `}
        >
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          aria-invalid={hasError}
          className={`block w-full px-3 sm:px-4 pb-2 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-0 resize-vertical
            ${hasError ? 'text-alert' : 'text-gray-600'}
            ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full ">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={hasError}
        className={inputClasses}
        style={inputStyle}
        {...props}
      />
      <label
        htmlFor={id}
        className={labelClasses}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
