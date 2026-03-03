import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const ownerId = String(formData.get("ownerId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const url = String(formData.get("url") ?? "/");

  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const referrerRaw = request.headers.get("referer") ?? "Direct";

  const referrer = /instagram/i.test(referrerRaw)
    ? "Instagram"
    : /tiktok/i.test(referrerRaw)
      ? "TikTok"
      : "Direct";

  const payload = {
    ownerId,
    linkId,
    type: "click",
    timestamp: new Date().toISOString(),
    metadata: {
      device: userAgent,
      browser: userAgent,
      country: request.headers.get("x-vercel-ip-country") ?? "unknown",
      referrer,
    },
  };

  const logUrl = new URL("/api/track/log", request.url);
  void fetch(logUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.redirect(url, { status: 302 });
}
