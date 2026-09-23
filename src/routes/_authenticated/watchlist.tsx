import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import {
  WATCHLIST,
  WATCHLIST_NUDGE_THRESHOLD,
  WATCHLIST_SECTION,
  watchlistGroupItemIds,
  type WatchlistItem,
} from "@/lib/content";
import { useChild, useSaveWatchlistItem, useWatchlist } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

export const Route = createFileRoute("/_authenticated/watchlist")({
  head: () => ({
    meta: [
      { title: "Extra Things to Watch — Grade R Ready" },
      {
        name: "description",
        content:
          "Optional signs worth mentioning to your child's teacher - separate from the readiness checklist, not a diagnosis.",
      },
      { property: "og:title", content: "Extra Things to Watch — Grade R Ready" },
      {
        property: "og:description",
        content:
          "A few more things Grade R teachers keep an eye on, kept apart from the graded checklist.",
      },
    ],
  }),
  component: Watchlist,
});

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Watchlist() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { data: child, isLoading: childLoading } = useChild();
  const { data: rows } = useWatchlist(child?.id);
  const saveItem = useSaveWatchlistItem(child?.id);

  useEffect(() => {
    document.title = t("title.watchlist", lang);
  }, [lang]);

  useEffect(() => {
    if (!childLoading && !child) navigate({ to: "/setup", replace: true });
  }, [childLoading, child, navigate]);

  const checked: Record<string, boolean> = {};
  for (const row of rows ?? []) checked[row.item_id] = row.checked;

  function toggle(itemId: string) {
    saveItem.mutate({ itemId, checked: !checked[itemId] });
  }

  function renderItem(item: WatchlistItem) {
    const isChecked = !!checked[item.id];
    return (
      <button
        key={item.id}
        onClick={() => toggle(item.id)}
        aria-pressed={isChecked}
        className="flex w-full items-start gap-3 rounded-2xl bg-background/60 p-3 text-left ring-1 ring-line transition active:scale-[0.99]"
      >
        <span
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ring-1 transition ${
            isChecked
              ? "bg-sungold text-background ring-sungold"
              : "bg-transparent text-transparent ring-line"
          }`}
        >
          <CheckIcon />
        </span>
        <span className="text-[13px] leading-snug">{item.label[lang]}</span>
      </button>
    );
  }

  return (
    <AppShell>
      <ScreenHeader eyebrow={t("watchlist.eyebrow", lang)} title={WATCHLIST_SECTION.title[lang]} />

      <p className="px-1 text-[12px] leading-relaxed text-muted-foreground">
        {WATCHLIST_SECTION.intro[lang]}
      </p>

      <div className="flex flex-col gap-4">
        {WATCHLIST.map((group) => {
          const groupItemIds = watchlistGroupItemIds(group);
          const groupDone = groupItemIds.filter((id) => checked[id]).length;
          const showNudge = groupDone >= WATCHLIST_NUDGE_THRESHOLD;

          return (
            <Card key={group.id} className="!p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-[14px] font-bold">{group.title[lang]}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {groupDone}/{groupItemIds.length}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                {group.subgroups
                  ? group.subgroups.map((subgroup) => (
                      <div key={subgroup.id} className="flex flex-col gap-2">
                        <p className="px-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          {subgroup.title[lang]}
                        </p>
                        {subgroup.items.map(renderItem)}
                      </div>
                    ))
                  : (group.items ?? []).map(renderItem)}
              </div>

              {showNudge && (
                <div className="mt-3.5 rounded-2xl bg-sungold-soft/70 p-3.5">
                  <p className="text-[12px] leading-relaxed">{group.nudge[lang]}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
