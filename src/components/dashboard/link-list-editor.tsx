"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, GripVertical, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildFontClass, MESH_PRESETS } from "@/lib/style-utils";
import type { LinkDoc, PlanType, StyleSettings, UserProfile } from "@/lib/types";

const FREE_LIMIT = 12;

const schema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Title required"),
      url: z.string().url("Must be a valid URL"),
      order: z.number(),
      isActive: z.boolean(),
    }),
  ),
});
type FormValues = z.infer<typeof schema>;

interface LinkListEditorProps {
  links: LinkDoc[];
  plan: PlanType;
  profile: UserProfile;
  username: string;
  style?: StyleSettings;
}

// ── Sortable row ──────────────────────────────────────────────────────────────
interface SortableRowProps {
  fieldId: string;
  index: number;
  isActive: boolean;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  titleError?: string;
  urlError?: string;
  onToggle: () => void;
  onRemove: () => void;
}

function SortableRow({
  fieldId,
  index,
  isActive,
  register,
  titleError,
  urlError,
  onToggle,
  onRemove,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fieldId,
  });

  const rowStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : isActive ? 1 : 0.55,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={rowStyle}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: isDragging ? 0.4 : isActive ? 1 : 0.55 }}
      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
      className="grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/20"
    >
      <button
        type="button"
        className="touch-none cursor-grab text-zinc-600 hover:text-zinc-400 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div>
        <Input
          placeholder="Link title"
          className="border-zinc-700/60 bg-zinc-800/40 text-sm placeholder:text-zinc-600 focus-visible:ring-violet-500"
          {...register(`links.${index}.title`)}
        />
        {titleError && <p className="mt-0.5 text-xs text-rose-400">{titleError}</p>}
      </div>

      <div>
        <Input
          placeholder="https://..."
          className="border-zinc-700/60 bg-zinc-800/40 text-sm placeholder:text-zinc-600 focus-visible:ring-violet-500"
          {...register(`links.${index}.url`)}
        />
        {urlError && <p className="mt-0.5 text-xs text-rose-400">{urlError}</p>}
      </div>

      <button
        type="button"
        onClick={onToggle}
        title={isActive ? "Visible" : "Hidden"}
        className="text-zinc-500 transition-colors hover:text-zinc-200"
      >
        {isActive ? (
          <ToggleRight className="h-5 w-5 text-violet-400" />
        ) : (
          <ToggleLeft className="h-5 w-5" />
        )}
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ── Live preview ──────────────────────────────────────────────────────────────
interface LivePreviewProps {
  profile: UserProfile;
  username: string;
  links: FormValues["links"];
  style?: StyleSettings;
}

