"use client";

import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const APP_URL = "https://linkro-liard.vercel.app";
const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;

interface SettingsClientProps {
  currentUsername: string;
  email: string;
}

export function SettingsClient({ currentUsername, email }: SettingsClientProps) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = username ? `${APP_URL}/${username}` : null;
  const isValid = USERNAME_RE.test(username);
  const unchanged = username === currentUsername;

  async function handleSave() {
    if (!isValid || unchanged) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "failed");
      toast.success("Username saved!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "error";
      toast.error(`Could not save username: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 max-w-xl">
      {/* Account info */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="font-bold">Account</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <Input
            value={email}
            disabled
            className="border-zinc-700/60 bg-zinc-800/40 text-zinc-400 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Username */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
        <div>
          <h2 className="font-bold">Your Public URL</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Your unique Linkro username. Cannot be the same as another user's.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-zinc-500">linkro-liard.vercel.app/</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
            placeholder="yourname"
            className="border-zinc-700/60 bg-zinc-800/40 placeholder:text-zinc-600 focus-visible:ring-violet-500"
          />
        </div>

        {username && !isValid && (
          <p className="text-xs text-rose-400">
            3–30 characters, lowercase letters, numbers, underscore, dot, or dash only.
          </p>
        )}

        {publicUrl && (
          <div className="flex items-center gap-2 rounded-xl border border-zinc-700/40 bg-zinc-800/30 px-3 py-2">
            <span className="flex-1 truncate text-xs text-zinc-300">{publicUrl}</span>
            <button
              onClick={handleCopy}
              className="rounded p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || !isValid || unchanged}
            className="rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 px-6 font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Username"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
