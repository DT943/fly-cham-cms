import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

/** Floating-label text input (flychamwebsite components/Ui/Input look). */
export function JoinInput({ id, label, value, onChange, type = "text", ...props }) {
  return (
    <div className="cmj-field">
      <input
        id={id}
        name={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        className="cmj-input"
        {...props}
      />
      <label htmlFor={id} className="cmj-label">
        {label}
      </label>
    </div>
  );
}

/**
 * Dropdown with a floating label (title / country code) or a centred
 * placeholder (`plain`, the date-of-birth segments). `searchable` adds a
 * filter box (country code). Menu renders in-flow under the field.
 */
export function JoinSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  plain = false,
  searchable = false,
  wide = false,
  searchPlaceholder,
  noMatchesText,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const selectedLabel = selected ? selected.displayLabel ?? selected.label : "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      [o.label, o.displayLabel, o.labelAr, o.value]
        .filter(Boolean)
        .some((text) => String(text).toLowerCase().includes(q))
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return undefined;
    // ownerDocument: the admin device preview renders inside an iframe.
    const doc = rootRef.current?.ownerDocument || document;
    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    doc.addEventListener("pointerdown", onDown);
    doc.addEventListener("keydown", onKey);
    if (searchable) searchRef.current?.focus();
    return () => {
      doc.removeEventListener("pointerdown", onDown);
      doc.removeEventListener("keydown", onKey);
    };
  }, [open, searchable]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const choose = (next) => {
    onChange(next);
    setOpen(false);
  };

  const className = [
    "cmj-select",
    plain ? "cmj-select--plain" : "",
    wide ? "cmj-select--wide" : "",
    open ? "cmj-select--open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={className}>
      <button
        type="button"
        className="cmj-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label || placeholder}
        onClick={() => setOpen((v) => !v)}
      >
        {plain ? (
          <span className={selected ? "cmj-select__value" : "cmj-select__value cmj-select__placeholder"}>
            {selected ? selectedLabel : placeholder}
          </span>
        ) : (
          <span className="cmj-select__value">{selectedLabel}</span>
        )}
      </button>
      {!plain && label ? (
        <span className={`cmj-label${selected || open ? " cmj-label--float" : ""}`}>{label}</span>
      ) : null}
      <CaretDownIcon size={14} weight="bold" className="cmj-select__caret" aria-hidden />

      {open ? (
        <div className="cmj-select__menu">
          {searchable ? (
            <input
              ref={searchRef}
              type="text"
              className="cmj-select__search"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (filtered[0]) choose(filtered[0].value);
                }
              }}
            />
          ) : null}
          <ul id={listId} role="listbox" className="cmj-select__list">
            {filtered.length ? (
              filtered.map((option) => (
                <li key={`${option.value}-${option.label}`} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    className={`cmj-select__option${
                      option.value === value ? " cmj-select__option--selected" : ""
                    }`}
                    onClick={() => choose(option.value)}
                  >
                    {option.displayLabel ?? option.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="cmj-select__empty">{noMatchesText}</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Square checkbox with a rich label (flychamwebsite CustomCheckbox look). */
export function JoinCheckbox({ checked, onChange, children }) {
  return (
    <label className={`cmj-check${checked ? " cmj-check--checked" : ""}`}>
      <input
        type="checkbox"
        className="cmj-check__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="cmj-check__box" aria-hidden="true">
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </span>
      <span className="cmj-check__text">{children}</span>
    </label>
  );
}
