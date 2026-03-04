"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Moon, Sliders, Sun, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildFontClass, FONT_PAIRINGS, MESH_PRESETS, VIBE_PRESETS } from "@/lib/style-utils";
import type {
  BackgroundStyle,
  ButtonEffect,
  ButtonShape,
  StyleSettings,
  VibePreset,
} from "@/lib/types";

interface StyleEngineProps {
  defaultStyle: StyleSettings;
}

type Tab = "vibes" | "custom";

const SHAPES: Array<{ id: ButtonShape; label: string; radius: string }> = [
  { id: "sharp",   label: "Sharp",   radius: "rounded-[4px]"  },
  { id: "rounded", label: "Rounded", radius: "rounded-xl"      },
  { id: "pill",    label: "Pill",    radius: "rounded-full"    },
];

const EFFECTS: Array<{ id: ButtonEffect; label: string; desc: string }> = [
  { id: "glass",  label: "Glass",   desc: "Blur 12px · frosted"    },
  { id: "shadow", label: "Shadow",  desc: "Soft depth · elevated"  },
  { id: "solid",  label: "Solid",   desc: "Clean border · minimal" },
];

export function StyleEngine({ defaultStyle }: StyleEngineProps) {
  const router = useRouter();
  const [style, setStyle] = useState<StyleSettings>(defaultStyle);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("vibes");

  function update<K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) {
    setStyle((prev) => ({ ...prev, [key]: value }));
  }

  function applyVibe(vibeId: VibePreset) {
    const preset = VIBE_PRESETS.find((v) => v.id === vibeId);
    if (!preset) return;
    setStyle((prev) => ({ ...prev, ...preset.style }));
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

  const headingFont = buildFontClass(style.fontPairing, "heading");
  const bodyFont = buildFontClass(style.fontPairing, "body");

  return (
    <div className="space-y-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Vibe Engine</h2>
          <p className="mt-0.5 text-xs text-zinc-400">Design your public page aesthetic.</p>
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

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-1">
        {(["vibes", "custom"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === t
                ? "bg-violet-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t === "vibes" ? <Zap className="h-3.5 w-3.5" /> : <Sliders className="h-3.5 w-3.5" />}
            {t === "vibes" ? "Quick Vibes" : "Custom"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "vibes" ? (
          <motion.div
            key="vibes"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Choose a preset
            </p>
            <div className="grid grid-cols-2 gap-3">
              {VIBE_PRESETS.map((preset) => {
                const active = style.vibePreset === preset.id;
                return (
                  <motion.button
                    key={preset.id}
                    onClick={() => applyVibe(preset.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-xl border-2 p-0 text-left transition-all ${
                      active
                        ? "border-violet-500 ring-1 ring-violet-500/40"
                        : "border-zinc-700/60 hover:border-zinc-500"
                    }`}
                  >
                    {/* Gradient tile */}
                    <div
                      className="h-16 w-full"
                      style={{ background: preset.preview }}
                    />
                    <div className="px-3 py-2">
                      <p className="text-xs font-bold text-zinc-200">{preset.label}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">{preset.description}</p>
                    </div>
                    {active && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Vibe summary */}
            {style.vibePreset && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-zinc-700/40 bg-zinc-800/30 px-4 py-3 text-xs text-zinc-400"
              >
                Applied:{" "}
                <span className="font-semibold capitalize text-violet-300">{style.vibePreset}</span>
                {" "}— {style.vibe} vibe ·{" "}
                <span className="capitalize">{style.buttonShape}</span> shape ·{" "}
                <span className="capitalize">{style.buttonEffect}</span> effect
              </motion.div>
            )}

            <p className="text-center text-[11px] text-zinc-600">
              Switch to <button className="text-violet-400 hover:underline" onClick={() => setTab("custom")}>Custom</button> to fine-tune any setting.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-5"
          >
            {/* Vibe (dark / light) */}
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

            {/* Background */}
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
                  <p className="mt-1 text-xs text-zinc-500">Unsplash, Cloudinary, or any image URL</p>
                </div>
              )}
            </Section>

            {/* Accent Color */}
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
                  {["#7c3aed", "#e11d48", "#0284c7", "#16a34a", "#d97706"].map((c) => (
                    <button
                      key={c}
                      onClick={() => update("accentColor", c)}
                      className={`h-6 w-6 rounded-full border-2 transition-all ${
                        style.accentColor === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </Section>

            {/* Button Shape */}
            <Section label="Button Shape">
              <div className="grid grid-cols-3 gap-2">
                {SHAPES.map(({ id, label, radius }) => (
                  <button
                    key={id}
                    onClick={() => update("buttonShape", id)}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3 transition-all ${
                      (style.buttonShape ?? "rounded") === id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-zinc-700/60 hover:border-zinc-600"
                    }`}
                  >
                    {(style.buttonShape ?? "rounded") === id && (
                      <Check className="absolute top-1.5 right-1.5 h-3 w-3 text-violet-400" />
                    )}
                    <div
                      className={`h-6 w-full bg-zinc-600/60 ${radius}`}
                    />
                    <p className="text-[11px] font-medium text-zinc-300">{label}</p>
                  </button>
                ))}
              </div>
            </Section>

            {/* Button Effect */}
            <Section label="Button Effect">
              <div className="space-y-2">
                {EFFECTS.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => update("buttonEffect", id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      (style.buttonEffect ?? "glass") === id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-zinc-700/60 hover:border-zinc-600"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{label}</p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                    {(style.buttonEffect ?? "glass") === id && (
                      <Check className="h-4 w-4 text-violet-400" />
                    )}
                  </button>
                ))}
              </div>
            </Section>

            {/* Font Pairing */}
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
                      <p className={`text-sm font-semibold text-zinc-200 ${headingClass}`}>
                        {heading}
                      </p>
                      <p className={`text-xs text-zinc-500 ${bodyClass}`}>
                        {body} · {label}
                      </p>
                    </div>
                    {style.fontPairing === id && (
                      <Check className="h-4 w-4 text-violet-400" />
                    )}
                  </motion.button>
                ))}
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini preview of applied state */}
      <div className="rounded-xl border border-zinc-700/30 bg-zinc-800/20 p-4">
        <p className="mb-2 text-xs font-medium text-zinc-500">Style Preview</p>
        <div
          className={`flex flex-col gap-2 rounded-lg p-3 ${style.background === "mesh" ? (MESH_PRESETS.find(p => p.id === style.backgroundValue)?.class ?? "") : ""} ${style.vibe === "light" ? "vibe-light" : ""}`}
          style={
            style.background === "solid"
              ? { background: style.backgroundValue }
              : style.background === "image" && style.backgroundValue
              ? { backgroundImage: `url(${style.backgroundValue})`, backgroundSize: "cover" }
              : {}
          }
        >
          <p className={`text-xs font-bold ${style.vibe === "light" ? "text-zinc-900" : "text-white"} ${headingFont}`}>
            Creator Name
          </p>
          {["My Portfolio", "Subscribe", "DM Me"].map((t) => (
            <div
              key={t}
              className={`${style.buttonShape ? `btn-shape-${style.buttonShape}` : "btn-shape-rounded"} ${style.buttonEffect ? `btn-effect-${style.buttonEffect}` : "btn-effect-glass"} text-center text-xs profile-link-btn`}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
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
