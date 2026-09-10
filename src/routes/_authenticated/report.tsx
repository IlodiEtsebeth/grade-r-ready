import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import {
  CATEGORIES,
  TOTAL_ACTIVITIES,
  TOTAL_ITEMS,
  WEEKS,
  currentWeek,
  readinessLabel,
  readinessScore,
  type ChecklistStatus,
} from "@/lib/content";
import { useActivities, useChecklist, useChild } from "@/lib/child-data";

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

function ReportPage() {
  const navigate = useNavigate();
  const { data: child, isLoading } = useChild();
  const { data: checklist } = useChecklist(child?.id);
  const { data: activityRows } = useActivities(child?.id);

  useEffect(() => {
    if (!isLoading && !child) navigate({ to: "/setup", replace: true });
  }, [isLoading, child, navigate]);

  const statuses: Record<string, ChecklistStatus> = {};
  const notes: { label: string; note: string }[] = [];
  for (const row of checklist ?? []) {
    statuses[row.item_id] = row.status;
    if (row.note?.trim()) {
      const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === row.item_id);
      notes.push({ label: item?.label ?? "Skill", note: row.note.trim() });
    }
  }

  const score = readinessScore(statuses);
  const label = readinessLabel(score);
  const mastered = Object.values(statuses).filter((s) => s === "mastered").length;
  const developing = Object.values(statuses).filter((s) => s === "developing").length;
  const doneIds = new Set((activityRows ?? []).filter((a) => a.done).map((a) => a.activity_id));
  const week = currentWeek(child?.created_at);

  const allItems = CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.name })));
  const strengths = allItems.filter((i) => statuses[i.id] === "mastered").slice(0, 6);
  const practise = allItems.filter((i) => statuses[i.id] !== "mastered").slice(0, 6);

  const summary =
    label === "Ready"
      ? `${child?.name ?? "Your child"} is showing the skills expected before Grade 1. Keep the routines going and enjoy the last stretch of Grade R.`
      : label === "Developing"
        ? `${child?.name ?? "Your child"} is making good progress. A few skills still need regular practice before Grade 1 starts.`
        : `${child?.name ?? "Your child"} needs more support in several areas. Short daily practice at home will make a big difference before Grade 1.`;

  const today = new Date().toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Readiness report"
        title="Ready for Grade 1?"
        right={
          <button
            onClick={() => window.print()}
            className="shrink-0 rounded-full bg-foreground px-4 py-2 text-[12px] font-semibold text-background transition active:scale-95 print:hidden"
          >
            Download
          </button>
        }
      />

      <div id="report" className="flex flex-col gap-4">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
            Grade 1 readiness summary
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-balance">
            {child?.name ?? "Your child"}
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            Grade R · {child?.age ?? 5} years
            {child?.school ? ` · ${child.school}` : ""} · Report date {today}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sungold-soft/70 p-4">
            <span
              className={`grid size-14 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold ${
                label === "Ready" ? "bg-aloe" : label === "Developing" ? "bg-sungold" : "bg-ochre"
              }`}
            >
              {score}%
            </span>
            <div className="min-w-0">
              <p className="font-display text-[15px] font-bold">{label}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {mastered} of {TOTAL_ITEMS} skills mastered · {developing} developing
              </p>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed">{summary}</p>
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">Skill areas</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {CATEGORIES.map((c) => {
              const done = c.items.filter((i) => statuses[i.id] === "mastered").length;
              const dev = c.items.filter((i) => statuses[i.id] === "developing").length;
              const pct = Math.round(((done + dev * 0.5) / c.items.length) * 100);
              return (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <p className="truncate text-[13px]">{c.name}</p>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {done}/{c.items.length} · {readinessLabel(pct)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">What {child?.name ?? "your child"} can already do</p>
          {strengths.length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">
              Complete the checklist to see strengths here.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {strengths.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-aloe" />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">What still needs practice</p>
          {practise.length === 0 ? (
            <p className="mt-2 text-[13px] text-muted-foreground">
              Everything on the checklist is mastered. Wonderful work.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {practise.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ochre" />
                  <span>
                    {s.label}
                    <span className="text-muted-foreground"> — {s.cat}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="font-display text-[15px] font-bold">Home activities</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {doneIds.size} of {TOTAL_ACTIVITIES} activities completed, currently in week {week} of{" "}
            {WEEKS.length}.
          </p>
        </Card>

        {notes.length > 0 && (
          <Card>
            <p className="font-display text-[15px] font-bold">Your notes</p>
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
          <p className="font-display text-[15px] font-bold">Next steps</p>
          <ul className="mt-3 flex flex-col gap-2 text-[13px]">
            <li>Do the weekly activities together, about 10 to 15 minutes a day.</li>
            <li>Focus on the skills listed under "still needs practice".</li>
            <li>Update the checklist every few weeks so the report stays accurate.</li>
            <li>Share this report with your child's teacher if you have questions.</li>
          </ul>
          <p className="mt-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
            This is a parent guide, not a formal school assessment.
          </p>
        </Card>
      </div>

      <button
        onClick={() => window.print()}
        className="rounded-xl bg-foreground py-3 text-[13px] font-semibold text-background transition active:scale-[0.99] print:hidden"
      >
        Download or print this report
      </button>
    </AppShell>
  );
}
