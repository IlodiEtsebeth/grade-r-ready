import { createFileRoute, Link } from "@tanstack/react-router";
import logoIcon from "@/assets/logo-icon-only.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grade R Ready — Is your child ready for Grade 1?" },
      {
        name: "description",
        content:
          "A simple checklist, weekly home activities and a readiness report for South African parents of Grade R learners.",
      },
      { property: "og:title", content: "Grade R Ready — Is your child ready for Grade 1?" },
      {
        property: "og:description",
        content:
          "Track your Grade R child's readiness for Grade 1 with a parent-friendly checklist and 12 weeks of 10-minute home activities.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden px-5 pt-10 pb-10">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="pointer-events-none absolute top-52 -right-16 h-64 w-64 rounded-full bg-aloe/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 -left-10 h-56 w-56 rounded-full bg-ochre/30 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center gap-2.5">
            <img src={logoIcon} alt="Piece of Play" className="size-11 shrink-0 object-contain" />
            <div>
              <p className="font-display text-[15px] font-bold leading-none">Grade R Ready</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                For parents · South Africa
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
              Ready by December
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance">
              Know if your child is ready for Grade 1
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Tick off what your Grade R child can already do, follow 12 weeks of short home
              activities, and get a readiness report you can share with the school.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="rounded-2xl bg-surface/70 p-4 ring-1 ring-line backdrop-blur-md">
              <p className="font-display text-[14px] font-bold">A checklist in plain language</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Five skill areas, from packing away toys to counting to 10.
              </p>
            </div>
            <div className="rounded-2xl bg-surface/70 p-4 ring-1 ring-line backdrop-blur-md">
              <p className="font-display text-[14px] font-bold">10 minutes a day at home</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Reading, counting, cutting and rhyming games with things you already have.
              </p>
            </div>
            <div className="rounded-2xl bg-surface/70 p-4 ring-1 ring-line backdrop-blur-md">
              <p className="font-display text-[14px] font-bold">One clear answer</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Needs support, Developing or Ready — with what to practise next.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <Link
              to="/auth"
              className="block w-full rounded-xl bg-foreground py-3.5 text-center text-[14px] font-semibold text-background transition active:scale-[0.99]"
            >
              Start my child's checklist
            </Link>
            <p className="mt-3 text-center text-[12px] text-muted-foreground">
              Free · one Grade R child per account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
