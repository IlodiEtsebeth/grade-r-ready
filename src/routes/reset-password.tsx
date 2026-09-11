import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PasswordInput } from "@/components/password-input";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Grade R Ready" },
      { name: "description", content: "Choose a new password for your Grade R Ready account." },
    ],
  }),
  component: ResetPassword,
});

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase turns the recovery link's token into a session automatically on load.
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    const parsed = schema.safeParse({ password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your password");
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
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

        <div className="relative z-10">
          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-balance">
            Set a new password
          </h1>

          {!ready && !done && (
            <p className="mt-4 rounded-xl bg-ochre-soft px-4 py-3 text-[13px] text-foreground">
              This link may have expired.{" "}
              <Link to="/auth" className="font-semibold underline">
                Request a new one
              </Link>
              .
            </p>
          )}

          {ready && !done && (
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">New password</span>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">Confirm new password</span>
                <PasswordInput
                  value={confirm}
                  onChange={setConfirm}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Type it again"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-ochre-soft px-4 py-3 text-[13px] text-foreground">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-2 rounded-xl bg-foreground py-3.5 text-[14px] font-semibold text-background transition active:scale-[0.99] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save new password"}
              </button>
            </form>
          )}

          {done && (
            <p className="mt-6 rounded-xl bg-aloe-soft px-4 py-3 text-[13px] text-foreground">
              Password updated — taking you to your dashboard…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
