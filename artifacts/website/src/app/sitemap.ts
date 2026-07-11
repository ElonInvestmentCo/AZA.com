import type { MetadataRoute } from "next";

const BASE = "https://www.payvora.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Core
    { url: `${BASE}/`,              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    // Products
    { url: `${BASE}/virtual-cards`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gift-cards`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/bill-payments`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/airtime-data`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Company
    { url: `${BASE}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/careers`,       lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/security`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`,          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    // Support
    { url: `${BASE}/faq`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/download`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Legal — indexed for Google verification
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/terms`,          lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/cookie-policy`,  lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
