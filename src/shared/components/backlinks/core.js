/**
 * Public (new_fly_cham) backlinks core — the render half of the cms2 shared
 * backlinks kit, with no CMS/inspector dependencies. The CMS already stores a
 * normalized `links` array on the block content; here we only need to turn that
 * array + a piece of copy into text/link segments.
 *
 * Mirrors `flychamadmin/src/cms2/cmsComponents/shared/backlinks/core/{model,build}.js`.
 */

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeOccurrence(value) {
  if (value === "all") return "all";

  if (Array.isArray(value)) {
    const indexes = [
      ...new Set(
        value
          .map((entry) => Number(entry))
          .filter((index) => Number.isFinite(index) && index >= 1)
          .map((index) => Math.floor(index))
      ),
    ].sort((a, b) => a - b);
    return indexes.length ? indexes : [1];
  }

  if (value === "first" || value === undefined || value === null || value === "") {
    return [1];
  }

  const index = Number(value);
  if (Number.isFinite(index) && index >= 1) return [Math.floor(index)];
  return [1];
}

export function occurrenceIncludes(occurrence, seenIndex) {
  if (occurrence === "all") return true;
  if (Array.isArray(occurrence)) return occurrence.includes(seenIndex);
  return seenIndex === occurrence;
}

/**
 * Whole-phrase match (case-insensitive). "available" will not match inside
 * "availability". Returns the matched source slice so display casing is kept.
 */
export function findNextPhraseMatch(source = "", phrase = "", fromIndex = 0) {
  const text = String(source || "");
  const needle = String(phrase || "");
  if (!text || !needle || fromIndex >= text.length) return null;

  try {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`,
      "giu"
    );
    pattern.lastIndex = Math.max(0, fromIndex);
    const match = pattern.exec(text);
    if (!match) return null;
    return { index: match.index, value: match[0] };
  } catch {
    const lowerText = text.toLowerCase();
    const lowerNeedle = needle.toLowerCase();
    let index = lowerText.indexOf(lowerNeedle, fromIndex);
    while (index >= 0) {
      const before = index === 0 ? "" : text[index - 1];
      const afterIndex = index + needle.length;
      const after = afterIndex >= text.length ? "" : text[afterIndex];
      const beforeOk = !before || !/[\p{L}\p{N}]/u.test(before);
      const afterOk = !after || !/[\p{L}\p{N}]/u.test(after);
      if (beforeOk && afterOk) {
        return { index, value: text.slice(index, index + needle.length) };
      }
      index = lowerText.indexOf(lowerNeedle, index + 1);
    }
    return null;
  }
}

const EXTERNAL_HREF = /^(https?:|mailto:|tel:)/i;

/**
 * Lean normalize for links coming from the API. The CMS already validated them;
 * here we only drop empties and infer type from the href.
 */
export function normalizeApiLinks(links = []) {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => {
      const text = String(link?.text || "").trim();
      const href = String(link?.href || "").trim();
      const type =
        link?.type === "external" || EXTERNAL_HREF.test(href)
          ? "external"
          : "internal";
      return { text, href, type, occurrence: link?.occurrence };
    })
    .filter((link) => link.text && link.href);
}

function linkStateKey(link) {
  const occurrence = normalizeOccurrence(link.occurrence);
  const occurrenceKey = Array.isArray(occurrence)
    ? occurrence.join(",")
    : String(occurrence);
  return `${String(link.text || "").toLowerCase()}\0${link.href}\0${occurrenceKey}\0${link.type}`;
}

function applyLinkToParts(parts, link, state) {
  const occurrence = normalizeOccurrence(link.occurrence);
  const key = linkStateKey(link);
  let seen = state?.get(key) || 0;
  const next = [];

  for (const part of parts) {
    if (part.type !== "text") {
      next.push(part);
      continue;
    }

    const value = part.value;
    let cursor = 0;
    let match = findNextPhraseMatch(value, link.text, cursor);

    if (!match) {
      next.push(part);
      continue;
    }

    while (match) {
      if (match.index > cursor) {
        next.push({ type: "text", value: value.slice(cursor, match.index) });
      }

      seen += 1;
      const shouldLink = occurrenceIncludes(occurrence, seen);

      if (shouldLink) {
        next.push({
          type: "link",
          value: match.value,
          href: link.href,
          linkType: link.type,
        });
      } else {
        next.push({ type: "text", value: match.value });
      }

      cursor = match.index + match.value.length;
      match = findNextPhraseMatch(value, link.text, cursor);
    }

    if (cursor < value.length) {
      next.push({ type: "text", value: value.slice(cursor) });
    }
  }

  state?.set(key, seen);
  return next;
}

/**
 * Split plain text into text/link segments for the chosen phrases.
 * Longer phrases win first.
 */
export function buildLinkedTextParts(text, links = [], { state } = {}) {
  const source = String(text || "");
  const entries = normalizeApiLinks(links).sort(
    (a, b) => b.text.length - a.text.length
  );

  if (!source || !entries.length) {
    return source ? [{ type: "text", value: source }] : [];
  }

  let parts = [{ type: "text", value: source }];
  const localState = state || new Map();

  for (const link of entries) {
    parts = applyLinkToParts(parts, link, localState);
  }

  return parts;
}
