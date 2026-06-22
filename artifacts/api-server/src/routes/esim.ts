import { Router, type IRouter } from "express";
import { reloadlyGet, CONFIG } from "../lib/reloadly.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

interface ReloadlyCountryField {
  isoName: string;
  name: string;
}

interface ReloadlyOperator {
  operatorId: number;
  name: string;
  bundle?: boolean;
  data?: boolean;
  denominationType?: string;
  senderCurrencyCode?: string;
  country?: ReloadlyCountryField;
  logoUrls?: string[];
  fixedAmounts?: number[];
  localFixedAmounts?: number[];
  minAmount?: number | null;
  maxAmount?: number | null;
  mostPopularAmount?: number;
  status?: string;
}

interface ReloadlyCountry {
  isoName: string;
  name: string;
}

const REGION_MAP: Record<string, string> = {
  NG: "Africa", EG: "Africa", ZA: "Africa", KE: "Africa", GH: "Africa",
  TZ: "Africa", ET: "Africa", UG: "Africa", MA: "Africa", DZ: "Africa",
  TN: "Africa", SN: "Africa", CI: "Africa", CM: "Africa", MZ: "Africa",
  ZM: "Africa", ZW: "Africa", RW: "Africa", AO: "Africa", MG: "Africa",
  BJ: "Africa", BF: "Africa", ML: "Africa", NE: "Africa", TD: "Africa",
  SD: "Africa", SO: "Africa", DJ: "Africa", ER: "Africa", LY: "Africa",
  MR: "Africa", MU: "Africa", CV: "Africa", SC: "Africa", ST: "Africa",
  GM: "Africa", GW: "Africa", SL: "Africa", LR: "Africa", GN: "Africa",
  TG: "Africa", GA: "Africa", GQ: "Africa", CG: "Africa", CD: "Africa",
  CF: "Africa", SS: "Africa", BI: "Africa", KM: "Africa", NA: "Africa",
  LS: "Africa", SZ: "Africa", MW: "Africa",
  GB: "Europe", DE: "Europe", FR: "Europe", IT: "Europe", ES: "Europe",
  NL: "Europe", BE: "Europe", SE: "Europe", NO: "Europe", DK: "Europe",
  FI: "Europe", PT: "Europe", AT: "Europe", CH: "Europe", PL: "Europe",
  CZ: "Europe", HU: "Europe", RO: "Europe", GR: "Europe", HR: "Europe",
  SK: "Europe", BG: "Europe", SI: "Europe", LT: "Europe", LV: "Europe",
  EE: "Europe", LU: "Europe", CY: "Europe", MT: "Europe", IE: "Europe",
  IS: "Europe", AL: "Europe", BA: "Europe", ME: "Europe", MK: "Europe",
  RS: "Europe", MD: "Europe", UA: "Europe", BY: "Europe", AM: "Europe",
  GE: "Europe", AZ: "Europe", RU: "Europe",
  CN: "Asia", IN: "Asia", JP: "Asia", KR: "Asia", TH: "Asia",
  SG: "Asia", MY: "Asia", PH: "Asia", ID: "Asia", VN: "Asia",
  TW: "Asia", HK: "Asia", MM: "Asia", KH: "Asia", LA: "Asia",
  BN: "Asia", BD: "Asia", LK: "Asia", NP: "Asia", PK: "Asia",
  AF: "Asia", MV: "Asia", BT: "Asia", MN: "Asia", KZ: "Asia",
  UZ: "Asia", TM: "Asia", KG: "Asia", TJ: "Asia", IL: "Asia",
  TR: "Asia", SA: "Asia", AE: "Asia", QA: "Asia", KW: "Asia",
  BH: "Asia", OM: "Asia", JO: "Asia", LB: "Asia", IQ: "Asia",
  IR: "Asia", SY: "Asia", YE: "Asia",
  US: "Americas", CA: "Americas", MX: "Americas", BR: "Americas",
  AR: "Americas", CO: "Americas", CL: "Americas", PE: "Americas",
  VE: "Americas", EC: "Americas", BO: "Americas", PY: "Americas",
  UY: "Americas", GY: "Americas", SR: "Americas", CR: "Americas",
  PA: "Americas", GT: "Americas", HN: "Americas", SV: "Americas",
  NI: "Americas", BZ: "Americas", CU: "Americas", DO: "Americas",
  HT: "Americas", JM: "Americas", TT: "Americas", BB: "Americas",
  BS: "Americas", PR: "Americas",
  AU: "Oceania", NZ: "Oceania", FJ: "Oceania", PG: "Oceania",
  SB: "Oceania", VU: "Oceania", TO: "Oceania", WS: "Oceania",
  KI: "Oceania", FM: "Oceania", MH: "Oceania", PW: "Oceania",
};

