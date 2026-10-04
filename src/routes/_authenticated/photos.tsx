import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, Card, ScreenHeader } from "@/components/app-shell";
import { PhotoCard, usePhotoEntries } from "@/components/photo-gallery";
import { useChild } from "@/lib/child-data";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

export const Route = createFileRoute("/_authenticated/photos")({
  head: () => ({
    meta: [
      { title: "Photo gallery — Grade R Ready" },
      {
        name: "description",
        content: "All the photos you've added while working through Grade R Ready.",
      },
    ],
  }),
  component: PhotosPage,
});

function PhotosPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { data: child, isLoading } = useChild();
  const entries = usePhotoEntries(child?.id);

  useEffect(() => {
    document.title = t("title.photos", lang);
  }, [lang]);

  useEffect(() => {
    if (!isLoading && !child) navigate({ to: "/setup", replace: true });
  }, [isLoading, child, navigate]);

  return (
    <AppShell>
      <ScreenHeader
        eyebrow={t("photos.eyebrow", lang)}
        title={t("photos.title", lang, { name: child?.name ?? t("dashboard.fallbackName", lang) })}
      />

      {entries.length === 0 ? (
        <Card>
          <p className="text-[13px] text-muted-foreground">{t("photos.empty", lang)}</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 print:gap-4">
            {entries.map((entry) => (
              <PhotoCard key={entry.key} entry={entry} />
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-foreground py-3 text-[13px] font-semibold text-background transition active:scale-[0.99] print:hidden"
          >
            {t("photos.print", lang)}
          </button>
        </>
      )}
    </AppShell>
  );
}
