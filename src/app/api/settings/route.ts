import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth-server";
import { isUsernameAvailable, updateUsername } from "@/lib/data";

const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const { username } = (await request.json()) as { username: string };

    if (!username || !USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters and can only contain letters, numbers, _ . -" },
        { status: 400 },
      );
    }

    const available = await isUsernameAvailable(username, user.uid);
    if (!available) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    await updateUsername(user.uid, username);
    return NextResponse.json({ ok: true, username });
  } catch (err) {
    console.error("[/api/settings POST]", err);
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
