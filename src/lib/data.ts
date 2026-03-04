import { Timestamp } from "firebase-admin/firestore";

import { calculateCreatorAnalytics } from "@/lib/analytics";
import { adminDb } from "@/lib/firebase/admin";
import type { AdminMetrics, AnalyticsEvent, LinkDoc, UserDoc } from "@/lib/types";
import { stripe } from "@/lib/stripe";

const demoUser: UserDoc = {
  uid: "demo-user-id",
  username: "demo",
  email: "demo@linkro.app",
  plan: "pro",
  templateId: "glass",
  profile: {
    name: "Demo Creator",
    bio: "Building creator-first products with design and data.",
    avatar: "",
  },
  status: "active",
  createdAt: new Date().toISOString(),
};

const demoLinks: LinkDoc[] = [
  { id: "link-1", userId: "demo-user-id", title: "Portfolio", url: "https://example.com", order: 1, isActive: true },
  { id: "link-2", userId: "demo-user-id", title: "Instagram", url: "https://instagram.com", order: 2, isActive: true },
  { id: "link-3", userId: "demo-user-id", title: "YouTube", url: "https://youtube.com", order: 3, isActive: true },
];

const demoEvents: AnalyticsEvent[] = [
  {
    ownerId: "demo-user-id",
    type: "view",
    timestamp: new Date().toISOString(),
    metadata: { device: "mobile-1", browser: "safari", country: "IN", referrer: "Instagram" },
  },
  {
    ownerId: "demo-user-id",
    type: "view",
    timestamp: new Date().toISOString(),
    metadata: { device: "mobile-2", browser: "chrome", country: "US", referrer: "TikTok" },
  },
  {
    ownerId: "demo-user-id",
    type: "click",
    linkId: "link-1",
    timestamp: new Date().toISOString(),
    metadata: { device: "mobile-1", browser: "safari", country: "IN", referrer: "Instagram" },
  },
  {
    ownerId: "demo-user-id",
    type: "click",
    linkId: "link-2",
    timestamp: new Date().toISOString(),
    metadata: { device: "mobile-2", browser: "chrome", country: "US", referrer: "TikTok" },
  },
];

export async function getCreatorByUid(uid: string) {
  try {
    const snap = await adminDb().collection("users").doc(uid).get();
    if (!snap.exists) {
      return demoUser;
    }
    return snap.data() as UserDoc;
  } catch {
    return demoUser;
  }
}

export async function getCreatorByUsername(username: string) {
  try {
    const snap = await adminDb().collection("users").where("username", "==", username).limit(1).get();
    if (snap.empty) {
      return username === "demo" ? demoUser : null;
    }
    return snap.docs[0].data() as UserDoc;
  } catch {
    return username === "demo" ? demoUser : null;
  }
}

export async function getLinksByUserId(userId: string) {
  try {
    const snap = await adminDb().collection("links").where("userId", "==", userId).orderBy("order", "asc").get();
    if (snap.empty) {
      return demoLinks;
    }
    return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<LinkDoc, "id">) }));
  } catch {
    return demoLinks;
  }
}

export async function saveProfile(uid: string, payload: Pick<UserDoc, "profile" | "templateId">) {
  await adminDb().collection("users").doc(uid).set(payload, { merge: true });
}

export async function saveStyle(uid: string, style: import("@/lib/types").StyleSettings) {
  await adminDb().collection("users").doc(uid).set({ style }, { merge: true });
}

export async function isUsernameAvailable(username: string, currentUid: string): Promise<boolean> {
  const snap = await adminDb()
    .collection("users")
    .where("username", "==", username)
    .limit(2)
    .get();
  if (snap.empty) return true;
  // Allow if the only match is the current user
  return snap.docs.length === 1 && snap.docs[0].id === currentUid;
}

export async function updateUsername(uid: string, username: string) {
  await adminDb().collection("users").doc(uid).set({ username }, { merge: true });
}

export async function replaceLinks(uid: string, links: LinkDoc[]) {
  const db = adminDb();
  const batch = db.batch();

  const existing = await db.collection("links").where("userId", "==", uid).get();
  for (const doc of existing.docs) {
    batch.delete(doc.ref);
  }

  for (const link of links) {
    const docRef = link.id ? db.collection("links").doc(link.id) : db.collection("links").doc();
    batch.set(docRef, {
      userId: uid,
      title: link.title,
      url: link.url,
      order: link.order,
      isActive: link.isActive,
    });
  }

  await batch.commit();
}

export async function logAnalyticsEvent(event: AnalyticsEvent) {
  try {
    await adminDb().collection("analytics_events").add({
      ...event,
      timestamp: Timestamp.fromDate(new Date(event.timestamp)),
    });
  } catch {
    return;
  }
}

