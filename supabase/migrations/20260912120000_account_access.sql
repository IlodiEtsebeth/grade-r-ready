-- Manual access control: every new parent starts "pending" and can only be
-- moved to "approved" (or "removed") by you, directly in the Supabase table
-- editor. There is deliberately no UPDATE/INSERT policy for the
-- "authenticated" role, so a signed-in parent can never change their own
-- status — only SELECT (to read their own status) is granted to them.
CREATE TABLE public.account_access (
  id uuid PRIMARY KEY,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'removed')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.account_access TO authenticated;
GRANT ALL ON public.account_access TO service_role;
ALTER TABLE public.account_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own access select" ON public.account_access FOR SELECT TO authenticated USING (auth.uid() = id);

-- Give every existing parent a row too, so nobody is left without one.
INSERT INTO public.account_access (id, status)
SELECT id, 'pending' FROM public.profiles
ON CONFLICT (id) DO NOTHING;

-- Extend the existing new-user trigger to also create the access row.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.account_access (id, status)
  VALUES (NEW.id, 'pending')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
