# Vendored Fly Cham booking box

`flycham/` is a **verbatim copy** of the booking widget from the `flychamwebsite`
Next.js app (`src/app/[pos]/[lang]/Home/booking-box-v2` and its dependency
closure). Nothing in `flychamwebsite` was modified. The directory deliberately
mirrors that app's `src/` layout so the copied files keep their original
`@/...` imports and can be re-copied without edits.

## How it is wired

| Concern | How the port handles it |
| --- | --- |
| `@/...` imports | Vite alias `@` → `src/vendor/flycham` (see `vite.config.js`) |
| `next/navigation` | Alias → `src/vendor/shims/next-navigation.jsx` (react-router-dom) |
| `https` (Node builtin) | Alias → `src/vendor/shims/node-https.js` (inert `Agent`) |
| `process.env.NEXT_PUBLIC_*` | `define` block in `vite.config.js` |
| `../../i18n` | `src/vendor/i18n.js` re-exports this app's i18next instance |
| Redux store | `flycham/store/index.js` — hand-written, `flights` slice only |
| Manage-booking tab | `booking-box-v2/components/ManageTap.jsx` — hand-written; links to flycham.com |
| Booking CSS | `src/vendor/styles/booking-box.css`, extracted from `globals.css` lines 230-722 |

Mount point: `src/shared/booking/BookingWidget.jsx` — the equivalent of
flychamwebsite's CMS `Widget2`, with the same flags
(`bookingPreviewV2`, `searchV2AirportUi`, `enableInfantsWithSeat`, round-trip
default). Search navigates to `https://flycham.com/{pos}/{lang}/search-results`
with the same encoded `token` the live site uses.

Override the target with `VITE_FLYCHAM_SITE_URL` / `VITE_FLYCHAM_POS`.

## Re-syncing after flychamwebsite changes

Everything under `flycham/` is a straight copy **except** the four hand-written
files listed above (`store/index.js`, `lib/flychamSite.js`,
`booking-box-v2/components/ManageTap.jsx`, and this README). Re-copy the changed
files from `flychamwebsite/src/` to the same relative path here, then re-run
`npm run build` — an unresolved import means a new dependency joined the closure
and needs copying too.
