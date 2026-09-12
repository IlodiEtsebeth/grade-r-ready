import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PasswordInput } from "@/components/password-input";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  confirmed: z.union([z.literal("1"), z.literal(1)]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Grade R Ready" },
      {
        name: "description",
        content: "Sign in or create a free parent account to track your Grade R child's readiness.",
      },
      { property: "og:title", content: "Sign in — Grade R Ready" },
      {
        property: "og:description",
        content: "Parent sign-in for the Grade R readiness checklist and weekly home activities.",
      },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  fullName: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const { mode: modeParam, confirmed } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(modeParam ?? "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    confirmed ? "Your email is confirmed! Enter your password to sign in." : null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "forgot") {
      const parsed = z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .max(255)
        .safeParse(email);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please check your details");
        return;
      }
      setBusy(true);
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setInfo("If that email has an account, a reset link is on its way. Check your inbox.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }

    const parsed = schema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?mode=signin&confirmed=1`,
            data: { full_name: parsed.data.fullName ?? "" },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setInfo("Almost there — check your email and click the link to confirm your account.");
          return;
        }
        navigate({ to: "/setup", replace: true });
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (err) throw err;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden px-5 pt-8 pb-10">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 -right-16 h-64 w-64 rounded-full bg-aloe/30 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="font-mono text-[11px] text-muted-foreground">
            ‹ Back
          </Link>

          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-balance">
            {mode === "signup"
              ? "Create your parent account"
              : mode === "forgot"
                ? "Reset your password"
                : "Welcome back"}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {mode === "signup"
              ? "It takes about a minute. You only need one account for your Grade R child."
              : mode === "forgot"
                ? "Enter your email and we'll send you a link to set a new password."
                : "Sign in to carry on with the checklist and this week's activities."}
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">Your name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. Lerato"
                  className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
                placeholder="you@email.com"
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>
            {mode !== "forgot" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">Password</span>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  maxLength={72}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="At least 6 characters"
                />
              </label>
            )}
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">Confirm password</span>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Type it again"
                />
              </label>
            )}

            {mode === "signin" && (
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setInfo(null);
                }}
                className="self-end text-[12px] font-semibold text-ochre"
              >
                Forgot password?
              </button>
            )}

            {error && (
              <p className="rounded-xl bg-ochre-soft px-4 py-3 text-[13px] text-foreground">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-xl bg-aloe-soft px-4 py-3 text-[13px] text-foreground">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-xl bg-foreground py-3.5 text-[14px] font-semibold text-background transition active:scale-[0.99] disabled:opacity-60"
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
            </button>
          </form>

          {mode === "forgot" ? (
            <button
              onClick={() => {
                setMode("signin");
                setError(null);
                setInfo(null);
              }}
              className="mt-5 w-full text-center text-[13px] font-semibold text-ochre"
            >
              ‹ Back to sign in
            </button>
          ) : (
            <button
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError(null);
                setInfo(null);
                setConfirmPassword("");
              }}
              className="mt-5 w-full text-center text-[13px] font-semibold text-ochre"
            >
              {mode === "signup" ? "I already have an account" : "I need to create an account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
