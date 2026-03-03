import Link from "next/link";
import { ArrowRight, BarChart3, Check, Globe, Link2, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080810] text-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-700/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-700/12 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-700/10 blur-[120px]" />

      {/* Navbar */}
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">linkro</span>
        </div>
        <div className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
          <Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link>
          <Link href="/sign-in" className="transition-colors hover:text-white">Sign in</Link>
          <Link href="/sign-in" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-100">
            Get started
          </Link>
        </div>
        <div className="sm:hidden">
          <Link href="/sign-in" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black">
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered · Built for growth
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
          Smart bio pages{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            for serious creators.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Not just a link. A complete creator presence — real-time analytics, beautiful templates,
          and monetization tools that actually move the needle.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full border-0 bg-gradient-to-r from-violet-500 to-indigo-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
          >
            <Link href="/sign-in">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full border border-zinc-700 px-8 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800">
          <StatPill label="Creators" value="12.4K+" />
          <StatPill label="Monthly clicks" value="1.8M" />
          <StatPill label="Avg CTR lift" value="+27%" highlight />
        </div>
      </section>

      {/* ── Demo preview ── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">Your Creator Hub</p>
            <h2 className="mb-6 text-4xl font-bold leading-tight">
              Everything your audience needs.<br />In one place.
            </h2>
            <div className="space-y-5">
              {[
                { icon: Link2, title: "Unlimited smart links", desc: "Add links, reorder them, and style each one with icon, color, and label." },
                { icon: BarChart3, title: "Real-time analytics", desc: "See who's clicking, where they're from, and which links convert best." },
                { icon: Sparkles, title: "AI bio generator", desc: "One click to generate a magnetic creator bio from your profile." },
                { icon: Globe, title: "Custom domain", desc: "Point your own domain at your Linkro page on Pro plans." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-0.5 text-sm text-zinc-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="relative w-[280px]">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-700/80 bg-zinc-900 p-5 shadow-2xl shadow-black/60">
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-zinc-700" />
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 ring-4 ring-violet-500/20" />
                  <div className="text-center">
                    <p className="font-bold">@mira.creates</p>
                    <p className="mt-0.5 text-xs text-zinc-400">Designer + educator helping creators scale</p>
                  </div>
                  <div className="mt-2 w-full space-y-2.5">
                    {[
                      { emoji: "🎥", label: "YouTube Channel" },
                      { emoji: "📸", label: "Instagram Reels" },
                      { emoji: "🧠", label: "Course Waitlist" },
                      { emoji: "🛍️", label: "Shop Collection" },
                    ].map(({ emoji, label }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-zinc-700/50"
                      >
                        {emoji} {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Analytics section ── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-10 lg:p-16">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">Analytics</p>
              <h2 className="mb-4 text-4xl font-bold leading-tight">
                Analytics that actually tell you something.
              </h2>
              <p className="mb-8 text-zinc-400">
                Track clicks, views, referrers, and CTR over time. Know exactly which link earns its spot on your page.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <AnalyticsCard label="Total Views" value="12.4K" trend="+18%" />
                <AnalyticsCard label="Total Clicks" value="3.1K" trend="+32%" />
                <AnalyticsCard label="CTR" value="25.0%" trend="+4.2pp" />
                <AnalyticsCard label="Top Source" value="Instagram" trend="#1" />
              </div>
            </div>
            <div className="hidden flex-col justify-end gap-4 border-l border-zinc-800 p-10 lg:flex">
              <p className="text-sm font-medium text-zinc-400">Link Performance — Last 7 days</p>
              <div className="space-y-3">
                {[
                  { label: "YouTube Channel", pct: 78, clicks: 1240 },
                  { label: "Course Waitlist", pct: 58, clicks: 920 },
                  { label: "Instagram Reels", pct: 43, clicks: 680 },
                  { label: "Shop Collection", pct: 28, clicks: 420 },
                ].map(({ label, pct, clicks }) => (
                  <div key={label}>
                    <div className="mb-1.5 flex justify-between text-xs text-zinc-400">
                      <span>{label}</span>
                      <span>{clicks} clicks</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Templates ── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-400">Templates</p>
          <h2 className="text-4xl font-bold">Three looks. Zero compromises.</h2>
          <p className="mt-3 text-zinc-400">Choose a template that matches your brand. Customize every color, font, and shape.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <TemplateCard
            name="Minimal"
            desc="Clean white space. Pure focus on your links."
            gradient="from-zinc-800 to-zinc-900"
            accentClass="bg-zinc-500"
          />
          <TemplateCard
            name="Bold"
            desc="Big typography. Strong personality."
            gradient="from-violet-900/80 to-indigo-900/80"
            accentClass="bg-violet-500"
            featured
          />
          <TemplateCard
            name="Creator OS"
            desc="Dark mode dashboard energy."
            gradient="from-slate-900 to-zinc-900"
            accentClass="bg-cyan-500"
          />
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold">Built different.</h2>
          <p className="mt-3 text-zinc-400">Everything a creator needs. Nothing they don&apos;t.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Sparkles, title: "AI Bio Generator", desc: "One click to generate a high-converting creator bio from your profile data.", color: "text-fuchsia-400 bg-fuchsia-500/10" },
            { icon: BarChart3, title: "Deep Analytics", desc: "Click heatmaps, referrer tracking, device breakdown, and hourly graphs.", color: "text-cyan-400 bg-cyan-500/10" },
            { icon: Users, title: "Creator Profiles", desc: "Fully personalized pages with drag-and-drop link management.", color: "text-violet-400 bg-violet-500/10" },
            { icon: Globe, title: "Custom Domain", desc: "Point your own domain at your Linkro page — included in Pro.", color: "text-emerald-400 bg-emerald-500/10" },
            { icon: ShieldCheck, title: "Admin Command Center", desc: "Platform-level metrics, user management, and MRR tracking.", color: "text-rose-400 bg-rose-500/10" },
            { icon: Zap, title: "Edge Performance", desc: "ISR + edge-cached pages for sub-50ms load times globally.", color: "text-amber-400 bg-amber-500/10" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mb-2 font-semibold">{title}</p>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">Pricing</p>
          <h2 className="text-4xl font-bold">Free forever. Upgrade when ready.</h2>
          <p className="mt-3 text-zinc-400">No credit card required to start. Scale when you grow.</p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <PricingCard
            tier="Free"
            price="$0"
            desc="Perfect to get started"
            features={["5 links", "Basic analytics", "1 template", "Linkro subdomain"]}
            cta="Get started"
            href="/sign-in"
          />
          <PricingCard
            tier="Pro"
            price="$12"
            desc="For serious creators"
            features={["Unlimited links", "Full analytics + history", "All templates", "Custom domain", "AI bio generator", "Priority support"]}
            cta="Start Pro trial"
            href="/pricing"
            featured
          />
        </div>
        <div className="mt-8 text-center">
          <Link href="/pricing" className="text-sm text-zinc-500 transition-colors hover:text-white">
            Compare all plans including Creator OS →
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-cyan-600/10 p-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(139,92,246,0.15),_transparent_70%)]" />
          <h2 className="relative text-4xl font-bold">Start building your creator presence.</h2>
          <p className="relative mt-4 text-zinc-300">Join 12,400+ creators who chose smarter bio pages.</p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full border-0 bg-white px-10 font-semibold text-black hover:bg-zinc-100"
            >
              <Link href="/sign-in">
                Create your page — it&apos;s free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Link2 className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-zinc-200">linkro</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="transition-colors hover:text-zinc-300">Pricing</Link>
            <Link href="/sign-in" className="transition-colors hover:text-zinc-300">Sign in</Link>
            <Link href="/sign-in" className="transition-colors hover:text-zinc-300">Sign up</Link>
          </div>
          <p>© 2026 Linkro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function StatPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-zinc-900 px-6 py-4 text-center">
      <p className={`text-2xl font-bold ${highlight ? "text-emerald-400" : ""}`}>{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function AnalyticsCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      <p className={`mt-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-zinc-400"}`}>{trend}</p>
    </div>
  );
}

function TemplateCard({
  name,
  desc,
  gradient,
  accentClass,
  featured,
}: {
  name: string;
  desc: string;
  gradient: string;
  accentClass: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-b ${gradient} ${
        featured ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-zinc-800"
      }`}
    >
      {featured && (
        <div className="absolute right-4 top-4 rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold">
          Popular
        </div>
      )}
      <div className="mb-4 h-36 overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
          <div className={`h-10 w-10 rounded-full ${accentClass}`} />
          <div className="h-2 w-24 rounded-full bg-white/20" />
          <div className="h-1.5 w-16 rounded-full bg-white/10" />
          <div className="mt-2 w-full space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 rounded-lg border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
      <p className="font-bold">{name}</p>
      <p className="mt-1 text-sm text-zinc-400">{desc}</p>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  desc,
  features,
  cta,
  href,
  featured,
}: {
  tier: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-8 ${
        featured
          ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-indigo-500/5 shadow-lg shadow-violet-500/10"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      {featured && (
        <div className="mb-4 inline-block rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold">
          Most popular
        </div>
      )}
      <p className="text-xl font-bold">{tier}</p>
      <p className="mt-1 text-sm text-zinc-400">{desc}</p>
      <p className="mt-4 text-4xl font-extrabold">
        {price}
        <span className="text-base font-normal text-zinc-400">/mo</span>
      </p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        asChild
        className={`mt-8 w-full rounded-full ${
          featured
            ? "border-0 bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90"
            : "border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
        }`}
        variant={featured ? "default" : "outline"}
      >
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
