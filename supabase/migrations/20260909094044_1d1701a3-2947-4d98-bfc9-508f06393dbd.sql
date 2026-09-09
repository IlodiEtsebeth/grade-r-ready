-- Parent profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

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
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Children (Grade R learner)
CREATE TABLE public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  name text NOT NULL,
  birth_date date,
  age int,
  school text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own children all" ON public.children FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Checklist progress
CREATE TABLE public.checklist_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL,
  item_id text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  note text,
  photo_path text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist_progress TO authenticated;
GRANT ALL ON public.checklist_progress TO service_role;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own checklist all" ON public.checklist_progress FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Weekly activity progress
CREATE TABLE public.activity_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL,
  activity_id text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  note text,
  photo_path text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, activity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_progress TO authenticated;
GRANT ALL ON public.activity_progress TO service_role;
ALTER TABLE public.activity_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activity all" ON public.activity_progress FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);