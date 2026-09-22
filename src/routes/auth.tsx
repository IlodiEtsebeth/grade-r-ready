import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PasswordInput } from "@/components/password-input";
import { LanguageToggle } from "@/components/app-shell";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

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

function AuthPage() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const { mode: modeParam, confirmed } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(modeParam ?? "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("title.signIn", lang);
  }, [lang]);

  useEffect(() => {
    if (confirmed) setInfo(t("auth.info.emailConfirmed", lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed]);

  const schema = z.object({
    email: z.string().trim().email(t("auth.validation.email", lang)).max(255),
    password: z.string().min(6, t("auth.validation.password", lang)).max(72),
    fullName: z.string().trim().max(100).optional(),
  });

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
        .email(t("auth.validation.email", lang))
        .max(255)
        .safeParse(email);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? t("auth.validation.generic", lang));
        return;
      }
      setBusy(true);
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setInfo(t("auth.info.resetSent", lang));
      } catch (err) {
        setError(err instanceof Error ? err.message : t("auth.error.generic", lang));
      } finally {
        setBusy(false);
      }
      return;
    }

    const parsed = schema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("auth.validation.generic", lang));
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError(t("auth.validation.passwordMismatch", lang));
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
            data: { full_name: parsed.data.fullName ?? "", language: lang },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setInfo(t("auth.info.confirmEmail", lang));
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
      setError(err instanceof Error ? err.message : t("auth.error.generic", lang));
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
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="font-mono text-[11px] text-muted-foreground">
              {t("auth.back", lang)}
            </Link>
            <LanguageToggle />
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-balance">
            {mode === "signup"
              ? t("auth.heading.signup", lang)
              : mode === "forgot"
                ? t("auth.heading.forgot", lang)
                : t("auth.heading.signin", lang)}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {mode === "signup"
              ? t("auth.subtext.signup", lang)
              : mode === "forgot"
                ? t("auth.subtext.forgot", lang)
                : t("auth.subtext.signin", lang)}
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">{t("auth.label.name", lang)}</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  placeholder={t("auth.placeholder.name", lang)}
                  className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">{t("auth.label.email", lang)}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
                placeholder={t("auth.placeholder.email", lang)}
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>
            {mode !== "forgot" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">{t("auth.label.password", lang)}</span>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  maxLength={72}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder={t("auth.placeholder.password", lang)}
                />
              </label>
            )}
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">
                  {t("auth.label.confirmPassword", lang)}
                </span>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder={t("auth.placeholder.confirmPassword", lang)}
                />
              </label>
            )}

            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold">{t("auth.language.label", lang)}</span>
                <div className="flex gap-2">
                  {(["en", "af"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold ring-1 transition ${
                        lang === code
                          ? "bg-foreground text-background ring-foreground"
                          : "bg-surface/80 text-muted-foreground ring-line"
                      }`}
                    >
                      {code === "en"
                        ? t("auth.language.english", lang)
                        : t("auth.language.afrikaans", lang)}
                    </button>
                  ))}
                </div>
              </div>
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
                {t("auth.forgotLink", lang)}
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
                ? t("auth.button.wait", lang)
                : mode === "signup"
                  ? t("auth.button.createAccount", lang)
                  : mode === "forgot"
                    ? t("auth.button.sendReset", lang)
                    : t("auth.button.signIn", lang)}
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
              {t("auth.link.backToSignIn", lang)}
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
              {mode === "signup"
                ? t("auth.link.haveAccount", lang)
                : t("auth.link.needAccount", lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
