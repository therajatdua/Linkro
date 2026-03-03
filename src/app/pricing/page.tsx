import Link from "next/link";
import { ArrowRight, Check, Link2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect to build your first creator page.",
    cta: "Get started free",
    href: "/sign-in",
    featured: false,
    features: [
      { label: "5 links", included: true },
      { label: "Basic analytics (30 days)", included: true },
      { label: "1 template", included: true },
      { label: "Linkro subdomain", included: true },
      { label: "Custom domain", included: false },
      { label: "AI bio generator", included: false },
      { label: "Advanced analytics", included: false },
      { label: "Email capture", included: false },
      { label: "Digital storefront", included: false },
      { label: "Affiliate link tracking", included: false },
      { label: "API access", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For serious creators building a real audience.",
    cta: "Start 14-day trial",
    href: "/sign-in",
    featured: true,
    badge: "Most popular",
    features: [
      { label: "Unlimited links", included: true },
      { label: "Full analytics (1 year)", included: true },
      { label: "All templates", included: true },
      { label: "Custom domain", included: true },
      { label: "AI bio generator", included: true },
      { label: "Advanced analytics + exports", included: true },
      { label: "Email capture (500 subs)", included: true },
      { label: "Digital storefront", included: false },
      { label: "Affiliate link tracking", included: false },
      { label: "API access", included: false },
      { label: "Priority support", included: true },
      { label: "Remove Linkro branding", included: true },
    ],
  },
  {
    id: "creator-os",
    name: "Creator OS",
    price: "$29",
    period: "/month",
    desc: "Full monetization stack for ambitious creators.",
    cta: "Start free trial",
    href: "/sign-in",
    featured: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited analytics history", included: true },
      { label: "Email capture (10,000 subs)", included: true },
      { label: "Digital storefront", included: true },
      { label: "Affiliate link tracking", included: true },
      { label: "Media kit PDF generator", included: true },
      { label: "API access", included: true },
      { label: "Auto DMs (coming soon)", included: true },
      { label: "Brand deal CRM", included: true },
      { label: "White-label option", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "SLA support", included: true },
    ],
  },
];

const comparison = [
  { feature: "Links", free: "5", pro: "Unlimited", os: "Unlimited" },
  { feature: "Custom domain", free: "—", pro: "✓", os: "✓" },
  { feature: "Analytics history", free: "30 days", pro: "1 year", os: "Unlimited" },
  { feature: "Templates", free: "1", pro: "All", os: "All" },
  { feature: "AI bio generator", free: "—", pro: "✓", os: "✓" },
  { feature: "Email capture", free: "—", pro: "500 subs", os: "10,000 subs" },
  { feature: "Digital storefront", free: "—", pro: "—", os: "✓" },
  { feature: "Affiliate tracking", free: "—", pro: "—", os: "✓" },
  { feature: "API access", free: "—", pro: "—", os: "✓" },
  { feature: "Linkro branding", free: "Yes", pro: "Removed", os: "Removed" },
  { feature: "Support", free: "Community", pro: "Priority", os: "Dedicated" },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080810] text-white">
      {/* Ambient */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[140px]" />

      {/* Navbar */}
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">linkro</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <Link href="/sign-in" className="transition-colors hover:text-white">Sign in</Link>
          <Link href="/sign-in" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-100">
            Get started
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">Pricing</p>
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Simple pricing.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Real value.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
          Start for free. No credit card required. Upgrade as your audience grows.
        </p>
      </section>

      {/* Tier cards */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.featured
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-indigo-500/5 shadow-xl shadow-violet-500/10"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-500 px-4 py-1 text-xs font-bold shadow-lg shadow-violet-500/30">
                  {tier.badge}
                </div>
              )}
              <div>
                <p className="text-lg font-bold">{tier.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{tier.desc}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-5xl font-extrabold">{tier.price}</span>
                  <span className="mb-1 text-zinc-400">{tier.period}</span>
                </div>
              </div>

              <Button
                asChild
                className={`mt-8 w-full rounded-full ${
                  tier.featured
                    ? "border-0 bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90"
                    : "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                }`}
                variant={tier.featured ? "default" : "outline"}
              >
                <Link href={tier.href}>
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <ul className="mt-8 flex-1 space-y-3.5">
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-zinc-600" />
                    )}
                    <span className={f.included ? "text-zinc-200" : "text-zinc-600"}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative mx-auto max-w-5xl px-6 pb-28">
        <h2 className="mb-10 text-center text-3xl font-bold">Full comparison</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                <th className="p-5 text-left font-semibold text-zinc-300">Feature</th>
                <th className="p-5 text-center font-semibold text-zinc-300">Free</th>
                <th className="p-5 text-center font-semibold text-violet-300">Pro</th>
                <th className="p-5 text-center font-semibold text-cyan-300">Creator OS</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-zinc-800/60 ${i % 2 === 0 ? "bg-zinc-900/20" : "bg-zinc-900/40"}`}
                >
                  <td className="p-5 text-zinc-400">{row.feature}</td>
                  <td className="p-5 text-center text-zinc-500">{row.free}</td>
                  <td className="p-5 text-center text-zinc-200">{row.pro}</td>
                  <td className="p-5 text-center text-zinc-200">{row.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-28">
        <h2 className="mb-10 text-center text-3xl font-bold">Frequently asked</h2>
        <div className="space-y-4">
          {[
            { q: "Can I upgrade or downgrade anytime?", a: "Yes. Plan changes take effect immediately. Downgrades are prorated." },
            { q: "Is there a free trial for paid plans?", a: "Pro comes with a 14-day free trial. Creator OS comes with a 7-day trial. No credit card required." },
            { q: "What payment methods do you accept?", a: "Stripe powers our payments — Visa, Mastercard, American Express, UPI (coming soon), and more." },
            { q: "Can I use my own domain on Free?", a: "Custom domains are a Pro and Creator OS feature. On Free, your page lives at linkro.app/username." },
            { q: "What is Creator OS?", a: "Creator OS is a full monetization stack — think digital store, email list, affiliate links, and brand deal CRM in one place." },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="font-semibold">{q}</p>
              <p className="mt-2 text-sm text-zinc-400">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-cyan-600/10 p-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(139,92,246,0.15),_transparent_70%)]" />
          <h2 className="relative text-4xl font-bold">Ready to grow your creator presence?</h2>
          <p className="relative mt-4 text-zinc-300">Start free. No credit card. Your page goes live in minutes.</p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full border-0 bg-white px-10 font-semibold text-black hover:bg-zinc-100"
            >
              <Link href="/sign-in">
                Create your page free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Link2 className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-zinc-200">linkro</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
            <Link href="/sign-in" className="transition-colors hover:text-zinc-300">Sign in</Link>
            <Link href="/sign-in" className="transition-colors hover:text-zinc-300">Sign up</Link>
          </div>
          <p>© 2026 Linkro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
