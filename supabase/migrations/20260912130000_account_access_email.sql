-- Add email directly to account_access so it can be identified at a glance
-- in the table editor, without cross-referencing the Users tab by ID.
ALTER TABLE public.account_access ADD COLUMN email text;

-- Backfill existing rows from auth.users.
UPDATE public.account_access AS aa
SET email = u.email
FROM auth.users AS u
WHERE aa.id = u.id;

-- Keep new sign-ups populated automatically.
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

  INSERT INTO public.account_access (id, status, email)
  VALUES (NEW.id, 'pending', NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;
