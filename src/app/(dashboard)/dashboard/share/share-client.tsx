"use client";

import { Check, Copy, Download, QrCode } from "lucide-react";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";

interface ShareClientProps {
  username: string;
  profile: UserProfile;
}

const BRAND_BLUE = "#7C3AED"; // violet-600

export function ShareClient({ username, profile }: ShareClientProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://linkro.app";
  const publicUrl = username ? `${baseUrl}/${username}` : `${baseUrl}/`;

  async function handleCopy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Draw branded canvas: add padding + "Powered by Linkro" footer
    const padding = 24;
    const footerHeight = 40;
    const branded = document.createElement("canvas");
    branded.width = canvas.width + padding * 2;
    branded.height = canvas.height + padding * 2 + footerHeight;

    const ctx = branded.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#09090b"; // zinc-950
    ctx.fillRect(0, 0, branded.width, branded.height);

    // QR
    ctx.drawImage(canvas, padding, padding);

    // Footer: "Powered by Linkro"
    ctx.fillStyle = "#a1a1aa"; // zinc-400
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Powered by Linkro",
      branded.width / 2,
      canvas.height + padding * 2 + footerHeight / 2 + 4,
    );

    const link = document.createElement("a");
    link.download = `linkro-qr-${username || "profile"}.png`;
    link.href = branded.toDataURL("image/png");
    link.click();
    toast.success("QR code downloaded");
  }

  if (!username) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-8 text-center">
        <div>
          <QrCode className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
          <p className="text-sm font-medium">Username not set</p>
          <p className="mt-1 text-xs text-zinc-500">
            Set your username on the Settings page to get a shareable link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Link card ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="font-bold">Your Public Link</h2>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/40 px-4 py-3">
          <span className="flex-1 truncate text-sm text-zinc-300">{publicUrl}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700/60 hover:text-zinc-100"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 font-semibold text-white hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>

        <p className="text-xs text-zinc-500">
          Anyone with this link can view your public Linkro profile — no account required.
        </p>
      </div>

      {/* ── QR card ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="font-bold">QR Code</h2>

        <div ref={qrRef} className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-white p-5">
            <QRCodeCanvas
              value={publicUrl}
              size={180}
              fgColor="#09090b"
              bgColor="#ffffff"
              level="H"
              imageSettings={{
                src: "/logo.png",
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
          </div>

          {/* Linkro branding */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white"
              style={{ background: BRAND_BLUE }}
            >
              L
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              Powered by <span className="text-violet-400">Linkro</span>
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full rounded-xl border-zinc-700/60 bg-zinc-800/40 font-semibold text-zinc-200 hover:bg-zinc-700/60"
        >
          <Download className="mr-2 h-4 w-4" />
          Download QR
        </Button>

        <p className="text-xs text-zinc-500">
          Print it, add it to your bio, or embed it in presentations.
        </p>
      </div>
    </div>
  );
}
