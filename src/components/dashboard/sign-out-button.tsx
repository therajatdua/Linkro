"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/sign-in");
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-300"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
