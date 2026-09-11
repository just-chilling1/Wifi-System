-- Instant Income saved post sets (one per user + label).
-- Run in the shared Supabase project (SQL Editor). Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.instant_income_post_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  affiliate_url text NOT NULL,
  niche text NOT NULL,
  posts jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT instant_income_post_sets_name_not_blank CHECK (length(trim(name)) > 0),
  CONSTRAINT instant_income_post_sets_url_not_blank CHECK (length(trim(affiliate_url)) > 0),
  CONSTRAINT instant_income_post_sets_niche_not_blank CHECK (length(trim(niche)) > 0),
  CONSTRAINT instant_income_post_sets_posts_is_array CHECK (jsonb_typeof(posts) = 'array')
);

CREATE UNIQUE INDEX IF NOT EXISTS instant_income_post_sets_user_name_uidx
  ON public.instant_income_post_sets (user_id, lower(trim(name)));

CREATE INDEX IF NOT EXISTS instant_income_post_sets_user_updated_idx
  ON public.instant_income_post_sets (user_id, updated_at DESC);

ALTER TABLE public.instant_income_post_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own instant income post sets" ON public.instant_income_post_sets;
CREATE POLICY "Users can view own instant income post sets"
  ON public.instant_income_post_sets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own instant income post sets" ON public.instant_income_post_sets;
CREATE POLICY "Users can insert own instant income post sets"
  ON public.instant_income_post_sets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own instant income post sets" ON public.instant_income_post_sets;
CREATE POLICY "Users can update own instant income post sets"
  ON public.instant_income_post_sets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own instant income post sets" ON public.instant_income_post_sets;
CREATE POLICY "Users can delete own instant income post sets"
  ON public.instant_income_post_sets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.instant_income_post_sets TO authenticated;
GRANT ALL ON TABLE public.instant_income_post_sets TO service_role;
