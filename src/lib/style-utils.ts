import type { FontPairing } from "@/lib/types";

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

export const DEFAULT_STYLE: import("@/lib/types").StyleSettings = {
  background: "solid",
  backgroundValue: "#09090b",
  buttonStyle: "glass",
  fontPairing: "space",
  accentColor: "#7c3aed",
  vibe: "dark",
};
