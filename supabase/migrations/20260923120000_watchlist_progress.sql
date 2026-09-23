-- "Extra Things to Watch" — an optional, unscored watch-list separate from
-- the graded readiness checklist (checklist_progress). Tracks which items a
-- parent has ticked, per child, so the state persists across visits. Never
-- read by readinessScore()/readinessKey().
CREATE TABLE public.watchlist_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL,
  item_id text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (child_id, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlist_progress TO authenticated;
GRANT ALL ON public.watchlist_progress TO service_role;
ALTER TABLE public.watchlist_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own watchlist all" ON public.watchlist_progress FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);
