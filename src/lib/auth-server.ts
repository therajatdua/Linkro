import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase/admin";

export interface SessionUser {
  uid: string;
  email?: string;
  username?: string;
  admin?: boolean;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await adminAuth().verifySessionCookie(token, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      username: typeof decoded.username === "string" ? decoded.username : undefined,
      admin: Boolean(decoded.admin),
    };
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function requireAdminUser() {
  const user = await requireSessionUser();
  if (!user.admin) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
