import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import {
  CATEGORIES,
  WEEKS,
  currentWeek,
  readinessLabel,
  readinessScore,
  TOTAL_ACTIVITIES,
  type ChecklistStatus,
} from "@/lib/content";
import { useActivities, useChecklist, useChild } from "@/lib/child-data";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Grade R Ready" },
      {
        name: "description",
        content: "See readiness progress by skill area and how many weekly activities are done.",
      },
      { property: "og:title", content: "Progress — Grade R Ready" },
      {
        property: "og:description",
        content: "A skill-by-skill breakdown of your child's Grade 1 readiness.",
      },
    ],
  }),
  component: Progress,
});

function categoryScore(statuses: Record<string, ChecklistStatus>, items: { id: string }[]) {
  let points = 0;
  for (const item of items) {
    const s = statuses[item.id];
    if (s === "mastered") points += 1;
    else if (s === "developing") points += 0.5;
  }
  return Math.round((points / items.length) * 100);
}

function Progress() {
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
  const week = currentWeek(child?.created_at);
  const weeksReached = Math.min(week, 12);
  const activitiesSoFar = WEEKS.slice(0, weeksReached).flatMap((w) => w.activities).length;

  return (
    <AppShell>
      <ScreenHeader eyebrow="Since you started" title="Progress overview" />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
              Overall readiness
            </p>
            <p className="mt-2 font-display text-3xl font-extrabold">{score}%</p>
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
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-background/60 p-3 ring-1 ring-line">
            <p className="font-display text-lg font-extrabold">
              Week {week}
              <span className="text-muted-foreground"> / 12</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">of the school-readiness plan</p>
          </div>
          <div className="rounded-2xl bg-background/60 p-3 ring-1 ring-line">
            <p className="font-display text-lg font-extrabold">
              {doneActivities}
              <span className="text-muted-foreground"> / {TOTAL_ACTIVITIES}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">activities completed</p>
          </div>
        </div>
        {activitiesSoFar > 0 && (
          <p className="mt-3 text-[12px] text-muted-foreground">
            {doneActivities} of {activitiesSoFar} activities done for the weeks reached so far.
          </p>
        )}
      </Card>

      <div className="flex items-center justify-between px-1">
        <p className="font-display text-[15px] font-bold">By skill area</p>
      </div>

      <div className="flex flex-col gap-3">
        {CATEGORIES.map((category) => {
          const catScore = categoryScore(statuses, category.items);
          const mastered = category.items.filter((i) => statuses[i.id] === "mastered").length;
          return (
            <Card key={category.id} className="!p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`size-2.5 rounded-full bg-${category.tone}`} />
                  <p className="font-display text-[13px] font-bold">{category.name}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {mastered}/{category.items.length} mastered
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-background/60">
                <div
                  className={`h-full rounded-full bg-${category.tone} transition-all`}
                  style={{ width: `${catScore}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
