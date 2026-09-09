import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useChild, useSaveChild } from "@/lib/child-data";

export const Route = createFileRoute("/_authenticated/setup")({
  head: () => ({
    meta: [
      { title: "Add your child — Grade R Ready" },
      { name: "description", content: "Add your Grade R child's name, age and school to begin." },
      { property: "og:title", content: "Add your child — Grade R Ready" },
      { property: "og:description", content: "Set up your Grade R child's readiness profile." },
    ],
  }),
  component: Setup,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please add your child's name").max(60),
  age: z.number().int().min(4, "Grade R learners are usually 5 or 6").max(7),
  school: z.string().trim().max(100),
});

function Setup() {
  const navigate = useNavigate();
  const { data: child } = useChild();
  const save = useSaveChild();
  const [name, setName] = useState("");
  const [age, setAge] = useState("5");
  const [school, setSchool] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setAge(String(child.age ?? 5));
      setSchool(child.school ?? "");
    }
  }, [child]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ name, age: Number(age), school });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details");
      return;
    }
    try {
      await save.mutateAsync({ id: child?.id, ...parsed.data });
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setError("We couldn't save that. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden px-5 pt-8 pb-10">
        <div className="pointer-events-none absolute -top-8 -left-12 h-72 w-72 rounded-full bg-sungold/40 blur-3xl" />
        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">
            Child profile
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-balance">
            {child ? "Update your child's details" : "Tell us about your Grade R child"}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Just three quick things so the checklist feels personal.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">Child's first name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="e.g. Thando"
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">Age</span>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              >
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold">School or crèche (optional)</span>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                maxLength={100}
                placeholder="e.g. Sunnyside Primary"
                className="rounded-xl bg-surface/80 px-4 py-3 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-ochre-soft px-4 py-3 text-[13px] text-foreground">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={save.isPending}
              className="mt-2 rounded-xl bg-foreground py-3.5 text-[14px] font-semibold text-background transition active:scale-[0.99] disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Continue to my dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