export async function getCreatorAnalytics(ownerId: string) {
  const links = await getLinksByUserId(ownerId);

  try {
    const snap = await adminDb().collection("analytics_events").where("ownerId", "==", ownerId).limit(1000).get();
    const events = snap.docs.map((doc) => {
      const data = doc.data() as Omit<AnalyticsEvent, "timestamp"> & { timestamp: Timestamp | string };
      return {
        ...data,
        timestamp:
          data.timestamp instanceof Timestamp
            ? data.timestamp.toDate().toISOString()
            : new Date(data.timestamp).toISOString(),
      } as AnalyticsEvent;
    });

    return calculateCreatorAnalytics(events, links);
  } catch {
    return calculateCreatorAnalytics(demoEvents, links);
  }
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  try {
    const db = adminDb();
    const usersSnap = await db.collection("users").get();
    const users = usersSnap.docs.map((doc) => doc.data() as UserDoc);

    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const users24h = users.filter((user) => {
      const activeAt = user.lastLoginAt ?? user.createdAt;
      const timestamp = activeAt ? new Date(activeAt).getTime() : 0;
      return timestamp > now - day;
    }).length;

    const users7d = users.filter((user) => {
      const activeAt = user.lastLoginAt ?? user.createdAt;
      const timestamp = activeAt ? new Date(activeAt).getTime() : 0;
      return timestamp > now - day * 7;
    }).length;

    const usage = new Map<string, number>();
    const vibeMap = new Map<string, number>();
    const shapeMap = new Map<string, number>();
    for (const user of users) {
      const key = user.templateId;
      usage.set(key, (usage.get(key) ?? 0) + 1);
      if (user.style?.vibePreset) vibeMap.set(user.style.vibePreset, (vibeMap.get(user.style.vibePreset) ?? 0) + 1);
      if (user.style?.buttonShape) shapeMap.set(user.style.buttonShape, (shapeMap.get(user.style.buttonShape) ?? 0) + 1);
    }

    let activeProMemberships = users.filter((user) => user.plan === "pro").length;
    const planBreakdown = { free: users.filter((u) => u.plan === "free").length, pro: activeProMemberships };
    // Churn: users with no login/creation in last 30 days
    const thirtyDaysAgo = now - 30 * day;
    const churned = users.filter((u) => {
      const ts = u.lastLoginAt ?? u.createdAt;
      return ts ? new Date(ts).getTime() < thirtyDaysAgo : false;
    }).length;
    const churnRate = users.length ? Number(((churned / users.length) * 100).toFixed(1)) : 0;
    let mrr = activeProMemberships * 15;
    let transactions: AdminMetrics["transactions"] = [];

    if (stripe) {
      const subscriptions = await stripe.subscriptions.list({ limit: 100, status: "active" });
      activeProMemberships = subscriptions.data.length;
      mrr = subscriptions.data.reduce((total, subscription) => {
        const amount = subscription.items.data[0]?.price?.unit_amount ?? 0;
        return total + amount / 100;
      }, 0);

      const charges = await stripe.charges.list({ limit: 20 });
      transactions = charges.data.map((charge) => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency,
        status: charge.status,
        created: new Date(charge.created * 1000).toISOString(),
      }));
    }

    return {
      totalUsers: users.length,
      users24h,
      users7d,
      templateUsage: ["minimal", "glass", "neo"].map((templateId) => ({
        templateId: templateId as "minimal" | "glass" | "neo",
        count: usage.get(templateId) ?? 0,
      })),
      activeProMemberships,
      mrr,
      churnRate,
      planBreakdown,
      vibeUsage: Array.from(vibeMap.entries()).map(([vibePreset, count]) => ({ vibePreset, count })),
      buttonShapeUsage: Array.from(shapeMap.entries()).map(([shape, count]) => ({ shape, count })),
      transactions,
      users: users.map((user) => ({
        uid: user.uid,
        username: user.username,
        email: user.email,
        plan: user.plan,
        joinDate: user.createdAt ?? new Date().toISOString(),
        status: user.status ?? "active",
      })),
    };
  } catch {
    return {
      totalUsers: 128,
      users24h: 19,
      users7d: 73,
      templateUsage: [
        { templateId: "minimal", count: 55 },
        { templateId: "glass", count: 41 },
        { templateId: "neo", count: 32 },
      ],
      activeProMemberships: 42,
      mrr: 630,
      churnRate: 3.1,
      planBreakdown: { free: 86, pro: 42 },
      vibeUsage: [
        { vibePreset: "midnight", count: 48 },
        { vibePreset: "glass",    count: 35 },
        { vibePreset: "matcha",   count: 27 },
        { vibePreset: "brutalist",count: 18 },
      ],
      buttonShapeUsage: [
        { shape: "rounded", count: 61 },
        { shape: "pill",    count: 44 },
        { shape: "sharp",   count: 23 },
      ],
      transactions: [
        { id: "ch_demo_1", amount: 15, currency: "usd", status: "succeeded", created: new Date().toISOString() },
      ],
      users: [
        { uid: "demo-user-id", username: "demo", email: "demo@linkro.app", plan: "pro", joinDate: new Date().toISOString(), status: "active" },
      ],
    };
  }
}
