"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { LinkDoc, TemplateType, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MobilePreviewProps {
  profile: UserProfile;
  links: LinkDoc[];
  templateId: TemplateType;
}

const templateClasses: Record<TemplateType, string> = {
  minimal: "bg-background",
  glass: "glass-card",
  neo: "bg-yellow-100 dark:bg-yellow-300 border-2 border-foreground shadow-[6px_6px_0_0_var(--foreground)]",
};

export function MobilePreview({ profile, links, templateId }: MobilePreviewProps) {
  return (
    <div className="mx-auto w-[320px] rounded-[2.5rem] border p-3">
      <motion.div
        key={templateId}
        initial={{ opacity: 0.6, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("min-h-[560px] rounded-[2rem] border p-4", templateClasses[templateId])}
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-16 w-16 rounded-full border bg-muted" />
          <h3 className="text-base font-semibold">{profile.name || "Your Name"}</h3>
          <p className="text-sm text-muted-foreground">{profile.bio || "Your creator bio appears here"}</p>
        </div>
        <div className="space-y-2">
          {links.filter((link) => link.isActive).map((link) => (
            <Button key={link.id} variant="outline" className="w-full justify-center">
              {link.title}
            </Button>
          ))}
          {!links.length && <p className="text-center text-sm text-muted-foreground">No links added yet</p>}
        </div>
      </motion.div>
    </div>
  );
}
