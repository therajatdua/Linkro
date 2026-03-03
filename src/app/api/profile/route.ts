import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth-server";
import { saveProfile } from "@/lib/data";
import type { TemplateType, UserProfile } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const payload = (await request.json()) as UserProfile & { templateId: TemplateType };

    await saveProfile(user.uid, {
      profile: {
        name: payload.name,
        bio: payload.bio,
        avatar: payload.avatar ?? "",
      },
      templateId: payload.templateId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/profile POST]", err);
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
