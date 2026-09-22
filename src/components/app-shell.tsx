import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logoIcon from "@/assets/logo-icon-only.png";
import { useLanguage } from "@/lib/language";
import { t } from "@/lib/ui-strings";

function useNav() {
  const { lang } = useLanguage();
  return [
    { to: "/dashboard", label: t("nav.home", lang) },
    { to: "/checklist", label: t("nav.checklist", lang) },
    { to: "/activities", label: t("nav.activities", lang) },
    { to: "/progress", label: t("nav.progress", lang) },
    { to: "/report", label: t("nav.report", lang) },
  ] as const;
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-surface/70 p-0.5 ring-1 ring-line">
      {(["en", "af"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`rounded-full px-2 py-1 font-mono text-[10px] font-semibold uppercase transition ${
            lang === code ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const NAV = useNav();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-sungold/30">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-16 h-64 w-64 rounded-full bg-aloe/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-40 -left-10 h-56 w-56 rounded-full bg-ochre/30 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col gap-4 px-4 pt-5 pb-28">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src={logoIcon} alt="" className="size-7 shrink-0 object-contain" />
              <span className="font-display text-[12px] font-bold tracking-tight text-muted-foreground">
                Grade R Ready
              </span>
            </div>
            <LanguageToggle />
          </div>
          {children}
        </div>

        <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[440px] -translate-x-1/2 border-t border-line bg-surface/80 px-4 pt-2.5 pb-5 backdrop-blur-xl print:hidden">
          <div className="flex items-center justify-between">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1 transition active:scale-95"
                >
                  <span
                    className={`grid size-9 place-items-center rounded-full ${
                      active ? "bg-sungold-soft" : "bg-line/60"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full ${active ? "bg-sungold" : "bg-foreground/30"}`}
                    />
                  </span>
                  <span
                    className={`text-[10px] ${
                      active ? "font-semibold text-sungold" : "font-medium text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">{eyebrow}</p>
        <h1 className="mt-1 truncate font-display text-xl font-extrabold tracking-tight">
          {title}
        </h1>
      </div>
      {right}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl bg-surface/70 p-5 ring-1 ring-line backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}
