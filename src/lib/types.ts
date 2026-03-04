export type PlanType = "free" | "pro";
export type TemplateType = "minimal" | "glass" | "neo";

// ─── Style Engine ────────────────────────────────────────────────────────────

export type BackgroundStyle = "solid" | "mesh" | "image";
/** @deprecated use buttonShape + buttonEffect instead */
export type ButtonStyle = "glass" | "neumorphic" | "minimal" | "pill";
export type ButtonShape = "sharp" | "rounded" | "pill";
export type ButtonEffect = "glass" | "shadow" | "solid";
export type VibePreset = "midnight" | "glass" | "matcha" | "brutalist";
export type FontPairing =
  | "clash"      // Clash Display + Inter       — modern / techy
  | "playfair"   // Playfair Display + Lato      — editorial / elegant
  | "space"      // Space Grotesk + DM Sans      — minimal / clean
  | "syne"       // Syne + Nunito               — playful / creative
  | "bebas";     // Bebas Neue + Open Sans       — bold / urban

export interface StyleSettings {
  background: BackgroundStyle;
  /** hex for solid, mesh preset id for mesh, URL for image */
  backgroundValue: string;
  /** @deprecated kept for backward-compat data; prefer buttonShape+buttonEffect */
  buttonStyle?: ButtonStyle;
  buttonShape?: ButtonShape;
  buttonEffect?: ButtonEffect;
  vibePreset?: VibePreset;
  fontPairing: FontPairing;
  accentColor: string;
  /** dark | light vibe for the public page */
  vibe: "dark" | "light";
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
}

export interface UserDoc {
  uid: string;
  username: string;
  email: string;
  plan: PlanType;
  templateId: TemplateType;
  profile: UserProfile;
  style?: StyleSettings;
  status?: "active" | "banned";
  createdAt?: string;
  lastLoginAt?: string;
}

export interface LinkDoc {
  id: string;
  userId: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface AnalyticsEvent {
  linkId?: string;
  ownerId: string;
  type: "view" | "click";
  timestamp: string;
  metadata?: {
    device?: string;
    browser?: string;
    country?: string;
    referrer?: string;
  };
}

export interface CreatorAnalytics {
  uniqueVisitors: number;
  totalViews: number;
  totalClicks: number;
  ctr: number;
  linkClicks: Array<{ linkId: string; title: string; clicks: number }>;
  referrers: Array<{ source: string; value: number }>;
  /** clicks per link in the last 24 hours */
  heatmap24h: Array<{ linkId: string; title: string; clicks: number; isHot: boolean }>;
  countryBreakdown: Array<{ country: string; value: number }>;
}

export interface AdminMetrics {
  totalUsers: number;
  users24h: number;
  users7d: number;
  templateUsage: Array<{ templateId: string; count: number }>;
  activeProMemberships: number;
  mrr: number;
  churnRate: number;
  planBreakdown: { free: number; pro: number };
  vibeUsage: Array<{ vibePreset: string; count: number }>;
  buttonShapeUsage: Array<{ shape: string; count: number }>;
  transactions: Array<{ id: string; amount: number; currency: string; status: string; created: string }>;
  users: Array<{ uid: string; username?: string; email: string; plan: string; joinDate: string; status: "active" | "banned" }>;
}
