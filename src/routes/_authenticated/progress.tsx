import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress tracker — Grade R Ready" },
      {
        name: "description",
        content:
          "Watch your Grade R child's readiness grow week by week, skill area by skill area.",
      },
      { property: "og:title", content: "Progress tracker — Grade R Ready" },
      {
        property: "og:description",
        content: "Skill areas, weekly activities and recent updates in one simple view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

const TONE_BAR: Record<string, string> = {
  sungold: "bg-sungold",
  aloe: "bg-aloe",
  ochre: "bg-ochre",
};

function ProgressPage() {
  const navigate = useNavigate();
  const { data: child, isLoading } = useChild();
  const { data: checklist } = useChecklist(child?.id);
  const { data: activityRows } = useActivities(child?.id);

  useEffect(() => {
    if (!isLoading && !child) navigate({ to: "/setup", replace: true });
  }, [isLoading, child, navigate]);

  const statuses: Record<string, ChecklistStatus> = {};
  for (const row of checklist ?? []) statuses[row.item_id] = row.status;

  const score = readinessScore(statuses);
  const label = readinessLabel(score);
  const mastered = Object.values(statuses).filter((s) => s === "mastered").length;
  const developing = Object.values(statuses).filter((s) => s === "developing").length;
  const notStarted = TOTAL_ITEMS - mastered - developing;

  const doneIds = new Set((activityRows ?? []).filter((a) => a.done).map((a) => a.activity_id));
  const activitiesDone = doneIds.size;
  const week = currentWeek(child?.created_at);

  const updates = [...(checklist ?? []), ...(activityRows ?? [])]
    .filter((r) => !!r.updated_at)
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    .slice(0, 6);

  function describe(row: (typeof updates)[number]) {
    if ("item_id" in row) {
      const item = CATEGORIES.flatMap((c) => c.items).find((i) => i.id === row.item_id);
      return {
        title: item?.label ?? "Checklist skill",
        detail: row.status === "mastered" ? "Marked as mastered" : "Marked as developing",
      };
    }
    const activity = WEEKS.flatMap((w) => w.activities).find((a) => a.id === row.activity_id);
    return {
      title: activity?.title ?? "Home activity",
      detail: row.done ? "Activity completed" : "Activity updated",
    };
  }

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Progress tracker"
        title={`${child?.name ?? "Your child"}'s journey`}
        right={
          <span className="shrink-0 rounded-full bg-surface/70 px-3 py-1.5 font-mono text-[11px] ring-1 ring-line">
            Week {week} of 12
          </span>
        }
      />

      <Card>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
              Readiness score
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold leading-none">{score}%</p>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{label}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Activities done
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold leading-none">
              {activitiesDone}
              <span className="font-mono text-xs text-muted-foreground">/{TOTAL_ACTIVITIES}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-line/70">
          <div
            className="h-full bg-aloe transition-all"
            style={{ width: `${(mastered / TOTAL_ITEMS) * 100}%` }}
          />
          <div
            className="h-full bg-sungold transition-all"
            style={{ width: `${(developing / TOTAL_ITEMS) * 100}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { n: mastered, l: "Mastered", c: "bg-aloe" },
            { n: developing, l: "Developing", c: "bg-sungold" },
            { n: notStarted, l: "Not started", c: "bg-line" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface/60 py-2.5 ring-1 ring-line">
              <p className="font-display text-lg font-extrabold leading-none">{s.n}</p>
              <div className="mt-1.5 flex items-center justify-center gap-1.5">
                <span className={`size-1.5 rounded-full ${s.c}`} />
                <span className="font-mono text-[10px] text-muted-foreground">{s.l}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="px-1 font-display text-[15px] font-bold">By skill area</p>
      <Card className="flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const done = category.items.filter((i) => statuses[i.id] === "mastered").length;
          const dev = category.items.filter((i) => statuses[i.id] === "developing").length;
          const pct = Math.round(((done + dev * 0.5) / category.items.length) * 100);
          return (
            <div key={category.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[13px] font-semibold">{category.name}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{pct}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-line/70">
                <div
                  className={`h-full rounded-full transition-all ${TONE_BAR[category.tone]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {done} mastered · {dev} developing · {category.items.length} skills
              </p>
            </div>
          );
        })}
      </Card>

      <p className="px-1 font-display text-[15px] font-bold">Week by week</p>
      <Card>
        <div className="grid grid-cols-6 gap-2">
          {WEEKS.map((w) => {
            const wDone = w.activities.filter((a) => doneIds.has(a.id)).length;
            const complete = wDone === w.activities.length;
            return (
              <div key={w.week} className="text-center">
                <div
                  className={`grid aspect-square place-items-center rounded-xl font-display text-[13px] font-bold ${
                    complete
                      ? "bg-aloe text-background"
                      : wDone > 0
                        ? "bg-sungold-soft"
                        : w.week === week
                          ? "ring-1 ring-sungold"
                          : "bg-line/60 text-muted-foreground"
                  }`}
                >
                  {w.week}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          Filled blocks are weeks you have worked on at home.
        </p>
      </Card>

      <p className="px-1 font-display text-[15px] font-bold">Recent updates</p>
      <Card className="flex flex-col gap-3">
        {updates.length === 0 && (
          <p className="text-[13px] text-muted-foreground">
            Nothing yet. Tick off a checklist skill or an activity and it will show up here.
          </p>
        )}
        {updates.map((row, i) => {
          const d = describe(row);
          return (
            <div key={i} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{d.title}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{d.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {new Date(row.updated_at).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          );
        })}
      </Card>

      <Link
        to="/report"
        className="rounded-xl bg-foreground py-3 text-center text-[13px] font-semibold text-background transition active:scale-[0.99]"
      >
        See the readiness report
      </Link>
    </AppShell>
  );
}
