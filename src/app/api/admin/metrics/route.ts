import { NextResponse } from "next/server";

import { requireAdminUser, requireSessionUser } from "@/lib/auth-server";
import { getAdminMetrics, replaceLinks, saveProfile } from "@/lib/data";
import type { LinkDoc, TemplateType, UserProfile } from "@/lib/types";

export async function GET() {
  try {
    await requireAdminUser();
    const metrics = await getAdminMetrics();
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const payload = (await request.json()) as UserProfile & { templateId: TemplateType };

    await saveProfile(user.uid, {
      profile: {
        name: payload.name,
        bio: payload.bio,
        avatar: payload.avatar,
      },
      templateId: payload.templateId,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireSessionUser();
    const { links } = (await request.json()) as { links: LinkDoc[] };

    await replaceLinks(user.uid, links);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
