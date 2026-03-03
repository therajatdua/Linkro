export type PlanType = "free" | "pro";
export type TemplateType = "minimal" | "glass" | "neo";

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
}

export interface AdminMetrics {
  totalUsers: number;
  users24h: number;
  users7d: number;
  templateUsage: Array<{ templateId: TemplateType; count: number }>;
  activeProMemberships: number;
  mrr: number;
  transactions: Array<{ id: string; amount: number; currency: string; status: string; created: string }>;
  users: Array<{ uid: string; email: string; joinDate: string; status: "active" | "banned" }>;
}
