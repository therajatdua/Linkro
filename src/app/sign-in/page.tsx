"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Link2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseAuth } from "@/lib/firebase/client";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!firebaseAuth) {
      toast.error("Firebase client credentials are not configured");
      return;
    }

    setLoading(true);

    try {
      const credential =
        mode === "sign-up"
          ? await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
          : await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
      await finishSignIn(credential.user);
      toast.success(mode === "sign-up" ? "Account created successfully" : "Signed in successfully");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const msg = (err as Error).message ?? "";
      if (code === "auth/email-already-in-use") toast.error("That email is already registered — try signing in.");
      else if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") toast.error("Incorrect email or password.");
      else if (code === "auth/operation-not-allowed") toast.error("Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in methods.");
      else if (code === "auth/too-many-requests") toast.error("Too many attempts. Please wait a moment.");
      else if (msg.startsWith("session-failed")) {
        const detail = msg.replace("session-failed:", "");
        toast.error(`Session error: ${detail}`);
      }
      else toast.error(`Error${code ? ` (${code})` : ""}: ${msg || "Sign-in failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignIn() {
    if (!firebaseAuth) {
      toast.error("Firebase client credentials are not configured");
      return;
    }

    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(firebaseAuth, provider);
      await finishSignIn(credential.user);
      toast.success("Signed in with Google");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const msg = (err as Error).message ?? "";
      if (code === "auth/operation-not-allowed") toast.error("Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in methods.");
      else if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") { /* user closed popup — no toast */ }
      else if (msg.startsWith("session-failed")) {
        const detail = msg.replace("session-failed:", "");
        toast.error(`Session error: ${detail}`);
      }
      else toast.error(`Google sign-in error${code ? ` (${code})` : ""}: ${msg || "unknown"}`);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function finishSignIn(user: { getIdToken: () => Promise<string>; getIdTokenResult: () => Promise<{ claims: Record<string, unknown> }> }) {
    const idToken = await user.getIdToken();
    const idTokenResult = await user.getIdTokenResult();
    const isAdmin = Boolean(idTokenResult.claims.admin);

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "unknown" }));
      console.error("[finishSignIn] session error:", body);
      throw new Error("session-failed:" + (body.error ?? "unknown"));
    }

    const requestedNext = new URLSearchParams(window.location.search).get("next");
    const fallbackPath = isAdmin ? "/admin" : "/dashboard";
    const next = !requestedNext || (!isAdmin && requestedNext.startsWith("/admin")) ? fallbackPath : requestedNext;

    router.push(next);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080810] px-4 text-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/10 blur-[120px]" />

      {/* Logo top-left */}
      <Link href="/" className="absolute left-6 top-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
          <Link2 className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-bold tracking-tight">linkro</span>
      </Link>

      <div className="relative w-full max-w-sm">
        {/* Mode toggle */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 backdrop-blur-sm">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "sign-in"
                ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            onClick={() => setMode("sign-in")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "sign-up"
                ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            onClick={() => setMode("sign-up")}
          >
            Sign Up
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-sm">
          <h1 className="mb-1 text-2xl font-bold">
            {mode === "sign-up" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-6 text-sm text-zinc-400">
            {mode === "sign-up" ? "Start building your creator page today." : "Sign in to your Linkro dashboard."}
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={googleLoading}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700/60 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-900 px-3 text-xs text-zinc-500">or continue with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input
              placeholder="Email address"
              type="email"
              className="border-zinc-700 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              {...form.register("email")}
            />
            <Input
              placeholder="Password"
              type="password"
              className="border-zinc-700 bg-zinc-800/60 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              {...form.register("password")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-rose-400">{form.formState.errors.email.message}</p>
            )}
            {form.formState.errors.password && (
              <p className="text-xs text-rose-400">{form.formState.errors.password.message}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl border-0 bg-gradient-to-r from-violet-500 to-indigo-600 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? mode === "sign-up" ? "Creating account..." : "Signing in..."
                : mode === "sign-up" ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          By continuing you agree to our{" "}
          <span className="text-zinc-400">Terms of Service</span> and{" "}
          <span className="text-zinc-400">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
