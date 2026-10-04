import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccessStatus } from "@/lib/child-data";
import logoIcon from "@/assets/logo-icon-only.png";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

export const Route = createFileRoute("/pending")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Almost there — Grade R Ready" },
      { name: "description", content: "Your Grade R Ready account access." },
    ],
  }),
  component: Pending,
});

function Pending() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { data: status, isLoading } = useAccessStatus();

  useEffect(() => {
    document.title = t("title.pending", lang);
  }, [lang]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate({ to: "/auth", replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    if (status === "approved") navigate({ to: "/dashboard", replace: true });
  }, [status, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 -right-16 h-64 w-64 rounded-full bg-aloe/30 blur-3xl" />

        <div className="relative z-10">
          <img src={logoIcon} alt="Piece of Play" className="mx-auto size-16 object-contain" />

          {isLoading ? (
            <p className="mt-6 text-[13px] text-muted-foreground">{t("pending.checking", lang)}</p>
          ) : status === "trial_ended" ? (
            <>
              <h1 className="mt-6 font-display text-xl font-extrabold tracking-tight text-balance">
                {t("pending.trialEnded.heading", lang)}
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {t("pending.trialEnded.body", lang)}
              </p>
            </>
          ) : status === "removed" ? (
            <>
              <h1 className="mt-6 font-display text-xl font-extrabold tracking-tight text-balance">
                {t("pending.removed.heading", lang)}
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {t("pending.removed.body", lang)}
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-xl font-extrabold tracking-tight text-balance">
                {t("pending.waiting.heading", lang)}
              </h1>
              <div className="mt-4 w-full rounded-2xl bg-surface/70 p-4 text-left ring-1 ring-line">
                <p className="text-[13px] font-semibold">
                  {t("pending.waiting.paidHeading", lang)}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {t("pending.waiting.paidBody", lang)}
                </p>
              </div>
              <div className="mt-3 w-full rounded-2xl bg-surface/70 p-4 text-left ring-1 ring-line">
                <p className="text-[13px] font-semibold">
                  {t("pending.waiting.notPaidHeading", lang)}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {t("pending.waiting.notPaidBody", lang)}
                </p>
                <a
                  href="https://pieceofplay.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-xl bg-foreground py-3 text-center text-[13px] font-semibold text-background transition active:scale-[0.99]"
                >
                  {t("pending.buyButton", lang)}
                </a>
              </div>
            </>
          )}

          <button
            onClick={signOut}
            className="mt-8 rounded-xl bg-surface/70 px-5 py-2.5 text-[13px] font-semibold text-muted-foreground ring-1 ring-line"
          >
            {t("pending.signOut", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
