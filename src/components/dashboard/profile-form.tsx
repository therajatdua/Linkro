"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { firebaseStorage } from "@/lib/firebase/client";
import { StyleEngine } from "@/components/editor/style-engine";
import { DEFAULT_STYLE } from "@/lib/style-utils";
import type { LinkDoc, StyleSettings, TemplateType, UserProfile } from "@/lib/types";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(4, "Bio must be at least 4 characters"),
  avatar: z.string().url("Must be a valid URL").or(z.literal("")),
  templateId: z.enum(["minimal", "glass", "neo"]),
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  defaultValues: UserProfile;
  templateId: TemplateType;
  links: LinkDoc[];
  username: string;
  defaultStyle?: StyleSettings;
}

const templates: Array<{ id: TemplateType; name: string; accent: string }> = [
  { id: "minimal", name: "Minimal", accent: "border-zinc-500" },
  { id: "glass", name: "Glass", accent: "border-cyan-500" },
  { id: "neo", name: "Neo-Brutalist", accent: "border-fuchsia-500" },
];

export function ProfileForm({ defaultValues, templateId, links, username, defaultStyle }: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, templateId },
  });

  const avatarValue = form.watch("avatar");
  const nameValue = form.watch("name");
  const bioValue = form.watch("bio");
  const templateValue = form.watch("templateId");

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!firebaseStorage) {
      toast.error("Firebase Storage is not configured");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const storageRef = ref(firebaseStorage, `avatars/${username}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadProgress(0);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(pct);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            form.setValue("avatar", url);
            setUploadProgress(null);
            resolve();
          },
        );
      });

      toast.success("Photo uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed — check Firebase Storage rules");
      setUploadProgress(null);
    }
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "save-failed");
      }

      toast.success("Profile saved");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      toast.error(`Unable to save profile: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_260px]">
      {/* ── Form ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
        <div className="border-b border-zinc-800/60 px-6 py-4">
          <h2 className="font-bold">Profile Builder</h2>
          <p className="mt-0.5 text-xs text-zinc-400">Customize how your public page looks.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-6 py-6">
          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800 transition-colors hover:border-violet-500/60"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadProgress !== null ? (
                  <div className="flex flex-col items-center gap-1">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                    <span className="text-[10px] text-zinc-400">{uploadProgress}%</span>
                  </div>
                ) : avatarValue ? (
                  <img src={avatarValue} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-zinc-600" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 transition-colors hover:bg-zinc-700"
              >
                <Camera className="h-3 w-3 text-zinc-300" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Profile Photo</p>
              <p className="mt-0.5 text-xs text-zinc-500">JPG, PNG, WebP · Max 5 MB</p>
              {avatarValue && (
                <button
                  type="button"
                  onClick={() => form.setValue("avatar", "")}
                  className="mt-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              placeholder="e.g. Mira Kapoor"
              className="border-zinc-700/60 bg-zinc-800/40 placeholder:text-zinc-600 focus-visible:ring-violet-500"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-rose-400">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="Designer + educator helping creators scale online."
              rows={3}
              className="border-zinc-700/60 bg-zinc-800/40 placeholder:text-zinc-600 focus-visible:ring-violet-500"
              {...form.register("bio")}
            />
            {form.formState.errors.bio && (
              <p className="text-xs text-rose-400">{form.formState.errors.bio.message}</p>
            )}
          </div>

          {/* Template */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => form.setValue("templateId", t.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    templateValue === t.id
                      ? `${t.accent} bg-zinc-800/60`
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-sm font-semibold">{t.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 px-6 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
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
                {avatarValue ? (
                  <img src={avatarValue} alt="avatar" className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-500/30" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
                    {(nameValue || "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{nameValue || "Your Name"}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-zinc-400">{bioValue || "Your bio appears here"}</p>
                </div>
              </div>
              <div className="space-y-2">
                {links.filter((l) => l.isActive).map((link) => (
                  <div key={link.id} className="rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-3 py-2 text-center text-xs font-medium text-zinc-200">
                    {link.title}
                  </div>
                ))}
                {!links.length && (
                  <p className="text-center text-[11px] text-zinc-600">No links added yet</p>
                )}
              </div>
            </div>
            <div className="border-t border-zinc-800/60 py-2 text-center text-[10px] text-zinc-600">
              linkro.app/<span className="text-zinc-400">{username}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
      <StyleEngine defaultStyle={defaultStyle ?? DEFAULT_STYLE} />
    </div>
  );
}