function LivePreview({ profile, username, links, style }: LivePreviewProps) {
  const activeLinks = links.filter((l) => l.isActive && l.title);

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
    };
  }

  const isLight = style?.vibe === "light";
  const btnClass = style ? `btn-${style.buttonStyle}` : "btn-glass";
  const headingFont = style ? buildFontClass(style.fontPairing, "heading") : "";
  const bodyFont = style ? buildFontClass(style.fontPairing, "body") : "";

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Live Preview</p>
      <div className="w-full max-w-[230px]">
        <div className="overflow-hidden rounded-[2rem] border-2 border-zinc-700/80 shadow-2xl shadow-black/50">
          <div className="flex justify-center bg-zinc-950 py-2.5">
            <div className="h-1 w-10 rounded-full bg-zinc-700" />
          </div>
          <div
            className={`overflow-y-auto px-3 pb-5 ${bgClass} ${isLight ? "vibe-light" : ""}`}
            style={{ maxHeight: 480, ...bgStyle }}
          >
            <div className="flex flex-col items-center gap-2 py-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: style?.accentColor || "#7c3aed" }}
                >
                  {(profile.name || "?")[0].toUpperCase()}
                </div>
              )}
              <div className="text-center">
                <p
                  className={`text-sm font-bold ${isLight ? "text-zinc-900" : "text-white"} ${headingFont}`}
                >
                  {profile.name || "Your Name"}
                </p>
                <p
                  className={`mt-0.5 text-[11px] leading-tight ${isLight ? "text-zinc-600" : "text-zinc-400"} ${bodyFont}`}
                >
                  {profile.bio || "Your bio"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {activeLinks.length === 0 && (
                <p className={`text-center text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>
                  No active links
                </p>
              )}
              {activeLinks.map((link) => (
                <div key={link.id} className={`${btnClass} w-full text-center text-xs font-medium`}>
                  {link.title}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-800/60 bg-zinc-950 py-2 text-center text-[10px] text-zinc-600">
            linkro.app/<span className="text-zinc-400">{username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LinkListEditor({ links, plan, profile, username, style }: LinkListEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { links: links.map((l) => ({ ...l })) },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const watchedLinks = form.watch("links");
  const limit = plan === "pro" ? Infinity : FREE_LIMIT;
  const atLimit = fields.length >= limit;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = fields.findIndex((f) => f.id === active.id);
    const to = fields.findIndex((f) => f.id === over.id);
    if (from < 0 || to < 0) return;
    const current = form.getValues("links");
    form.setValue("links", arrayMove(current, from, to));
  }

  async function onSave(values: FormValues) {
    setSaving(true);
    try {
      const normalized = values.links.map((link, i) => ({ ...link, order: i + 1 }));
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: normalized }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "save-failed");
      }
      toast.success("Links saved");
      router.refresh();
    } catch (err) {
      toast.error(`Unable to save links: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    if (atLimit) {
      toast.error(`Free plan allows up to ${FREE_LIMIT} links. Upgrade to Pro.`);
      return;
    }
    append({
      id: crypto.randomUUID(),
      title: "",
      url: "https://",
      isActive: true,
      order: fields.length + 1,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
      {/* Editor */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
          <div>
            <h2 className="font-bold">Link Management</h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              {fields.length}/{plan === "pro" ? "∞" : FREE_LIMIT} links
              {plan !== "pro" && " · free plan"}
            </p>
          </div>
          <button
            type="button"
            onClick={addLink}
            disabled={atLimit}
            className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSave)}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-zinc-800/40">
                {fields.length === 0 && (
                  <p className="px-6 py-12 text-center text-sm text-zinc-500">
                    No links yet. Click &ldquo;Add Link&rdquo; to get started.
                  </p>
                )}
                <AnimatePresence initial={false}>
                  {fields.map((field, index) => (
                    <SortableRow
                      key={field.id}
                      fieldId={field.id}
                      index={index}
                      isActive={watchedLinks[index]?.isActive ?? true}
                      register={form.register}
                      titleError={form.formState.errors.links?.[index]?.title?.message}
                      urlError={form.formState.errors.links?.[index]?.url?.message}
                      onToggle={() =>
                        form.setValue(
                          `links.${index}.isActive`,
                          !(watchedLinks[index]?.isActive ?? true),
                        )
                      }
                      onRemove={() => remove(index)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex items-center justify-between border-t border-zinc-800/60 px-6 py-4">
            <a
              href={`/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View public page
            </a>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 px-6 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Links"}
            </Button>
          </div>
        </form>

        {plan !== "pro" && fields.length >= FREE_LIMIT - 2 && (
          <div className="border-t border-violet-500/10 bg-violet-500/5 px-6 py-3 text-xs text-violet-300">
            {fields.length >= FREE_LIMIT
              ? `You've reached the ${FREE_LIMIT}-link limit. `
              : `${FREE_LIMIT - fields.length} link${FREE_LIMIT - fields.length === 1 ? "" : "s"} remaining. `}
            <a href="/pricing" className="font-semibold underline underline-offset-2">
              Upgrade to Pro for unlimited links →
            </a>
          </div>
        )}
      </div>

      <LivePreview profile={profile} username={username} links={watchedLinks} style={style} />
    </div>
  );
}
