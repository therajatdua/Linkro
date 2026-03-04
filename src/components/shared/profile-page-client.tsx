"use client";

import { motion } from "framer-motion";
import { buildFontClass, MESH_PRESETS } from "@/lib/style-utils";
import type { LinkDoc, StyleSettings, UserProfile } from "@/lib/types";

interface ProfilePageClientProps {
  profile: UserProfile;
  username: string;
  links: LinkDoc[];
  uid: string;
  style?: StyleSettings;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export function ProfilePageClient({ profile, username, links, uid, style }: ProfilePageClientProps) {
  const isLight = style?.vibe === "light";

  // Background
  let bgStyle: React.CSSProperties = { background: style?.backgroundValue || "#09090b" };
  let bgClass = "";
  if (style?.background === "mesh") {
    const preset = MESH_PRESETS.find((p) => p.id === style.backgroundValue);
    bgClass = preset?.class ?? "";
    bgStyle = {};
  } else if (style?.background === "image" && style.backgroundValue) {
    bgStyle = {
      backgroundImage: `url(${style.backgroundValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    };
  }

  const btnClass = `${style ? `btn-${style.buttonStyle}` : "btn-glass"} w-full`;
  const headingFont = style ? buildFontClass(style.fontPairing, "heading") : "";
  const bodyFont = style ? buildFontClass(style.fontPairing, "body") : "";
  const textPrimary = isLight ? "text-zinc-900" : "text-white";
  const textSecondary = isLight ? "text-zinc-600" : "text-zinc-400";

  return (
    <main
      className={`min-h-screen w-full ${bgClass} ${isLight ? "vibe-light" : ""}`}
      style={bgStyle}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 py-14">
        {/* Avatar + identity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8 flex flex-col items-center gap-3"
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-20 w-20 rounded-full object-cover shadow-xl ring-4 ring-white/10"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-xl"
              style={{ background: style?.accentColor || "#7c3aed" }}
            >
              {(profile.name || "?")[0].toUpperCase()}
            </div>
          )}
          <div className="text-center">
            <h1 className={`text-xl font-bold ${textPrimary} ${headingFont}`}>{profile.name}</h1>
            <p className={`mt-1 text-sm leading-relaxed ${textSecondary} ${bodyFont}`}>
              {profile.bio}
            </p>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full space-y-3"
        >
          {links.map((link) => (
            <motion.div key={link.id} variants={item}>
              <form action="/api/track" method="POST">
                <input type="hidden" name="ownerId" value={uid} />
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="url" value={link.url} />
                <button type="submit" className={btnClass}>
                  {link.title}
                </button>
              </form>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <p className={`mt-12 text-xs ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>
          Made with{" "}
          <a
            href="https://linkro.app"
            target="_blank"
            rel="noreferrer"
            className={`font-medium transition-opacity hover:opacity-70 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
          >
            Linkro
          </a>
        </p>
      </div>
    </main>
  );
}
