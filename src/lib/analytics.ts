import type { AnalyticsEvent, CreatorAnalytics, LinkDoc } from "@/lib/types";

export function calculateCreatorAnalytics(events: AnalyticsEvent[], links: LinkDoc[]): CreatorAnalytics {
  const views = events.filter((event) => event.type === "view");
  const clicks = events.filter((event) => event.type === "click");

  const uniqueVisitors = new Set(
    views
      .map((event) => event.metadata?.device)
      .filter((value): value is string => Boolean(value)),
  ).size;

  const clickMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const countryMap = new Map<string, number>();

  for (const click of clicks) {
    if (click.linkId) {
      clickMap.set(click.linkId, (clickMap.get(click.linkId) ?? 0) + 1);
    }
    const referrer = click.metadata?.referrer ?? "Direct";
    referrerMap.set(referrer, (referrerMap.get(referrer) ?? 0) + 1);
  }

  for (const view of views) {
    const country = view.metadata?.country ?? "Unknown";
    countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
  }

  // 24-hour heatmap
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const clicks24h = clicks.filter((e) => new Date(e.timestamp).getTime() > cutoff);
  const clickMap24h = new Map<string, number>();
  for (const c of clicks24h) {
    if (c.linkId) clickMap24h.set(c.linkId, (clickMap24h.get(c.linkId) ?? 0) + 1);
  }
  const max24h = Math.max(...Array.from(clickMap24h.values()), 0);

  const linkClicks = links.map((link) => ({
    linkId: link.id,
    title: link.title,
    clicks: clickMap.get(link.id) ?? 0,
  }));

  const heatmap24h = links.map((link) => ({
    linkId: link.id,
    title: link.title,
    clicks: clickMap24h.get(link.id) ?? 0,
    isHot: max24h > 0 && (clickMap24h.get(link.id) ?? 0) === max24h,
  }));

  const referrers = Array.from(referrerMap.entries()).map(([source, value]) => ({ source, value }));
  const countryBreakdown = Array.from(countryMap.entries())
    .map(([country, value]) => ({ country, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const totalViews = views.length;
  const totalClicks = clicks.length;
  const ctr = totalViews ? Number(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

  return {
    uniqueVisitors,
    totalViews,
    totalClicks,
    ctr,
    linkClicks,
    referrers,
    heatmap24h,
    countryBreakdown,
  };
}