function getRegion(isoCode: string): string {
  return REGION_MAP[isoCode] ?? "Other";
}

const PLAN_COLORS = [
  "#3B82F6", "#00D9A0", "#8B5CF6", "#F59E0B",
  "#EF4444", "#06B6D4", "#EC4899", "#10B981",
];

function buildPlan(op: ReloadlyOperator, idx: number) {
  const usdPrice = op.fixedAmounts?.[0] ?? op.mostPopularAmount ?? op.minAmount ?? 0;
  const isoCode = op.country?.isoName ?? "";
  const countryName = op.country?.name ?? "";
  const region = isoCode ? getRegion(isoCode) : "Global";
  const coverage = countryName || region;

  const price = Number(usdPrice);
  const gbMap: [number, string][] = [[5, "500 MB"], [10, "1 GB"], [20, "3 GB"], [30, "5 GB"], [50, "10 GB"], [Infinity, "20 GB"]];
  const dayMap: [number, string][] = [[8, "7 days"], [18, "14 days"], [35, "30 days"], [60, "60 days"], [Infinity, "90 days"]];
  const data = gbMap.find(([t]) => price <= t)?.[1] ?? "5 GB";
  const duration = dayMap.find(([t]) => price <= t)?.[1] ?? "30 days";

  return {
    id: String(op.operatorId),
    name: op.name.replace(/\s*PIN\s*$/i, "").trim(),
    data,
    duration,
    price,
    countries: 1,
    coverage,
    color: PLAN_COLORS[idx % PLAN_COLORS.length] as string,
    popular: idx === 1,
    logoUrl: op.logoUrls?.[0] ?? null,
  };
}

router.get("/esim/plans", async (_req, res) => {
  try {
    logger.info({ audience: CONFIG.audience }, "Fetching Reloadly operators");

    const data = (await reloadlyGet("/operators?page=1&size=20")) as
      | { content?: ReloadlyOperator[] }
      | ReloadlyOperator[];

    const operators: ReloadlyOperator[] = Array.isArray(data)
      ? data
      : (data as { content?: ReloadlyOperator[] }).content ?? [];

    const active = operators.filter((op) => op.status !== "INACTIVE");
    const plans = active.slice(0, 8).map((op, idx) => buildPlan(op, idx));

    res.json({ plans, source: "reloadly", env: CONFIG.audience });
  } catch (err) {
    logger.error({ err }, "Reloadly plans fetch failed");
    res.status(502).json({ error: String(err), plans: [] });
  }
});

router.get("/esim/regions", async (_req, res) => {
  try {
    logger.info("Fetching Reloadly countries");

    const countries = (await reloadlyGet("/countries")) as ReloadlyCountry[];

    const regionCounts: Record<string, number> = {};
    for (const c of countries) {
      const region = getRegion(c.isoName ?? "");
      if (region !== "Other") {
        regionCounts[region] = (regionCounts[region] ?? 0) + 1;
      }
    }

    const regions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.json({ regions, total: countries.length });
  } catch (err) {
    logger.error({ err }, "Reloadly countries fetch failed");
    res.status(502).json({ error: String(err), regions: [] });
  }
});

export default router;
