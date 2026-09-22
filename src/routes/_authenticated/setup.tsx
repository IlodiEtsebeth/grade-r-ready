import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useChild, useSaveChild } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

export const Route = createFileRoute("/_authenticated/setup")({
  head: () => ({
    meta: [
      { title: "Add your child — Grade R Ready" },
      { name: "description", content: "Add your Grade R child's name, age and school to begin." },
      { property: "og:title", content: "Add your child — Grade R Ready" },
      { property: "og:description", content: "Set up your Grade R child's readiness profile." },
    ],
  }),
  component: Setup,
});

function Setup() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { data: child } = useChild();
  const save = useSaveChild();
  const [name, setName] = useState("");
  const [age, setAge] = useState("5");
  const [school, setSchool] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("title.setup", lang);
  }, [lang]);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setAge(String(child.age ?? 5));
      setSchool(child.school ?? "");
    }
  }, [child]);

  const schema = z.object({
    name: z.string().trim().min(1, t("setup.validation.name", lang)).max(60),
    age: z.number().int().min(4, t("setup.validation.age", lang)).max(7),
    school: z.string().trim().max(100),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ name, age: Number(age), school });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("auth.validation.generic", lang));
      return;
    }
    try {
      await save.mutateAsync(child?.id ? { id: child.id, ...parsed.data } : { ...parsed.data });
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setError(t("setup.error", lang));
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden px-5 pt-8 pb-10">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="relative z-10">
          {child && (
            <Link
              to="/dashboard"
              className="mb-4 inline-block text-[13px] font-semibold text-ochre"
            >
              {t("setup.backToDashboard", lang)}
            </Link>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
            {t("setup.eyebrow", lang)}
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance">
            {child ? t("setup.heading.edit", lang) : t("setup.heading.new", lang)}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">{t("setup.subtext", lang)}</p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">{t("setup.label.name", lang)}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder={t("setup.placeholder.name", lang)}
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">{t("setup.label.age", lang)}</span>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              >
                <option value="4">{t("setup.age4", lang)}</option>
                <option value="5">{t("setup.age5", lang)}</option>
                <option value="6">{t("setup.age6", lang)}</option>
                <option value="7">{t("setup.age7", lang)}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">{t("setup.label.school", lang)}</span>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                maxLength={100}
                placeholder={t("setup.placeholder.school", lang)}
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-ochre-soft px-4 py-3 text-[13px] text-foreground">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={save.isPending}
              className="mt-2 rounded-xl bg-foreground py-3.5 text-[14px] font-semibold text-background transition active:scale-[0.99] disabled:opacity-60"
            >
              {save.isPending ? t("setup.button.saving", lang) : t("setup.button.continue", lang)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
