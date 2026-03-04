"use client";

import { motion } from "framer-motion";
import { Check, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FONT_PAIRINGS, MESH_PRESETS } from "@/lib/style-utils";
import type { BackgroundStyle, ButtonStyle, FontPairing, StyleSettings } from "@/lib/types";

interface StyleEngineProps {
  defaultStyle: StyleSettings;
}

const BUTTON_STYLES: Array<{ id: ButtonStyle; label: string; preview: string }> = [
  { id: "glass",      label: "Glass",       preview: "btn-glass" },
  { id: "neumorphic", label: "Neumorphic",  preview: "btn-neumorphic" },
  { id: "minimal",    label: "Minimal",     preview: "btn-minimal" },
  { id: "pill",       label: "Pill",        preview: "btn-pill" },
];

export function StyleEngine({ defaultStyle }: StyleEngineProps) {
  const router = useRouter();
  const [style, setStyle] = useState<StyleSettings>(defaultStyle);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) {
    setStyle((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(style),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error((b as { error?: string }).error ?? "failed");
      }
      toast.success("Style saved");
      router.refresh();
    } catch (err) {
      toast.error(`Unable to save style: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Style Engine</h2>
          <p className="mt-0.5 text-xs text-zinc-400">Customize the look of your public page.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Style"}
        </Button>
      </div>

      {/* ── Vibe ── */}
      <Section label="Page Vibe">
        <div className="flex gap-3">
          {(["dark", "light"] as const).map((v) => (
            <button
              key={v}
              onClick={() => update("vibe", v)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                style.vibe === v
                  ? "border-violet-500 bg-violet-500/15 text-violet-300"
                  : "border-zinc-700/60 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {v === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Background ── */}
      <Section label="Background">
        <div className="flex gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-1">
          {(["solid", "mesh", "image"] as BackgroundStyle[]).map((bg) => (
            <button
              key={bg}
              onClick={() => update("background", bg)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                style.background === bg
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {bg.charAt(0).toUpperCase() + bg.slice(1)}
            </button>
          ))}
        </div>

        {style.background === "solid" && (
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={style.backgroundValue || "#09090b"}
              onChange={(e) => update("backgroundValue", e.target.value)}
              className="h-9 w-14 cursor-pointer rounded-lg border border-zinc-700/60 bg-zinc-800/40"
            />
            <Input
              value={style.backgroundValue || "#09090b"}
              onChange={(e) => update("backgroundValue", e.target.value)}
              className="h-9 border-zinc-700/60 bg-zinc-800/40 font-mono text-sm"
            />
          </div>
        )}

        {style.background === "mesh" && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {MESH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => update("backgroundValue", preset.id)}
                className={`${preset.class} relative flex h-10 items-end justify-center overflow-hidden rounded-lg border-2 pb-1 text-[9px] font-bold text-white/80 transition-all ${
                  style.backgroundValue === preset.id
                    ? "border-white scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {style.backgroundValue === preset.id && (
                  <Check className="absolute top-1 right-1 h-3 w-3 text-white" />
                )}
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {style.background === "image" && (
          <div className="mt-3">
            <Input
              value={style.backgroundValue}
              onChange={(e) => update("backgroundValue", e.target.value)}
              placeholder="https://example.com/bg.jpg"
              className="border-zinc-700/60 bg-zinc-800/40 text-sm placeholder:text-zinc-600"
            />
            <p className="mt-1 text-xs text-zinc-500">Paste any image URL (Unsplash, Cloudinary, etc.)</p>
          </div>
        )}
      </Section>

      {/* ── Accent Color ── */}
      <Section label="Accent Color">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={style.accentColor}
            onChange={(e) => update("accentColor", e.target.value)}
            className="h-9 w-14 cursor-pointer rounded-lg border border-zinc-700/60 bg-zinc-800/40"
          />
          <Input
            value={style.accentColor}
            onChange={(e) => update("accentColor", e.target.value)}
            className="h-9 border-zinc-700/60 bg-zinc-800/40 font-mono text-sm"
          />
          <div className="flex gap-1.5">
            {["#7c3aed","#e11d48","#0284c7","#16a34a","#d97706"].map((c) => (
              <button
                key={c}
                onClick={() => update("accentColor", c)}
                className={`h-6 w-6 rounded-full border-2 transition-all ${style.accentColor === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Button Style ── */}
      <Section label="Button Style">
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_STYLES.map(({ id, label, preview }) => (
            <button
              key={id}
              onClick={() => update("buttonStyle", id)}
              className={`relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                style.buttonStyle === id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-700/60 hover:border-zinc-600"
              }`}
            >
              {style.buttonStyle === id && (
                <span className="absolute top-1.5 right-1.5">
                  <Check className="h-3.5 w-3.5 text-violet-400" />
                </span>
              )}
              <div className={`${preview} mb-2 w-full rounded-lg py-1.5 text-center text-xs font-medium`}>
                Preview
              </div>
              <p className="text-xs font-medium text-zinc-300">{label}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Font Pairing ── */}
      <Section label="Font Pairing">
        <div className="space-y-2">
          {FONT_PAIRINGS.map(({ id, label, heading, body, headingClass, bodyClass }) => (
            <motion.button
              key={id}
              onClick={() => update("fontPairing", id)}
              whileHover={{ x: 2 }}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                style.fontPairing === id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-700/60 hover:border-zinc-600"
              }`}
            >
              <div>
                <p className={`text-sm font-semibold text-zinc-200 ${headingClass}`}>{heading}</p>
                <p className={`text-xs text-zinc-500 ${bodyClass}`}>{body} · {label}</p>
              </div>
              {style.fontPairing === id && <Check className="h-4 w-4 text-violet-400" />}
            </motion.button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      {children}
    </div>
  );
}
