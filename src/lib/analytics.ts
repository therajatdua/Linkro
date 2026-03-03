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

  for (const click of clicks) {
    if (click.linkId) {
      clickMap.set(click.linkId, (clickMap.get(click.linkId) ?? 0) + 1);
    }

    const referrer = click.metadata?.referrer ?? "Direct";
    referrerMap.set(referrer, (referrerMap.get(referrer) ?? 0) + 1);
  }

  const linkClicks = links.map((link) => ({
    linkId: link.id,
    title: link.title,
    clicks: clickMap.get(link.id) ?? 0,
  }));

  const referrers = Array.from(referrerMap.entries()).map(([source, value]) => ({ source, value }));
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
  };
}
