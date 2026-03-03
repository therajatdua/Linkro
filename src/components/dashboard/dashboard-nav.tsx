"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Globe, LayoutDashboard, Link2, QrCode, Settings, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Profile Builder", icon: User, exact: false },
  { href: "/dashboard/links", label: "Links", icon: Link2, exact: false },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/dashboard/share", label: "Share & QR", icon: QrCode, exact: false },
];

interface DashboardNavProps {
  username: string;
}

export function DashboardNav({ username }: DashboardNavProps) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="space-y-1">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              active
                ? "bg-violet-500/15 text-violet-300"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-violet-400" : ""}`} />
            {label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
          </Link>
        );
      })}

      <div className="my-3 border-t border-zinc-800" />

      <Link
        href={`/${username}`}
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/60 hover:text-zinc-100"
      >
        <Globe className="h-4 w-4" />
        View public page
      </Link>

      <Link
        href="/dashboard/settings"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/60 hover:text-zinc-100"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  );
}
