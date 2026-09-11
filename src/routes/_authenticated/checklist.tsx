import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import { PhotoAttach } from "@/components/photo-attach";
import { CATEGORIES, type ChecklistStatus } from "@/lib/content";
import { useChecklist, useChild, useSaveChecklistItem } from "@/lib/child-data";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/checklist")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checklist — Grade R Ready" },
      {
        name: "description",
        content: "Tick off what your Grade R child can already do, in five simple skill areas.",
      },
      { property: "og:title", content: "Checklist — Grade R Ready" },
      {
        property: "og:description",
        content: "Five skill areas, from packing away toys to counting to 10.",
      },
    ],
  }),
  component: Checklist,
});

const STATUS_ORDER: ChecklistStatus[] = ["not_started", "developing", "mastered"];
const SHORT_LABEL: Record<ChecklistStatus, string> = {
  not_started: "Not yet",
  developing: "Developing",
  mastered: "Mastered",
};

function Checklist() {
  const navigate = useNavigate();
  const { category: categoryParam } = Route.useSearch();
  const { data: child, isLoading: childLoading } = useChild();
  const { data: checklist } = useChecklist(child?.id);
  const saveItem = useSaveChecklistItem(child?.id);
  const [openNoteFor, setOpenNoteFor] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (!childLoading && !child) navigate({ to: "/setup", replace: true });
  }, [childLoading, child, navigate]);

  const statuses: Record<string, ChecklistStatus> = {};
  const notes: Record<string, string | null> = {};
  const photos: Record<string, string | null> = {};
  for (const row of checklist ?? []) {
    statuses[row.item_id] = row.status;
    notes[row.item_id] = row.note;
    photos[row.item_id] = row.photo_path;
  }

  const categories = categoryParam ? CATEGORIES.filter((c) => c.id === categoryParam) : CATEGORIES;

  function setStatus(itemId: string, status: ChecklistStatus) {
    saveItem.mutate({ itemId, status });
  }

  function openNote(itemId: string) {
    setOpenNoteFor(itemId);
    setNoteDraft(notes[itemId] ?? "");
  }

  function saveNote(itemId: string) {
    saveItem.mutate({ itemId, note: noteDraft.trim() ? noteDraft.trim() : null });
    setOpenNoteFor(null);
  }

  return (
    <AppShell>
      <ScreenHeader
        eyebrow={categoryParam ? "One skill area" : "All skill areas"}
        title="Checklist"
      />

      {categoryParam && (
        <button
          onClick={() => navigate({ to: "/checklist", search: {} })}
          className="self-start rounded-full bg-surface/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground ring-1 ring-line"
        >
          ‹ Show all categories
        </button>
      )}

      <p className="px-1 text-[12px] text-muted-foreground">
        Tap Not yet, Developing or Mastered for each skill. Tap the note icon to add a quick note.
      </p>

      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="!p-4">
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 rounded-full bg-${category.tone}`} />
              <p className="font-display text-[14px] font-bold">{category.name}</p>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {category.items.map((item) => {
                const status = statuses[item.id] ?? "not_started";
                const hasNote = !!notes[item.id];
                return (
                  <div key={item.id} className="rounded-2xl bg-background/60 p-3 ring-1 ring-line">
                    <div className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-snug">
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{item.hint}</span>
                      </span>
                      <button
                        onClick={() => openNote(item.id)}
                        className={`shrink-0 rounded-full px-2 py-1 font-mono text-[10px] ${
                          hasNote
                            ? "bg-sungold-soft text-foreground"
                            : "bg-transparent text-muted-foreground"
                        }`}
                      >
                        note
                      </button>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      {STATUS_ORDER.map((s) => {
                        const active = status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setStatus(item.id, s)}
                            className={`rounded-lg py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.03em] transition ${
                              active
                                ? s === "mastered"
                                  ? `bg-${category.tone} text-background`
                                  : s === "developing"
                                    ? `bg-${category.tone}-soft text-foreground ring-1 ring-${category.tone}`
                                    : "bg-foreground text-background"
                                : "bg-surface/70 text-muted-foreground ring-1 ring-line"
                            }`}
                          >
                            {SHORT_LABEL[s]}
                          </button>
                        );
                      })}
                    </div>

                    {hasNote && openNoteFor !== item.id && (
                      <p className="mt-2 truncate text-[11px] text-muted-foreground italic">
                        “{notes[item.id]}”
                      </p>
                    )}

                    {openNoteFor === item.id && (
                      <div className="mt-2.5 flex flex-col gap-2">
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          maxLength={280}
                          rows={2}
                          placeholder="e.g. Getting better at this with practice"
                          className="rounded-xl bg-surface/80 px-3 py-2 text-[13px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveNote(item.id)}
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

                    <PhotoAttach
                      className="mt-2"
                      photoPath={photos[item.id]}
                      onUploaded={(path) => saveItem.mutate({ itemId: item.id, photoPath: path })}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
