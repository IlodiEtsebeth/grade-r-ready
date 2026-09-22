-- Language preference per parent account, chosen at sign-up and changeable
-- later from the app. Drives which language the whole app displays in.
ALTER TABLE public.profiles
  ADD COLUMN language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'af'));

-- Let a signed-in parent update just their own language preference.
-- (The existing "own profile update" policy already covers this, but we
-- keep this comment here as documentation of intent.)

-- Populate language from sign-up metadata going forward.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.account_access (id, status, email)
  VALUES (NEW.id, 'pending', NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;
