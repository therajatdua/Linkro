import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const ownerId = request.nextUrl.searchParams.get("ownerId") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const payload = {
    ownerId,
    type: "view",
    timestamp: new Date().toISOString(),
    metadata: {
      device: userAgent,
      browser: userAgent,
      country: request.headers.get("x-vercel-ip-country") ?? "unknown",
      referrer: "Direct",
    },
  };

  const logUrl = new URL("/api/track/log", request.url);
  void fetch(logUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ ok: true });
}
