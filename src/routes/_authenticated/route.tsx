import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { resolveAccess } from "@/lib/child-data";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const { data: access } = await supabase
      .from("account_access")
      .select("status,access_until")
      .eq("id", data.user.id)
      .maybeSingle();
    if (resolveAccess(access) !== "approved") throw redirect({ to: "/pending" });

    return { user: data.user };
  },
  component: () => <Outlet />,
});
