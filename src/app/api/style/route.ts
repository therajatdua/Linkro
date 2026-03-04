import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth-server";
import { saveStyle } from "@/lib/data";
import type { StyleSettings } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const payload = (await request.json()) as StyleSettings;

    await saveStyle(user.uid, payload);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/style POST]", err);
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
