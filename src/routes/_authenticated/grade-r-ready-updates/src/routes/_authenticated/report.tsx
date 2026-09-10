import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import {
  CATEGORIES,
  STATUS_LABEL,
  readinessLabel,
  readinessScore,
  type ChecklistStatus,
} from "@/lib/content";
import { useActivities, useChecklist, useChild } from "@/lib/child-data";

export const Route = createFileRoute("/_authenticated/grade-r-ready-updates/src/routes/_authenticated/report")({
  head: () => ({
    meta: [
      { title: "Readiness report — Grade R Ready" },
      {
        name: "description",
        content:
          "A shareable summary of your child's Grade 1 readiness, ready to download or print.",
      },
      { property: "og:title", content: "Readiness report — Grade R Ready" },
      {
        property: "og:description",
        content: "Download a readiness report to share with your child's school.",
      },
    ],
  }),
  component: Report,
});

function Report() {
  const navigate = useNavigate();
  const { data: child, isLoading: childLoading } = useChild();
  const { data: checklist } = useChecklist(child?.id);
  const { data: activityRows } = useActivities(child?.id);

  useEffect(() => {
    if (!childLoading && !child) navigate({ to: "/setup", replace: true });
  }, [childLoading, child, navigate]);

  const statuses: Record<string, ChecklistStatus> = {};
  for (const row of checklist ?? []) statuses[row.item_id] = row.status;

  const score = readinessScore(statuses);
  const label = readinessLabel(score);
  const doneActivities = (activityRows ?? []).filter((a) => a.done).length;
  const today = new Date().toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell>
      <div className="print:hidden">
        <ScreenHeader eyebrow="Ready to share" title="Readiness report" />
      </div>

      <div className="print:hidden">
        <button
          onClick={() => window.print()}
          className="w-full rounded-xl bg-foreground py-3.5 text-center text-[14px] font-semibold text-background transition active:scale-[0.99]"
        >
          Download / print report
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Opens your browser's print dialog — choose "Save as PDF" to download.
        </p>
      </div>

      <div id="report-print-area" className="flex flex-col gap-4">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
            Grade R Ready · {today}
          </p>
          <h1 className="mt-2 font-display text-xl font-extrabold tracking-tight">
            {child?.name ?? "Your child"}'s readiness report
          </h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {child?.age ?? "—"} years old
            {child?.school ? ` · ${child.school}` : ""}
          </p>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-background/60 p-4 ring-1 ring-line">
            <div>
              <p className="font-display text-2xl font-extrabold">{score}%</p>
              <p className="text-[11px] text-muted-foreground">overall readiness score</p>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold ${
                label === "Ready"
                  ? "bg-aloe-soft text-aloe"
                  : label === "Developing"
                    ? "bg-sungold-soft text-foreground"
                    : "bg-ochre-soft text-ochre"
              }`}
            >
              {label}
            </span>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            {doneActivities} home activities completed this term.
          </p>
        </Card>

        {CATEGORIES.map((category) => (
          <Card key={category.id} className="!p-4">
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 rounded-full bg-${category.tone}`} />
              <p className="font-display text-[13px] font-bold">{category.name}</p>
            </div>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {category.items.map((item) => {
                const status = statuses[item.id] ?? "not_started";
                return (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="text-foreground">{item.label}</span>
                    <span
                      className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] ${
                        status === "mastered"
                          ? "text-aloe"
                          : status === "developing"
                            ? "text-ochre"
                            : "text-muted-foreground"
                      }`}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}

        <p className="px-1 text-center text-[11px] text-muted-foreground">
          Generated with Grade R Ready. This report reflects a parent's own observations and is not
          a formal assessment.
        </p>
      </div>
    </AppShell>
  );
}
