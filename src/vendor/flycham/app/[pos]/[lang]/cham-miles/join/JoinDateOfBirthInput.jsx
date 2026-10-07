"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDropdown from "@/components/Ui/TitleDropdown";
import {
  daysInMonth,
  formatIsoDate,
  isValidCalendarDate,
  parseIsoDate,
} from "@/app/[pos]/[lang]/search-results/utils/passengerDobBounds";
import { useChamMilesLang } from "../shared/ChamMilesContent";

const START_YEAR = 1900;

function buildYearList() {
  const endYear = new Date().getFullYear();
  const years = [];
  for (let y = endYear; y >= START_YEAR; y -= 1) {
    years.push(y);
  }
  return years;
}

function isNotFutureDate(day, month, year) {
  if (!isValidCalendarDate(day, month, year)) return false;
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return dob <= today;
}

function DobSegmentDropdown({
  placeholder,
  selected,
  options,
  error,
  onChange,
}) {
  const hasSelection = Boolean(selected);

  return (
    <div className="min-w-0 flex-1">
      <div
        className={[
          "rounded-md bg-(--cm-surface) cm-join-dob__seg",
          "[&_button]:h-12 [&_button]:min-h-[3rem] [&_button]:flex [&_button]:items-center",
          "md:[&_button]:h-14 md:[&_button]:min-h-[3.5rem]",
          "[&_button]:rounded-md [&_button]:px-3 [&_button]:!pt-0 [&_button]:!pb-0",
          "[&_button_span]:text-sm [&_button_span]:leading-normal",
          hasSelection ? "[&_button_span]:text-(--cm-form-text)" : "[&_button_span]:text-gray-500",
          error ? "[&_button]:border [&_button]:border-alert" : "",
        ].join(" ")}
      >
        <CustomDropdown
          selected={selected || ""}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          error={error}
        />
      </div>
    </div>
  );
}

/**
 * Cham Miles join DOB — Day / Month / Year dropdowns (same pattern as
 * search-results PassengerDateOfBirthInput). Emits ISO `YYYY-MM-DD`.
 * Years are calendar-bounded (1900–today), not passenger-type age rules.
 */
export default function JoinDateOfBirthInput({
  value,
  onChange,
  error,
  label,
  onBlurValidate,
}) {
  const { t } = useTranslation();
  const { isAr } = useChamMilesLang();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const parsed = parseIsoDate(value);
    setDay(parsed.day || "");
    setMonth(parsed.month || "");
    setYear(parsed.year || "");
  }, [value]);

  const yearOptions = useMemo(() => {
    const all = buildYearList();
    const filtered =
      day && month
        ? all.filter((y) => isNotFutureDate(day, month, y))
        : all;
    return filtered.map((y) => ({
      value: String(y),
      label: String(y),
    }));
  }, [day, month]);

  const monthOptions = useMemo(() => {
    const months = year && day
      ? Array.from({ length: 12 }, (_, i) => i + 1).filter((m) =>
          isNotFutureDate(day, m, year),
        )
      : Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map((m) => ({
      value: String(m).padStart(2, "0"),
      label: String(m).padStart(2, "0"),
    }));
  }, [day, year]);

  const dayOptions = useMemo(() => {
    const max =
      year && month ? daysInMonth(month, year) : 31;
    const days = Array.from({ length: max }, (_, i) => i + 1).filter((d) => {
      if (!month || !year) return true;
      return isNotFutureDate(d, month, year);
    });
    return days.map((d) => ({
      value: String(d).padStart(2, "0"),
      label: String(d).padStart(2, "0"),
    }));
  }, [month, year]);

  const emitChange = (nextDay, nextMonth, nextYear) => {
    if (!nextDay || !nextMonth || !nextYear) {
      onChange("");
      return;
    }
    if (!isNotFutureDate(nextDay, nextMonth, nextYear)) {
      onChange("");
      return;
    }
    const iso = formatIsoDate(nextDay, nextMonth, nextYear);
    onChange(iso || "");
  };

  const touchIfComplete = (nextDay, nextMonth, nextYear) => {
    if (nextDay && nextMonth && nextYear) {
      onBlurValidate?.();
    }
  };

  const handleDayChange = (val) => {
    setDay(val);
    if (!val) {
      setMonth("");
      setYear("");
      onChange("");
      return;
    }
    let nextMonth = month;
    let nextYear = year;
    if (month && year && !isValidCalendarDate(val, month, year)) {
      nextMonth = "";
      nextYear = "";
      setMonth("");
      setYear("");
    }
    emitChange(val, nextMonth, nextYear);
  };

  const handleMonthChange = (val) => {
    setMonth(val);
    if (!val) {
      setYear("");
      onChange("");
      return;
    }
    let nextYear = year;
    if (year && day && !isValidCalendarDate(day, val, year)) {
      nextYear = "";
      setYear("");
    }
    emitChange(day, val, nextYear);
  };

  const handleYearChange = (val) => {
    setYear(val);
    emitChange(day, month, val);
    touchIfComplete(day, month, val);
  };

  const dayLabel = t("searchResults.passengerForm.dobDay");
  const monthLabel = t("searchResults.passengerForm.dobMonth");
  const yearLabel = t("searchResults.passengerForm.dobYear");

  return (
    <div className="relative w-full">
      {label ? (
        <span
          className={`cm-join-dob__label mb-1.5 block text-sm ${error ? "text-alert" : "text-(--cm-form-text)"}`}
        >
          {label}
        </span>
      ) : null}
      {/* English: Day → Month → Year. Arabic: reverse visually (Year → Month → Day). */}
      <div
        dir="ltr"
        className={`flex w-full gap-2 sm:gap-3${isAr ? " flex-row-reverse" : ""}`}
        role="group"
        aria-label={label}
      >
        <DobSegmentDropdown
          placeholder={dayLabel}
          selected={day}
          options={dayOptions}
          error={error}
          onChange={handleDayChange}
        />
        <DobSegmentDropdown
          placeholder={monthLabel}
          selected={month}
          options={monthOptions}
          error={error}
          onChange={handleMonthChange}
        />
        <DobSegmentDropdown
          placeholder={yearLabel}
          selected={year}
          options={yearOptions}
          error={error}
          onChange={handleYearChange}
        />
      </div>
    </div>
  );
}
