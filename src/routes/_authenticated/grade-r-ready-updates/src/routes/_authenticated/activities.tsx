import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import { WEEKS, currentWeek } from "@/lib/content";
import { useActivities, useChild, useSaveActivity } from "@/lib/child-data";

export const Route = createFileRoute("/_authenticated/activities")({
  head: () => ({
    meta: [
      { title: "This week's activities — Grade R Ready" },
      {
        name: "description",
        content: "12 weeks of short, practical home activities to build Grade 1 readiness.",
      },
      { property: "og:title", content: "This week's activities — Grade R Ready" },
      {
        property: "og:description",
        content: "10 to 15 minutes a day, using things you already have at home.",
      },
    ],
  }),
  component: Activities,
});

function Activities() {
  const navigate = useNavigate();
  const { data: child, isLoading: childLoading } = useChild();
  const { data: activityRows } = useActivities(child?.id);
  const saveActivity = useSaveActivity(child?.id);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [openNoteFor, setOpenNoteFor] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (!childLoading && !child) navigate({ to: "/setup", replace: true });
  }, [childLoading, child, navigate]);

  const suggestedWeek = currentWeek(child?.created_at);
  const week = selectedWeek ?? suggestedWeek;
  const weekPlan = WEEKS[week - 1]!;

  const doneMap: Record<string, boolean> = {};
  const notes: Record<string, string | null> = {};
  for (const row of activityRows ?? []) {
    doneMap[row.activity_id] = row.done;
    notes[row.activity_id] = row.note;
  }

  function toggleDone(activityId: string) {
    saveActivity.mutate({ activityId, done: !doneMap[activityId] });
  }

  function openNote(activityId: string) {
    setOpenNoteFor(activityId);
    setNoteDraft(notes[activityId] ?? "");
  }

  function saveNote(activityId: string) {
    saveActivity.mutate({ activityId, note: noteDraft.trim() ? noteDraft.trim() : null });
    setOpenNoteFor(null);
  }

  return (
    <AppShell>
      <ScreenHeader eyebrow={`Week ${week} of 12`} title={weekPlan.theme} />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {WEEKS.map((w) => {
          const active = w.week === week;
          return (
            <button
              key={w.week}
              onClick={() => setSelectedWeek(w.week)}
              className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] font-semibold ${
                active
                  ? "bg-foreground text-background"
                  : "bg-surface/70 text-muted-foreground ring-1 ring-line"
              }`}
            >
              Wk {w.week}
              {w.week === suggestedWeek && !active ? " •" : ""}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {weekPlan.activities.map((activity) => {
          const done = !!doneMap[activity.id];
          const hasNote = !!notes[activity.id];
          return (
            <Card key={activity.id} className="!p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ochre">
                    {activity.skill} · {activity.minutes} min
                  </span>
                  <p className="mt-1 font-display text-[14px] font-bold leading-snug">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>
                <button
                  onClick={() => toggleDone(activity.id)}
                  className={`grid size-9 shrink-0 place-items-center rounded-full ring-1 transition ${
                    done ? "bg-aloe ring-aloe" : "bg-transparent ring-line"
                  }`}
                >
                  {done && <span className="text-[13px] font-bold text-background">✓</span>}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => openNote(activity.id)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${
                    hasNote
                      ? "bg-sungold-soft text-foreground"
                      : "bg-surface/70 text-muted-foreground ring-1 ring-line"
                  }`}
                >
                  {hasNote ? "edit note" : "+ add note"}
                </button>
                {hasNote && openNoteFor !== activity.id && (
                  <span className="truncate pl-3 text-[11px] text-muted-foreground italic">
                    “{notes[activity.id]}”
                  </span>
                )}
              </div>

              {openNoteFor === activity.id && (
                <div className="mt-2.5 flex flex-col gap-2">
                  <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    maxLength={280}
                    rows={2}
                    placeholder="How did it go?"
                    className="rounded-xl bg-surface/80 px-3 py-2 text-[13px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveNote(activity.id)}
                      className="flex-1 rounded-lg bg-foreground py-2 text-[12px] font-semibold text-background"
                    >
                      Save note
                    </button>
                    <button
                      onClick={() => setOpenNoteFor(null)}
                      className="rounded-lg bg-surface/70 px-3 py-2 text-[12px] font-semibold text-muted-foreground ring-1 ring-line"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
