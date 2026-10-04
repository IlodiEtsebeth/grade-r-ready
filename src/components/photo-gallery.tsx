import { CATEGORIES, WEEKS } from "@/lib/content";
import { useActivities, useChecklist, usePhotoUrl } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";
import { PhotoLightbox } from "@/components/photo-lightbox";

export type PhotoEntry = {
  key: string;
  path: string;
  title: string;
  source: string;
  date: string;
};

/** Every photo a parent has added, newest first, with what it belongs to. */
export function usePhotoEntries(childId?: string): PhotoEntry[] {
  const { lang } = useLanguage();
  const { data: checklist } = useChecklist(childId);
  const { data: activities } = useActivities(childId);
  const entries: PhotoEntry[] = [];

  for (const row of checklist ?? []) {
    if (!row.photo_path) continue;
    const category = CATEGORIES.find((c) => c.items.some((i) => i.id === row.item_id));
    const item = category?.items.find((i) => i.id === row.item_id);
    entries.push({
      key: `c-${row.item_id}`,
      path: row.photo_path,
      title: item?.label[lang] ?? t("nav.checklist", lang),
      source: category?.name[lang] ?? t("nav.checklist", lang),
      date: row.updated_at,
    });
  }
  for (const row of activities ?? []) {
    if (!row.photo_path) continue;
    const week = WEEKS.find((w) => w.activities.some((a) => a.id === row.activity_id));
    const activity = week?.activities.find((a) => a.id === row.activity_id);
    entries.push({
      key: `a-${row.activity_id}`,
      path: row.photo_path,
      title: activity?.title[lang] ?? t("nav.activities", lang),
      source: week ? t("photos.weekActivity", lang, { n: week.week }) : t("nav.activities", lang),
      date: row.updated_at,
    });
  }
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Square thumbnail that opens full-screen when tapped. */
export function PhotoTile({ entry }: { entry: PhotoEntry }) {
  const { data: url } = usePhotoUrl(entry.path);
  if (!url) return <div className="aspect-square w-full animate-pulse rounded-xl bg-line/60" />;
  return (
    <PhotoLightbox url={url} caption={entry.title} className="block w-full rounded-xl">
      <img
        src={url}
        alt=""
        className="aspect-square w-full rounded-xl object-cover ring-1 ring-line"
      />
    </PhotoLightbox>
  );
}

/** Larger card with caption, used on the gallery page (and when printing). */
export function PhotoCard({ entry }: { entry: PhotoEntry }) {
  const { lang } = useLanguage();
  const { data: url } = usePhotoUrl(entry.path);
  return (
    <figure className="break-inside-avoid overflow-hidden rounded-2xl bg-surface/70 ring-1 ring-line print:rounded-lg">
      {url ? (
        <PhotoLightbox url={url} caption={entry.title} className="block w-full">
          <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
        </PhotoLightbox>
      ) : (
        <div className="aspect-[4/3] w-full animate-pulse bg-line/60" />
      )}
      <figcaption className="p-2.5">
        <p className="text-[12px] font-semibold leading-snug">{entry.title}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {entry.source} ·{" "}
          {new Date(entry.date).toLocaleDateString(lang === "af" ? "af-ZA" : "en-ZA", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </figcaption>
    </figure>
  );
}
