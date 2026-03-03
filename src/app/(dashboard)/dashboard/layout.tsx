import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Link2, Sparkles, Zap } from "lucide-react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth-server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  const displayName = user.username ?? user.email?.split("@")[0] ?? "Creator";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#080810] text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm lg:flex">
        {/* Logo */}
        <div className="border-b border-zinc-800/60 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Link2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">linkro</span>
          </Link>
        </div>

        {/* User */}
        <div className="border-b border-zinc-800/60 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-zinc-500">{user.email ?? ""}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <DashboardNav username={user.username ?? "demo"} />
        </div>

        {/* Upgrade card */}
        <div className="border-t border-zinc-800/60 p-4">
          <div className="rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-indigo-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" />
              <p className="text-sm font-semibold">Upgrade to Pro</p>
            </div>
            <p className="mb-3 text-xs text-zinc-400">Unlock custom domain, AI bio generator, and full analytics.</p>
            <Button
              asChild
              size="sm"
              className="w-full rounded-lg border-0 bg-gradient-to-r from-violet-500 to-indigo-600 text-xs font-semibold text-white hover:opacity-90"
            >
              <Link href="/pricing">
                <Sparkles className="mr-1.5 h-3 w-3" />
                See plans
                <ArrowRight className="ml-auto h-3 w-3" />
              </Link>
            </Button>
          </div>

          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Link2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold">linkro</span>
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold">
            {initials}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
