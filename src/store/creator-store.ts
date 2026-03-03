import { create } from "zustand";

import type { LinkDoc, TemplateType, UserProfile } from "@/lib/types";

interface CreatorState {
  templateId: TemplateType;
  profile: UserProfile;
  links: LinkDoc[];
  setTemplateId: (templateId: TemplateType) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setLinks: (links: LinkDoc[]) => void;
  reorderLinks: (sourceId: string, targetId: string) => void;
}

export const useCreatorStore = create<CreatorState>((set) => ({
  templateId: "minimal",
  profile: {
    name: "",
    bio: "",
    avatar: "",
  },
  links: [],
  setTemplateId: (templateId) => set({ templateId }),
  setProfile: (partialProfile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...partialProfile,
      },
    })),
  setLinks: (links) => set({ links }),
  reorderLinks: (sourceId, targetId) =>
    set((state) => {
      const list = [...state.links];
      const sourceIndex = list.findIndex((link) => link.id === sourceId);
      const targetIndex = list.findIndex((link) => link.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return state;
      }

      const [moved] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, moved);

      const normalized = list.map((link, index) => ({ ...link, order: index + 1 }));
      return { links: normalized };
    }),
}));
