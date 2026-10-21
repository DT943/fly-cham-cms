/** Save a custom promo title via LOCAL CMS only (do not touch production). */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const SUPABASE_URL = "https://xbqrfakpcisqunyugrqt.supabase.co";
const SUPABASE_KEY = "sb_publishable_DVuilPL7OZyKMZ266JYJGA_eEaVyfpL";

const auth = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@flycham.local",
    password: "FlyChamAdmin!2026",
  }),
}).then((r) => r.json());

if (!auth.access_token) {
  console.log("auth fail", auth);
  process.exit(1);
}

const get = await fetch("http://localhost:3000/api/public/get-header?lang=en").then((r) =>
  r.json(),
);
const doc = structuredClone(get.data.document);
doc.login.panelTitle = "Welcome to Cham Miles loyalty program";
const put = await fetch("http://localhost:3000/api/public/update-header", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.access_token}`,
  },
  body: JSON.stringify({ lang: "en", document: doc, version: get.data.version }),
});
const body = await put.json();
console.log(
  JSON.stringify(
    {
      status: put.status,
      version: body?.data?.version,
      panelTitle: body?.data?.document?.login?.panelTitle,
      loginKeys: Object.keys(body?.data?.document?.login || {}),
    },
    null,
    2,
  ),
);
