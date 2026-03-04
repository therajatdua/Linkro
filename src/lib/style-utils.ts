import type { FontPairing, StyleSettings, VibePreset } from "@/lib/types";

/** Returns CSS class(es) for a font pairing slot */
export function buildFontClass(
  pairing: FontPairing | undefined,
  slot: "heading" | "body",
): string {
  if (!pairing) return "";
  const map: Record<FontPairing, { heading: string; body: string }> = {
    clash:    { heading: "font-clash",   body: "font-inter" },
    playfair: { heading: "font-playfair", body: "font-lato" },
    space:    { heading: "font-space",   body: "font-dm" },
    syne:     { heading: "font-syne",    body: "font-nunito" },
    bebas:    { heading: "font-bebas",   body: "font-opensans" },
  };
  return map[pairing][slot];
}

export const FONT_PAIRINGS: Array<{
  id: FontPairing;
  label: string;
  heading: string;
  body: string;
  headingClass: string;
  bodyClass: string;
}> = [
  { id: "clash",    label: "Modern",    heading: "Clash Display", body: "Inter",       headingClass: "font-clash",    bodyClass: "font-inter"    },
  { id: "playfair", label: "Editorial", heading: "Playfair",      body: "Lato",        headingClass: "font-playfair", bodyClass: "font-lato"     },
  { id: "space",    label: "Minimal",   heading: "Space Grotesk", body: "DM Sans",     headingClass: "font-space",    bodyClass: "font-dm"       },
  { id: "syne",     label: "Creative",  heading: "Syne",          body: "Nunito",      headingClass: "font-syne",     bodyClass: "font-nunito"   },
  { id: "bebas",    label: "Bold",      heading: "Bebas Neue",    body: "Open Sans",   headingClass: "font-bebas",    bodyClass: "font-opensans" },
];

export const MESH_PRESETS = [
  { id: "violet", label: "Cosmic",   class: "mesh-violet" },
  { id: "rose",   label: "Crimson",  class: "mesh-rose"   },
  { id: "ocean",  label: "Ocean",    class: "mesh-ocean"  },
  { id: "forest", label: "Forest",   class: "mesh-forest" },
  { id: "gold",   label: "Ember",    class: "mesh-gold"   },
];

export const DEFAULT_STYLE: StyleSettings = {
  background: "solid",
  backgroundValue: "#09090b",
  buttonShape: "rounded",
  buttonEffect: "glass",
  fontPairing: "space",
  accentColor: "#7c3aed",
  vibe: "dark",
};

export const VIBE_PRESETS: Array<{
  id: VibePreset;
  label: string;
  description: string;
  preview: string;
  style: Omit<StyleSettings, "buttonStyle">;
}> = [
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep dark · Indigo accents",
    preview: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)",
    style: {
      background: "solid",      backgroundValue: "#0d0d0d",
      buttonShape: "rounded",   buttonEffect: "glass",
      fontPairing: "space",     accentColor: "#6366f1",
      vibe: "dark",             vibePreset: "midnight",
    },
  },
  {
    id: "glass",
    label: "Glass",
    description: "Violet mesh · Ultra modern",
    preview: "radial-gradient(at 40% 30%, #7c3aed 0, transparent 60%), radial-gradient(at 80% 10%, #4f46e5 0, transparent 60%), #09090b",
    style: {
      background: "mesh",       backgroundValue: "violet",
      buttonShape: "pill",      buttonEffect: "glass",
      fontPairing: "clash",     accentColor: "#8b5cf6",
      vibe: "dark",             vibePreset: "glass",
    },
  },
  {
    id: "matcha",
    label: "Matcha",
    description: "Forest green · Editorial serif",
    preview: "radial-gradient(at 40% 20%, #16a34a 0, transparent 55%), radial-gradient(at 80% 0%, #065f46 0, transparent 55%), #020c06",
    style: {
      background: "mesh",       backgroundValue: "forest",
      buttonShape: "rounded",   buttonEffect: "solid",
      fontPairing: "playfair",  accentColor: "#22c55e",
      vibe: "dark",             vibePreset: "matcha",
    },
  },
  {
    id: "brutalist",
    label: "Brutalist",
    description: "Raw contrast · Sharp edges",
    preview: "linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%)",
    style: {
      background: "solid",      backgroundValue: "#f5f0e8",
      buttonShape: "sharp",     buttonEffect: "solid",
      fontPairing: "bebas",     accentColor: "#111111",
      vibe: "light",            vibePreset: "brutalist",
    },
  },
];
