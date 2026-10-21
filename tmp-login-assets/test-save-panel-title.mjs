process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const SUPABASE_URL = "https://xbqrfakpcisqunyugrqt.supabase.co";
const SUPABASE_KEY = "sb_publishable_DVuilPL7OZyKMZ266JYJGA_eEaVyfpL";
const email = "admin@flycham.local";
const password = "FlyChamAdmin!2026";

async function main() {
  const auth = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());
  if (!auth.access_token) {
    console.log("auth fail", auth);
    return;
  }
  console.log("authed");

  const get = await fetch("http://localhost:3000/api/public/get-header?lang=en").then((r) =>
    r.json(),
  );
  const doc = structuredClone(get.data.document);
  const version = get.data.version;
  const marker = `CUSTOM TITLE ${Date.now()}`;
  doc.login.panelTitle = marker;
  console.log("saving via LOCAL", marker, "v", version);

  const putRes = await fetch("http://localhost:3000/api/public/update-header", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.access_token}`,
    },
    body: JSON.stringify({ lang: "en", document: doc, version }),
  });
  const putBody = await putRes.json();
  console.log("local put", putRes.status, "title=", putBody?.data?.document?.login?.panelTitle);
  if (putBody.error) console.log("err", JSON.stringify(putBody.error).slice(0, 400));

  const get2 = await fetch("http://localhost:3000/api/public/get-header?lang=en").then((r) =>
    r.json(),
  );
  console.log("local get title=", get2?.data?.document?.login?.panelTitle, "v=", get2?.data?.version);

  // Save same doc through PRODUCTION (old schema) — this is what resets the UI
  const getP = await fetch(
    "https://cms-api.cms-flycham.alpatrose.com/api/public/get-header?lang=en",
  ).then((r) => r.json());
  const docP = structuredClone(get2.data.document);
  docP.login.panelTitle = `SHOULD_STRIP ${Date.now()}`;
  const putP = await fetch(
    "https://cms-api.cms-flycham.alpatrose.com/api/public/update-header",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
      body: JSON.stringify({ lang: "en", document: docP, version: getP.data.version }),
    },
  );
  const putPB = await putP.json();
  console.log(
    "prod put",
    putP.status,
    "keys=",
    Object.keys(putPB?.data?.document?.login || {}),
    "title=",
    putPB?.data?.document?.login?.panelTitle,
  );
  if (putPB.error) console.log("prod err", JSON.stringify(putPB.error).slice(0, 400));

  const get3 = await fetch("http://localhost:3000/api/public/get-header?lang=en").then((r) =>
    r.json(),
  );
  console.log(
    "after prod save, local title=",
    get3?.data?.document?.login?.panelTitle,
    "v=",
    get3?.data?.version,
  );
}

main().catch((e) => console.error(e));
