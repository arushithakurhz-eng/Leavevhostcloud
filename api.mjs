import { json } from "@netlify/functions";

const BASE = "https://client.falixnodes.net/api/v2";
const headers = { "content-type": "application/json" };

function reply(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

export default async (request) => {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/api\/?/, "").replace(/^\/api\/?/, "");
  const appPassword = process.env.LEAVEHOST_ACCESS_PASSWORD;
  const apiKey = process.env.FALIX_API_KEY;

  if (request.method === "POST" && path === "login") {
    if (!appPassword) return reply(500, { error: "Set LEAVEHOST_ACCESS_PASSWORD in Netlify environment variables." });
    let body = {};
    try { body = await request.json(); } catch {}
    if (body.password !== appPassword) return reply(401, { error: "Incorrect panel password." });
    return reply(200, { ok: true });
  }

  if (!appPassword || !apiKey) {
    return reply(503, { error: "Panel is not configured. Add FALIX_API_KEY and LEAVEHOST_ACCESS_PASSWORD in Netlify environment variables." });
  }

  if (request.headers.get("x-panel-password") !== appPassword) {
    return reply(401, { error: "Please unlock the panel again." });
  }

  if (path === "health") return reply(200, { ok: true, provider: "Falix API v2" });

  // Only expose the small, intentional set of Falix operations used by this panel.
  const allowed = [
    ["GET", /^me$/, () => "/me"],
    ["GET", /^servers$/, () => "/servers?limit=100"],
    ["GET", /^servers\/(\d+)$/, m => `/servers/${m[1]}`],
    ["GET", /^servers\/(\d+)\/status$/, m => `/servers/${m[1]}/console/status`],
    ["GET", /^servers\/(\d+)\/log$/, m => `/servers/${m[1]}/console/log`],
    ["POST", /^servers\/(\d+)\/power$/, m => `/servers/${m[1]}/power`],
    ["POST", /^servers\/(\d+)\/commands$/, m => `/servers/${m[1]}/commands`]
  ];
  const route = allowed.find(([method, re]) => method === request.method && re.test(path));
  if (!route) return reply(404, { error: "Unknown panel endpoint." });

  const match = path.match(route[1]);
  const target = route[2](match);
  let body;
  if (request.method !== "GET") {
    try { body = await request.json(); } catch { return reply(400, { error: "Invalid JSON body." }); }
  }

  try {
    const upstream = await fetch(`${BASE}${target}`, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(20000)
    });
    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { error: { message: raw || "Falix returned an empty response." } }; }
    return reply(upstream.status, data);
  } catch (error) {
    return reply(502, { error: `Falix API request failed: ${error.message}` });
  }
};