import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card } from "@/components/app-shell";
import { InstallAppCard } from "@/components/install-app-card";
import {
  CATEGORIES,
  TOTAL_ITEMS,
  WEEKS,
  currentWeek,
  readinessLabel,
  readinessScore,
  type ChecklistStatus,
} from "@/lib/content";
import { useActivities, useChecklist, useChild } from "@/lib/child-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My dashboard — Grade R Ready" },
      {
        name: "description",
        content:
          "See your Grade R child's readiness summary, checklist progress and this week's activities.",
      },
      { property: "og:title", content: "My dashboard — Grade R Ready" },
      {
        property: "og:description",
        content: "Readiness summary, checklist progress and weekly home activities in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
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

  const week = currentWeek(child?.created_at);
  const weekPlan = WEEKS[week - 1]!;
  const doneIds = new Set((activityRows ?? []).filter((a) => a.done).map((a) => a.activity_id));
  const weekDone = weekPlan.activities.filter((a) => doneIds.has(a.id)).length;

  const dash = 283;
  const offset = dash - (dash * score) / 100;

  return (
    <AppShell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-sungold shadow-sm shadow-sungold/30">
            <span className="font-display text-lg font-extrabold">
              {(child?.name ?? "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-bold leading-none">
              {child?.name ?? "Your child"}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Grade R · {child?.age ?? 5} years
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 ring-1 ring-line backdrop-blur-md">
          <span
            className={`size-2 rounded-full ${
              label === "Ready" ? "bg-aloe" : label === "Developing" ? "bg-sungold" : "bg-ochre"
            }`}
          />
          <span className="font-mono text-[11px] font-medium">{label}</span>
        </div>
      </header>

      <InstallAppCard />

      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
              Readiness check
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-balance">
              {label === "Ready"
                ? `${child?.name ?? "Your child"} is on track for Grade 1`
                : label === "Developing"
                  ? `${child?.name ?? "Your child"} is getting there`
                  : `${child?.name ?? "Your child"} needs a bit more practice`}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {mastered} of {TOTAL_ITEMS} skills mastered so far.
            </p>
          </div>
          <div className="relative grid size-24 shrink-0 place-items-center">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--line)" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--sungold)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1s var(--ease-soft)" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center leading-none">
                <span className="font-display text-2xl font-extrabold">{score}</span>
                <span className="font-mono text-[10px] text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-sungold-soft/70 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sungold font-display text-[10px] font-bold">
                {week}
              </span>
              <span className="truncate text-[13px] font-semibold">This week at home</span>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {weekDone}/{weekPlan.activities.length} done
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface/70">
            <div
              className="h-full rounded-full bg-sungold transition-all"
              style={{ width: `${(weekDone / weekPlan.activities.length) * 100}%` }}
            />
          </div>
          <Link
            to="/activities"
            className="mt-3 block w-full rounded-xl bg-foreground py-2.5 text-center text-[13px] font-semibold text-background transition active:scale-[0.99]"
          >
            Open this week's activities
          </Link>
        </div>
      </Card>

      <div className="flex items-center justify-between px-1">
        <p className="font-display text-[15px] font-bold">Checklist</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {mastered} mastered · {developing} developing
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {CATEGORIES.map((category) => {
          const done = category.items.filter((i) => statuses[i.id] === "mastered").length;
          return (
            <Link
              key={category.id}
              to="/checklist"
              search={{ category: category.id }}
              className="flex items-center justify-between rounded-2xl bg-surface/70 p-4 ring-1 ring-line backdrop-blur-md transition active:bg-surface"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl bg-${category.tone}-soft`}
                >
                  <span className={`size-3.5 rounded-full bg-${category.tone}`} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-[14px] font-bold leading-tight">
                    {category.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {done} of {category.items.length} mastered
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground">›</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/", replace: true });
        }}
        className="mt-2 rounded-xl bg-surface/70 py-3 text-[13px] font-semibold text-muted-foreground ring-1 ring-line"
      >
        Sign out
      </button>
    </AppShell>
  );
}
