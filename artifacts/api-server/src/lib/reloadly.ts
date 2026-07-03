interface CachedToken {
  access_token: string;
  expires_at: number;
}

let tokenCache: CachedToken | null = null;

const AUDIENCES = {
  topupSandbox: "https://topups-sandbox.reloadly.com",
  topupProd: "https://topups.reloadly.com",
  esimSandbox: "https://esim-sandbox.reloadly.com",
  esimProd: "https://esim.reloadly.com",
} as const;

const API_BASES = {
  topupSandbox: "https://topups-sandbox.reloadly.com",
  topupProd: "https://topups.reloadly.com",
  esimSandbox: "https://esim-sandbox.reloadly.com",
  esimProd: "https://esim.reloadly.com",
} as const;

const AUTH_URL = "https://auth.reloadly.com/oauth/token";

function resolveConfig(): { audience: string; apiBase: string } {
  const override = process.env["RELOADLY_AUDIENCE"];
  if (override) {
    const base = process.env["RELOADLY_API_BASE"] ?? override;
    return { audience: override, apiBase: base };
  }
  const env = process.env["RELOADLY_ENV"] ?? "topup-sandbox";
  switch (env) {
    case "production":
    case "topup-prod":
      return { audience: AUDIENCES.topupProd, apiBase: API_BASES.topupProd };
    case "esim-prod":
      return { audience: AUDIENCES.esimProd, apiBase: API_BASES.esimProd };
    case "esim-sandbox":
      return { audience: AUDIENCES.esimSandbox, apiBase: API_BASES.esimSandbox };
    default:
      return { audience: AUDIENCES.topupSandbox, apiBase: API_BASES.topupSandbox };
  }
}

export const CONFIG = resolveConfig();

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires_at - 60_000) {
    return tokenCache.access_token;
  }

  const clientId = process.env["RELOADLY_CLIENT_ID"];
  const clientSecret = process.env["RELOADLY_CLIENT_SECRET"];

  if (!clientId || !clientSecret) {
    throw new Error("RELOADLY_CLIENT_ID and RELOADLY_CLIENT_SECRET must be set");
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      audience: CONFIG.audience,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reloadly auth failed [${res.status}]: ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.access_token;
}

export async function reloadlyGet(path: string, acceptVersion = "v1"): Promise<unknown> {
  const token = await getAccessToken();
  const res = await fetch(`${CONFIG.apiBase}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: `application/com.reloadly.topups-${acceptVersion}+json`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reloadly API [${res.status}] ${path}: ${text}`);
  }

  return res.json();
}

/* ── Utility Bills (electricity, cable TV, internet, betting) ─────────────
 * Utility payments use a *separate* Reloadly product with its own OAuth
 * audience/base URL — tokens issued for topups/eSIM are not valid here.
 * ──────────────────────────────────────────────────────────────────────── */

const UTILITY_AUDIENCES = {
  sandbox: "https://utilities-sandbox.reloadly.com",
  prod: "https://utilities.reloadly.com",
} as const;

function isProductionCredentials(): boolean {
  const override = process.env["RELOADLY_UTILITY_ENV"];
  if (override) return override === "production" || override === "prod";

  const env = process.env["RELOADLY_ENV"] ?? "topup-sandbox";
  return env === "production" || env.endsWith("-prod");
}

const UTILITY_CONFIG = {
  audience: isProductionCredentials() ? UTILITY_AUDIENCES.prod : UTILITY_AUDIENCES.sandbox,
  apiBase: isProductionCredentials() ? UTILITY_AUDIENCES.prod : UTILITY_AUDIENCES.sandbox,
};

export { UTILITY_CONFIG };

let utilityTokenCache: CachedToken | null = null;

async function getUtilityAccessToken(): Promise<string> {
  if (utilityTokenCache && Date.now() < utilityTokenCache.expires_at - 60_000) {
    return utilityTokenCache.access_token;
  }

  const clientId = process.env["RELOADLY_CLIENT_ID"];
  const clientSecret = process.env["RELOADLY_CLIENT_SECRET"];

  if (!clientId || !clientSecret) {
    throw new Error("RELOADLY_CLIENT_ID and RELOADLY_CLIENT_SECRET must be set");
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      audience: UTILITY_CONFIG.audience,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reloadly utility auth failed [${res.status}]: ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  utilityTokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return utilityTokenCache.access_token;
}

const UTILITY_ACCEPT_HEADER = "application/com.reloadly.utilities-v1+json";

export async function reloadlyUtilityGet(path: string): Promise<unknown> {
  const token = await getUtilityAccessToken();
  const res = await fetch(`${UTILITY_CONFIG.apiBase}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: UTILITY_ACCEPT_HEADER,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reloadly utility API [${res.status}] ${path}: ${text}`);
  }

  return res.json();
}

export async function reloadlyUtilityPost(path: string, body: unknown): Promise<unknown> {
  const token = await getUtilityAccessToken();
  const res = await fetch(`${UTILITY_CONFIG.apiBase}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: UTILITY_ACCEPT_HEADER,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : text;
    throw new Error(`Reloadly utility API [${res.status}] ${path}: ${message}`);
  }

  return data;
}
