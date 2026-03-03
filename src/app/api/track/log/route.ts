import { NextResponse } from "next/server";

import { logAnalyticsEvent } from "@/lib/data";
import type { AnalyticsEvent } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AnalyticsEvent;
    await logAnalyticsEvent(payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
