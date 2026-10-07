import { useEffect, useMemo, useState } from "react";
import { JoinSelect } from "./JoinControls";

const START_YEAR = 1900;
const pad = (n) => String(n).padStart(2, "0");

function daysInMonth(month, year) {
  const m = Number(month);
  const y = Number(year);
  if (!m || !y || m < 1 || m > 12) return 31;
  return new Date(y, m, 0).getDate();
}

function isValidDate(day, month, year) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y || m > 12) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function isNotFuture(day, month, year) {
  if (!isValidDate(day, month, year)) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(Number(year), Number(month) - 1, Number(day)) <= today;
}

function parseIso(value) {
  const m = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? { year: m[1], month: m[2], day: m[3] } : { year: "", month: "", day: "" };
}

/**
 * Day / Month / Year dropdowns → ISO `YYYY-MM-DD` ("" until complete and
 * valid, never in the future). Arabic shows Year → Month → Day visually.
 */
export default function JoinDobInput({ label, value, onChange, placeholders, isAr }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const parsed = parseIso(value);
    if (parsed.year) {
      setDay(parsed.day);
      setMonth(parsed.month);
      setYear(parsed.year);
    }
  }, [value]);

  const yearOptions = useMemo(() => {
    const out = [];
    for (let y = new Date().getFullYear(); y >= START_YEAR; y -= 1) {
      if (!day || !month || isNotFuture(day, month, y)) out.push({ value: String(y), label: String(y) });
    }
    return out;
  }, [day, month]);

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => i + 1)
        .filter((m) => !(year && day) || isNotFuture(day, m, year))
        .map((m) => ({ value: pad(m), label: pad(m) })),
    [day, year]
  );

  const dayOptions = useMemo(() => {
    const max = year && month ? daysInMonth(month, year) : 31;
    return Array.from({ length: max }, (_, i) => i + 1)
      .filter((d) => !(month && year) || isNotFuture(d, month, year))
      .map((d) => ({ value: pad(d), label: pad(d) }));
  }, [month, year]);

  const emit = (d, m, y) => {
    onChange(d && m && y && isNotFuture(d, m, y) ? `${y}-${m}-${d}` : "");
  };

  const segments = [
    {
      key: "day",
      placeholder: placeholders.day,
      value: day,
      options: dayOptions,
      onChange: (v) => {
        setDay(v);
        let m = month;
        let y = year;
        if (m && y && !isValidDate(v, m, y)) {
          m = "";
          y = "";
          setMonth("");
          setYear("");
        }
        emit(v, m, y);
      },
    },
    {
      key: "month",
      placeholder: placeholders.month,
      value: month,
      options: monthOptions,
      onChange: (v) => {
        setMonth(v);
        let y = year;
        if (y && day && !isValidDate(day, v, y)) {
          y = "";
          setYear("");
        }
        emit(day, v, y);
      },
    },
    {
      key: "year",
      placeholder: placeholders.year,
      value: year,
      options: yearOptions,
      onChange: (v) => {
        setYear(v);
        emit(day, month, v);
      },
    },
  ];
  const ordered = isAr ? [...segments].reverse() : segments;

  return (
    <div className="cmj-dob">
      {label ? <span className="cmj-dob__label">{label}</span> : null}
      <div className="cmj-dob__row" dir="ltr" role="group" aria-label={label}>
        {ordered.map((s) => (
          <JoinSelect
            key={s.key}
            plain
            placeholder={s.placeholder}
            value={s.value}
            options={s.options}
            onChange={s.onChange}
          />
        ))}
      </div>
    </div>
  );
}
