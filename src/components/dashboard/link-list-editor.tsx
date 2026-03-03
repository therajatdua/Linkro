"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, GripVertical, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LinkDoc, PlanType, UserProfile } from "@/lib/types";

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
}

export function LinkListEditor({ links, plan, profile, username }: LinkListEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { links: links.map((l) => ({ ...l })) },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const watchedLinks = form.watch("links");
  const limit = plan === "pro" ? Infinity : FREE_LIMIT;
  const atLimit = fields.length >= limit;

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
      const msg = err instanceof Error ? err.message : "unknown";
      toast.error(`Unable to save links: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    if (atLimit) {
      toast.error(`Free plan allows up to ${FREE_LIMIT} links. Upgrade to Pro for unlimited.`);
      return;
    }
    append({ id: crypto.randomUUID(), title: "", url: "https://", isActive: true, order: fields.length + 1 });
  }

  function handleDrop(targetIndex: number) {
    if (!draggingId) return;
    const sourceIndex = fields.findIndex((f) => f.id === draggingId);
    if (sourceIndex >= 0 && sourceIndex !== targetIndex) move(sourceIndex, targetIndex);
    setDraggingId(null);
  }

  const previewLinks = watchedLinks.filter((l) => l.isActive && l.title);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
      {/* ── Editor ── */}
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
          <div className="divide-y divide-zinc-800/40">
            {fields.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-zinc-500">
                No links yet. Click &ldquo;Add Link&rdquo; to get started.
              </p>
            )}
            {fields.map((field, index) => {
              const isActive = watchedLinks[index]?.isActive ?? true;
              return (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => setDraggingId(field.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={`grid grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3 px-4 py-3 transition-colors ${
                    draggingId === field.id ? "opacity-40" : "hover:bg-zinc-800/20"
                  } ${!isActive ? "opacity-55" : ""}`}
                >
                  <GripVertical className="h-4 w-4 cursor-grab text-zinc-600 active:cursor-grabbing" />
                  <div>
                    <Input
                      placeholder="Link title"
                      className="border-zinc-700/60 bg-zinc-800/40 text-sm placeholder:text-zinc-600 focus-visible:ring-violet-500"
                      {...form.register(`links.${index}.title`)}
                    />
                    {form.formState.errors.links?.[index]?.title && (
                      <p className="mt-0.5 text-xs text-rose-400">
                        {form.formState.errors.links[index]?.title?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="https://..."
                      className="border-zinc-700/60 bg-zinc-800/40 text-sm placeholder:text-zinc-600 focus-visible:ring-violet-500"
                      {...form.register(`links.${index}.url`)}
                    />
                    {form.formState.errors.links?.[index]?.url && (
                      <p className="mt-0.5 text-xs text-rose-400">
                        {form.formState.errors.links[index]?.url?.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => form.setValue(`links.${index}.isActive`, !isActive)}
                    title={isActive ? "Visible — click to hide" : "Hidden — click to show"}
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
                    onClick={() => remove(index)}
                    className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

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

      {/* ── Live preview ── */}
      <div className="flex flex-col items-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Live Preview</p>
        <div className="w-full max-w-[230px]">
          <div className="overflow-hidden rounded-[2rem] border-2 border-zinc-700/80 bg-zinc-950 shadow-2xl shadow-black/50">
            <div className="flex justify-center py-2.5">
              <div className="h-1 w-10 rounded-full bg-zinc-700" />
            </div>
            <div className="overflow-y-auto px-3 pb-5" style={{ maxHeight: 480 }}>
              <div className="flex flex-col items-center gap-2 py-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-500/30"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
                    {(profile.name || "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{profile.name || "Your Name"}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-zinc-400">{profile.bio || "Your bio"}</p>
                </div>
              </div>
              <div className="space-y-2">
                {previewLinks.length === 0 && (
                  <p className="text-center text-[11px] text-zinc-600">No active links</p>
                )}
                {previewLinks.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-3 py-2 text-center text-xs font-medium text-zinc-200"
                  >
                    {link.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-zinc-800/60 py-2 text-center text-[10px] text-zinc-600">
              linkro.app/<span className="text-zinc-400">{username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
