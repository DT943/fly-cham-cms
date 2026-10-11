'use client'
import { useState } from "react";

const FloatingInput = ({
  name,
  label,
  hint,
  icon,
  value,
  onChange,
  onBlur,
  touched,
  error,
  isRtl = false,
}) => {
  const [focused, setFocused] = useState(false);
  const float = focused || String(value || "").length > 0;
  const hasError = !!(touched && error);

  return (
    <div className="relative flex-1 min-w-[260px]" dir={isRtl ? "rtl" : "ltr"}>
      <div className={`relative rounded-xl px-4 py-6 h-[104px] flex items-center bg-100 ${
        hasError ? "border-2 border-alert" : "border border-transparent"
      }`}>
        {/* icon — inline-start (right in Arabic) */}
        <div
          aria-hidden
          className={`absolute start-4 transition-all duration-200 ${
            hasError ? "text-alert" : "text-400"
          } ${float ? "top-5 translate-y-0" : "top-1/2 -translate-y-1/2"}`}
        >
          {icon}
        </div>

        {/* floating label */}
        <label
          htmlFor={name}
          className={`absolute start-10 transition-all duration-200 select-none text-start ${
            float ? "top-5 text-[14px]" : "top-1/2 -translate-y-1/2 text-[16px]"
          } ${hasError ? "text-alert" : "text-600"}`}
        >
          {label}
        </label>

        {/* Latin PNR / last name stay LTR; padding matches icon side */}
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => { setFocused(false); }}
          onFocus={() => setFocused(true)}
          aria-invalid={hasError}
          dir="ltr"
          className={`w-full bg-transparent outline-none pt-4 text-[14px] text-black ${
            isRtl ? "pe-10 text-end" : "ps-10 text-start"
          }`}
          autoComplete="off"
        />

        {!float && hint ? (
          <span className="absolute start-10 bottom-2 text-[12px] text-400">
            {hint}
          </span>
        ) : null}
      </div>

      {hasError ? (
        <div className="mt-2 text-[12px] text-alert text-start">{error}</div>
      ) : null}
    </div>
  );
};
export default FloatingInput;
