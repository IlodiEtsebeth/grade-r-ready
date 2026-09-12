import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccessStatus } from "@/lib/child-data";
import logoIcon from "@/assets/logo-icon-only.png";

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
  const { data: status, isLoading } = useAccessStatus();

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
            <p className="mt-6 text-[13px] text-muted-foreground">Checking your account…</p>
          ) : status === "removed" ? (
            <>
              <h1 className="mt-6 font-display text-xl font-extrabold tracking-tight text-balance">
                Access removed
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Your access to Grade R Ready has been removed. If you think this is a mistake,
                please contact Piece of Play directly.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-xl font-extrabold tracking-tight text-balance">
                You're on the list!
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Your account is being reviewed. This is usually quick — you'll get access as soon as
                it's confirmed, no need to sign up again.
              </p>
            </>
          )}

          <button
            onClick={signOut}
            className="mt-8 rounded-xl bg-surface/70 px-5 py-2.5 text-[13px] font-semibold text-muted-foreground ring-1 ring-line"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
