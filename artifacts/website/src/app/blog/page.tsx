import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – PAYVORA | Fintech Insights for Nigeria",
  description:
    "Tips, guides, and news about fintech in Nigeria. Learn how to get the best gift card rates, use virtual cards abroad, and manage your digital wallet.",
  alternates: { canonical: "https://www.payvora.org/blog" },
};

const posts = [
  {
    slug: "best-gift-cards-to-trade-in-nigeria",
    category: "Gift Cards",
    title: "The 7 Best Gift Cards to Trade for Cash in Nigeria Right Now",
    excerpt:
      "Amazon, iTunes, Steam, Google Play — not all gift cards trade at the same rate. Here's the definitive guide to which cards give you the most Naira in 2026.",
    readTime: "5 min read",
    date: "July 4, 2026",
    featured: true,
  },
  {
    slug: "virtual-dollar-card-guide-nigeria",
    category: "Virtual Cards",
    title: "How to Use a Virtual Dollar Card in Nigeria: The Complete Guide",
    excerpt:
      "From Netflix subscriptions to Shopify payments — everything you can do with a virtual USD card and how to get one without a US bank account.",
    readTime: "7 min read",
    date: "July 1, 2026",
    featured: false,
  },
  {
    slug: "pay-electricity-bill-online-nigeria",
    category: "Bill Payments",
    title: "How to Pay Your EKEDC/IKEDC Electricity Bill Online in 60 Seconds",
    excerpt:
      "No more queues at the utility office. Here's the fastest way to top up your prepaid electricity meter from your phone.",
    readTime: "3 min read",
    date: "June 27, 2026",
    featured: false,
  },
  {
    slug: "kyc-verification-benefits-payvora",
    category: "Tips",
    title: "Why You Should Complete Your KYC Verification on PAYVORA",
    excerpt:
      "Higher daily limits, virtual card access, and faster payouts — upgrading from Tier 1 to Tier 2 takes 5 minutes and unlocks a lot.",
    readTime: "4 min read",
    date: "June 22, 2026",
    featured: false,
  },
  {
    slug: "dstv-subscription-nigeria-cheapest",
    category: "Bill Payments",
    title: "DStv vs GOtv vs Showmax: Which is Worth Paying For in 2026?",
    excerpt:
      "We break down the packages, prices, and value so you can decide which subscription fits your viewing habits — and show you how to renew in seconds.",
    readTime: "6 min read",
    date: "June 18, 2026",
    featured: false,
  },
  {
    slug: "airtime-data-bundles-nigeria",
    category: "Airtime & Data",
    title: "MTN vs Airtel vs Glo: Who Has the Best Data Deals in 2026?",
    excerpt:
      "We compared the top data bundles from all four Nigerian networks. Here's how to get the most GB for your Naira.",
    readTime: "5 min read",
    date: "June 14, 2026",
    featured: false,
  },
];

const categories = ["All", "Gift Cards", "Virtual Cards", "Bill Payments", "Airtime & Data", "Tips"];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            PAYVORA Blog
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Fintech tips for{" "}
            <span className="text-[#00D9A0]">everyday Nigerians.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto">
            Guides, insights, and news to help you get more from your money.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-[#14141F] border-y border-[#2A2A3D] sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "bg-[#00D9A0] text-[#0A0A0F]"
                    : "bg-[#1C1C2A] border border-[#2A2A3D] text-[#8F8FA3] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          <div className="mb-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="block bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-8 sm:p-10 hover:border-[#00D9A0]/40 transition-all group relative overflow-hidden"
            >
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(0,217,160,0.06)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold text-[#00D9A0] bg-[rgba(0,217,160,0.1)] px-2.5 py-1 rounded-lg">
                    {featured.category}
                  </span>
                  <span className="text-xs text-[#8F8FA3] bg-[#0A0A0F] px-2.5 py-1 rounded-lg border border-[#2A2A3D]">
                    Featured
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 group-hover:text-[#00D9A0] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[#8F8FA3] leading-relaxed mb-6 max-w-2xl">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-[#8F8FA3]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> {featured.readTime}
                    </div>
                    <span>{featured.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#00D9A0] text-sm font-semibold group-hover:gap-3 transition-all">
                    Read article <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Rest of posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map(({ slug, category, title, excerpt, readTime, date }) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="block bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-7 hover:border-[#00D9A0]/40 transition-all group"
              >
                <span className="text-xs font-bold text-[#00D9A0] bg-[rgba(0,217,160,0.1)] px-2.5 py-1 rounded-lg mb-4 inline-block">
                  {category}
                </span>
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#00D9A0] transition-colors leading-snug">
                  {title}
                </h3>
                <p className="text-[#8F8FA3] text-sm leading-relaxed mb-5">{excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-[#8F8FA3]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} /> {readTime}
                  </div>
                  <span>·</span>
                  <span>{date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#14141F] border-t border-[#2A2A3D]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Get the latest posts</h2>
          <p className="text-[#8F8FA3] mb-8">
            New guides and fintech tips every week. No spam, unsubscribe any time.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-[#1C1C2A] border border-[#2A2A3D] rounded-xl text-white text-sm placeholder:text-[#8F8FA3] focus:outline-none focus:border-[#00D9A0] transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-xl text-sm hover:bg-[#00C490] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
