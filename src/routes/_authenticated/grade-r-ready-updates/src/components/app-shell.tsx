import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Home" },
  { to: "/checklist", label: "Checklist" },
  { to: "/activities", label: "Activities" },
  { to: "/progress", label: "Progress" },
  { to: "/report", label: "Report" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-sungold/30">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-16 h-64 w-64 rounded-full bg-aloe/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-40 -left-10 h-56 w-56 rounded-full bg-ochre/30 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col gap-4 px-4 pt-5 pb-28">{children}</div>

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
