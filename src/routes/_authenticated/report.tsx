import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import {
  CATEGORIES,
  TOTAL_ACTIVITIES,
  TOTAL_ITEMS,
  WEEKS,
  currentWeek,
  readinessKey,
  readinessScore,
  type ChecklistStatus,
} from "@/lib/content";
import { useActivities, useChecklist, useChild } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({
    meta: [
      { title: "Grade 1 readiness report — Grade R Ready" },
      {
        name: "description",
        content:
          "A one-page Grade 1 readiness summary for your Grade R child, ready to save or print.",
      },
      { property: "og:title", content: "Grade 1 readiness report — Grade R Ready" },
      {
        property: "og:description",
        content: "Strengths, areas to practise and next steps, in plain language for parents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

const READINESS_KEY_TO_STRING = {
  ready: "readiness.ready",
  developing: "readiness.developing",
  needs_support: "readiness.needsSupport",
} as const;

const SUMMARY_KEY = {
  ready: "report.summary.ready",
  developing: "report.summary.developing",
  needs_support: "report.summary.needsSupport",
} as const;

function ReportPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { data: child, isLoading } = useChild();
  const { data: checklist } = useChecklist(child?.id);
  const { data: activityRows } = useActivities(child?.id);

  useEffect(() => {
    document.title = t("title.report", lang);
  }, [lang]);

  useEffect(() => {
    if (!isLoading && !child) navigate({ to: "/setup", replace: true });
  }, [isLoading, child, navigate]);

  const statuses: Record<string, ChecklistStatus> = {};
  const notes: { label: string; note: string }[] = [];
  for (const row of checklist ?? []) {
    statuses[row.item_id] = row.status;
    if (row.note?.trim()) {
      const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === row.item_id);
      notes.push({ label: item?.label[lang] ?? "Skill", note: row.note.trim() });
    }
  }

  const score = readinessScore(statuses);
  const rKey = readinessKey(score);
  const label = t(READINESS_KEY_TO_STRING[rKey], lang);
  const mastered = Object.values(statuses).filter((s) => s === "mastered").length;
  const developing = Object.values(statuses).filter((s) => s === "developing").length;
  const doneIds = new Set((activityRows ?? []).filter((a) => a.done).map((a) => a.activity_id));
  const week = currentWeek(child?.created_at);

  const allItems = CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.name })));
  const strengths = allItems.filter((i) => statuses[i.id] === "mastered").slice(0, 6);
  const practise = allItems.filter((i) => statuses[i.id] !== "mastered").slice(0, 6);

  const childName = child?.name ?? t("dashboard.fallbackName", lang);
  const summary = t(SUMMARY_KEY[rKey], lang, { name: childName });

  const today = new Date().toLocaleDateString(lang === "af" ? "af-ZA" : "en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell>
      <ScreenHeader
        eyebrow={t("report.eyebrow", lang)}
        title={t("report.title", lang)}
        right={
          <button
            onClick={() => window.print()}
            className="shrink-0 rounded-full bg-foreground px-4 py-2 text-[12px] font-semibold text-background transition active:scale-95 print:hidden"
          >
            {t("report.download", lang)}
          </button>
        }
      />

      <div id="report" className="flex flex-col gap-4">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
            {t("report.summaryLabel", lang)}
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-balance">
            {childName}
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {t("report.metaLine", lang, {
              age: child?.age ?? 5,
              school: child?.school ? ` · ${child.school}` : "",
              date: today,
            })}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sungold-soft/70 p-4">
            <span
              className={`grid size-14 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold ${
                rKey === "ready" ? "bg-aloe" : rKey === "developing" ? "bg-sungold" : "bg-ochre"
              }`}
            >
              {score}%
            </span>
            <div className="min-w-0">
              <p className="font-display text-[15px] font-bold">{label}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {t("report.statLine", lang, { mastered, total: TOTAL_ITEMS, developing })}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed">{summary}</p>
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">{t("report.skillAreas", lang)}</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {CATEGORIES.map((c) => {
              const done = c.items.filter((i) => statuses[i.id] === "mastered").length;
              const dev = c.items.filter((i) => statuses[i.id] === "developing").length;
              const pct = Math.round(((done + dev * 0.5) / c.items.length) * 100);
              const catReadinessKey = readinessKey(pct);
              return (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <p className="truncate text-[13px]">{c.name[lang]}</p>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {done}/{c.items.length} · {t(READINESS_KEY_TO_STRING[catReadinessKey], lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">
            {t("report.strengthsTitle", lang, { name: childName })}
          </p>
          {strengths.length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">
              {t("report.strengthsEmpty", lang)}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {strengths.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-aloe" />
                  <span>{s.label[lang]}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">{t("report.practiseTitle", lang)}</p>
          {practise.length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">
              {t("report.practiseEmpty", lang)}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {practise.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ochre" />
                  <span>
                    {s.label[lang]}
                    <span className="text-muted-foreground"> — {s.cat[lang]}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">{t("report.homeActivities", lang)}</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {t("report.activitiesLine", lang, {
              done: doneIds.size,
              total: TOTAL_ACTIVITIES,
              week,
              weeks: WEEKS.length,
            })}
          </p>
        </Card>

        {notes.length > 0 && (
          <Card>
            <p className="font-display text-[15px] font-bold">{t("report.notesTitle", lang)}</p>
            <div className="mt-3 flex flex-col gap-3">
              {notes.slice(0, 8).map((n, i) => (
                <div key={i}>
                  <p className="text-[12px] font-semibold">{n.label}</p>
                  <p className="text-[13px] text-muted-foreground">{n.note}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <p className="font-display text-[15px] font-bold">{t("report.nextSteps", lang)}</p>
          <ul className="mt-3 flex flex-col gap-2 text-[13px]">
            <li>{t("report.step1", lang)}</li>
            <li>{t("report.step2", lang)}</li>
            <li>{t("report.step3", lang)}</li>
            <li>{t("report.step4", lang)}</li>
          </ul>
          <p className="mt-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
            {t("report.disclaimer", lang)}
          </p>
        </Card>
      </div>

      <button
        onClick={() => window.print()}
        className="rounded-xl bg-foreground py-3 text-[13px] font-semibold text-background transition active:scale-[0.99] print:hidden"
      >
        {t("report.downloadOrPrint", lang)}
      </button>
    </AppShell>
  );
}
