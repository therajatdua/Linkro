import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth-server";
import { getLinksByUserId, replaceLinks } from "@/lib/data";
import type { LinkDoc } from "@/lib/types";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const links = await getLinksByUserId(user.uid);
    return NextResponse.json({ links });
  } catch (err) {
    console.error("[/api/links GET]", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionUser();
    const { links } = (await request.json()) as { links: LinkDoc[] };

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await replaceLinks(user.uid, links);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/links PUT]", err);
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
