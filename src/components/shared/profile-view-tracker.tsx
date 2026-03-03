"use client";

import { useEffect } from "react";

export function ProfileViewTracker({ ownerId }: { ownerId: string }) {
  useEffect(() => {
    const payload = new URLSearchParams({ ownerId }).toString();
    void fetch(`/api/track/view?${payload}`, { method: "POST" });
  }, [ownerId]);

  return null;
}
